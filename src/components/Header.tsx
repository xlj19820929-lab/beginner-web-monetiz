import { Wrench, Home } from 'lucide-react';
import { navigate } from '@/lib/router';

interface HeaderProps {
  currentPath: string;
}

export default function Header({ currentPath }: HeaderProps) {
  const isHome = currentPath === '/';
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-ink-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 font-bold text-lg text-ink-900 transition-colors hover:text-brand-600"
        >
          <span className="w-9 h-9 rounded-xl bg-brand-600 text-white flex items-center justify-center">
            <Wrench className="w-5 h-5" />
          </span>
          <span className="hidden sm:inline">ToolKit</span>
        </button>

        <nav className="flex items-center gap-1">
          <button
            onClick={() => navigate('/')}
            className={`btn-ghost ${isHome ? 'text-brand-600 bg-brand-50' : ''}`}
          >
            <Home className="w-4 h-4" />
            <span className="hidden sm:inline">All Tools</span>
          </button>
        </nav>
      </div>
    </header>
  );
}
