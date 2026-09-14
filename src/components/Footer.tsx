import { Wrench, Heart } from 'lucide-react';
import { navigate } from '@/lib/router';

export default function Footer() {
  return (
    <footer className="border-t border-ink-200 bg-white mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-ink-600">
            <span className="w-8 h-8 rounded-lg bg-brand-600 text-white flex items-center justify-center">
              <Wrench className="w-4 h-4" />
            </span>
            <span className="font-semibold text-ink-800">ToolKit</span>
            <span className="text-ink-400 text-sm">— Free online tools</span>
          </div>
          <p className="text-sm text-ink-400 flex items-center gap-1.5">
            Made with <Heart className="w-3.5 h-3.5 text-brand-500" /> for everyone
          </p>
        </div>
        <div className="flex items-center justify-center gap-4 mt-6">
          <button
            onClick={() => navigate('/privacy-policy')}
            className="text-sm text-ink-400 hover:text-brand-600 transition-colors"
          >
            Privacy Policy
          </button>
        </div>
        <p className="text-center text-xs text-ink-400 mt-4">
          All tools run entirely in your browser. Your data never leaves your device.
        </p>
      </div>
    </footer>
  );
}
