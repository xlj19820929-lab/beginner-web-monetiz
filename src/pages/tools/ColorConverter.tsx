import { useState, useMemo } from 'react';
import ToolHeader from '@/components/ToolHeader';
import CopyButton from '@/components/CopyButton';
import AdSlot from '@/components/AdSlot';
import { toolsById } from '@/data/tools';

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  let h = hex.replace('#', '').trim();
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  if (h.length !== 6 || !/^[0-9a-fA-F]{6}$/.test(h)) return null;
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
}

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map((x) => Math.round(x).toString(16).padStart(2, '0')).join('').toUpperCase();
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)); break;
      case g: h = ((b - r) / d + 2); break;
      case b: h = ((r - g) / d + 4); break;
    }
    h /= 6;
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

export default function ColorConverter() {
  const tool = toolsById['color-converter'];
  const [hex, setHex] = useState('#16B67E');
  const [picker, setPicker] = useState('#16b67e');

  const rgb = useMemo(() => hexToRgb(hex), [hex]);
  const hsl = useMemo(() => (rgb ? rgbToHsl(rgb.r, rgb.g, rgb.b) : null), [rgb]);

  const rgbStr = rgb ? `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` : '';
  const hslStr = hsl ? `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` : '';

  const handlePicker = (val: string) => {
    setPicker(val);
    setHex(val.toUpperCase());
  };

  const handleHexInput = (val: string) => {
    const v = val.startsWith('#') ? val : '#' + val;
    setHex(v.toUpperCase());
    if (hexToRgb(v)) {
      setPicker(v.toLowerCase());
    }
  };

  return (
    <div className="tool-shell">
      <ToolHeader tool={tool} />

      {/* Color preview */}
      <div
        className="h-32 rounded-2xl border border-ink-200 mb-6 transition-colors duration-200"
        style={{ backgroundColor: rgb ? rgbStr : '#e2e8f0' }}
      />

      {/* Color picker */}
      <div className="bg-white rounded-2xl border border-ink-200 p-6 mb-6">
        <label className="text-sm font-medium text-ink-600 block mb-3">Color Picker</label>
        <div className="flex items-center gap-4">
          <input
            type="color"
            value={picker}
            onChange={(e) => handlePicker(e.target.value)}
            className="w-16 h-16 rounded-xl border border-ink-200 cursor-pointer bg-white"
          />
          <input
            type="text"
            value={hex}
            onChange={(e) => handleHexInput(e.target.value)}
            placeholder="#000000"
            className="input-field font-mono text-lg"
          />
        </div>
      </div>

      {/* Output formats */}
      <div className="space-y-3">
        {[
          { label: 'HEX', value: hex, valid: !!rgb },
          { label: 'RGB', value: rgbStr, valid: !!rgb },
          { label: 'HSL', value: hslStr, valid: !!rgb },
        ].map((item) => (
          <div
            key={item.label}
            className="bg-white rounded-2xl border border-ink-200 p-4 flex items-center gap-4"
          >
            <span className="text-sm font-semibold text-ink-400 w-12 shrink-0">{item.label}</span>
            <code className="flex-1 font-mono text-base text-ink-800 truncate">
              {item.valid ? item.value : 'Invalid color'}
            </code>
            {item.valid && <CopyButton value={item.value} />}
          </div>
        ))}
      </div>
      <AdSlot slot="4444444444" />
    </div>
  );
}
