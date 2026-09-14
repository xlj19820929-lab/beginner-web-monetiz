import { useState, useEffect, useCallback } from 'react';
import { RefreshCw, Check, Copy } from 'lucide-react';
import ToolHeader from '@/components/ToolHeader';
import CopyButton from '@/components/CopyButton';
import AdSlot from '@/components/AdSlot';
import { toolsById } from '@/data/tools';

const SETS = {
  upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lower: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
};

export default function PasswordGenerator() {
  const tool = toolsById['password-generator'];
  const [length, setLength] = useState(16);
  const [opts, setOpts] = useState({
    upper: true,
    lower: true,
    numbers: true,
    symbols: true,
  });
  const [password, setPassword] = useState('');
  const [strength, setStrength] = useState(0);
  const [copied, setCopied] = useState(false);

  const generate = useCallback(() => {
    let charset = '';
    if (opts.upper) charset += SETS.upper;
    if (opts.lower) charset += SETS.lower;
    if (opts.numbers) charset += SETS.numbers;
    if (opts.symbols) charset += SETS.symbols;
    if (!charset) {
      setPassword('');
      return;
    }

    const arr = new Uint32Array(length);
    crypto.getRandomValues(arr);
    let pwd = '';
    for (let i = 0; i < length; i++) {
      pwd += charset[arr[i] % charset.length];
    }
    setPassword(pwd);
  }, [length, opts]);

  useEffect(() => {
    generate();
  }, [generate]);

  useEffect(() => {
    let poolSize = 0;
    if (opts.upper) poolSize += 26;
    if (opts.lower) poolSize += 26;
    if (opts.numbers) poolSize += 10;
    if (opts.symbols) poolSize += 22;
    if (poolSize === 0) {
      setStrength(0);
      return;
    }
    const entropy = length * Math.log2(poolSize);
    const score = Math.min(100, Math.round((entropy / 100) * 100));
    setStrength(score);
  }, [length, opts]);

  const handleCopy = useCallback(async () => {
    if (!password) return;
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore
    }
  }, [password]);

  const strengthLabel =
    strength < 40 ? 'Weak' : strength < 70 ? 'Fair' : strength < 90 ? 'Strong' : 'Very Strong';
  const strengthColor =
    strength < 40 ? 'bg-red-500' : strength < 70 ? 'bg-amber-500' : 'bg-brand-500';

  const toggle = (key: keyof typeof opts) =>
    setOpts((p) => ({ ...p, [key]: !p[key] }));

  return (
    <div className="tool-shell">
      <ToolHeader tool={tool} />

      {/* Password display */}
      <div className="bg-white rounded-2xl border border-ink-200 p-6 mb-6">
        <div className="flex items-center gap-3">
          <code className="flex-1 font-mono text-lg sm:text-xl text-ink-800 break-all min-h-[2rem]">
            {password || 'Select at least one character set…'}
          </code>
          <button
            onClick={handleCopy}
            className="btn-secondary shrink-0"
            disabled={!password}
          >
            {copied ? <Check className="w-4 h-4 text-brand-600" /> : <Copy className="w-4 h-4" />}
            <span className="hidden sm:inline">{copied ? 'Copied!' : 'Copy'}</span>
          </button>
          <button onClick={generate} className="btn-secondary shrink-0">
            <RefreshCw className="w-4 h-4" />
            <span className="hidden sm:inline">New</span>
          </button>
        </div>

        {/* Strength bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm mb-1.5">
            <span className="text-ink-500">Strength</span>
            <span className={`font-semibold ${strength < 40 ? 'text-red-500' : strength < 70 ? 'text-amber-600' : 'text-brand-600'}`}>
              {strengthLabel}
            </span>
          </div>
          <div className="h-2 rounded-full bg-ink-100 overflow-hidden">
            <div
              className={`h-full ${strengthColor} transition-all duration-300 rounded-full`}
              style={{ width: `${strength}%` }}
            />
          </div>
        </div>
      </div>

      {/* Options */}
      <div className="bg-white rounded-2xl border border-ink-200 p-6 space-y-6">
        {/* Length */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="font-semibold text-ink-800">Length</label>
            <span className="font-mono text-brand-600 font-semibold">{length}</span>
          </div>
          <input
            type="range"
            min={4}
            max={64}
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            className="w-full accent-brand-600"
          />
          <div className="flex justify-between text-xs text-ink-400 mt-1">
            <span>4</span>
            <span>64</span>
          </div>
        </div>

        {/* Character sets */}
        <div>
          <label className="font-semibold text-ink-800 block mb-3">Character Sets</label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { key: 'upper' as const, label: 'Uppercase (A-Z)' },
              { key: 'lower' as const, label: 'Lowercase (a-z)' },
              { key: 'numbers' as const, label: 'Numbers (0-9)' },
              { key: 'symbols' as const, label: 'Symbols (!@#$)' },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => toggle(key)}
                className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border transition-all text-sm font-medium ${
                  opts[key]
                    ? 'border-brand-400 bg-brand-50 text-brand-700'
                    : 'border-ink-200 bg-white text-ink-500 hover:border-ink-300'
                }`}
              >
                <span className={`w-5 h-5 rounded-md flex items-center justify-center text-xs ${opts[key] ? 'bg-brand-600 text-white' : 'bg-ink-100 text-transparent'}`}>
                  <Check className="w-3.5 h-3.5" />
                </span>
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {password && (
        <div className="mt-6 flex justify-center">
          <CopyButton value={password} label="Copy password" />
        </div>
      )}
      <AdSlot slot="5555555555" />
    </div>
  );
}
