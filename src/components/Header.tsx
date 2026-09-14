import { useState, useEffect } from 'react';
import { Wrench, Home, Menu, X, Info, Mail, Shield, FileText, AlertTriangle } from 'lucide-react';
import { navigate } from '@/lib/router';

interface HeaderProps {
  currentPath: string;
}

const navItems = [
  { path: '/', label: 'All Tools', icon: Home },
  { path: '/about', label: 'About', icon: Info },
  { path: '/contact', label: 'Contact', icon: Mail },
  { path: '/privacy-policy', label: 'Privacy Policy', icon: Shield },
  { path: '/terms', label: 'Terms of Service', icon: FileText },
  { path: '/disclaimer', label: 'Disclaimer', icon: AlertTriangle },
];

export default function Header({ currentPath }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  // Close the mobile menu whenever the route changes.
  useEffect(() => {
    setMenuOpen(false);
  }, [currentPath]);

  // Prevent the page behind the mobile menu from scrolling.
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const go = (path: string) => {
    navigate(path);
    setMenuOpen(false);
  };

  const isActive = (path: string) =>
    path === '/' ? currentPath === '/' : currentPath.startsWith(path);

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-ink-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        <button
          onClick={() => go('/')}
          className="flex items-center gap-2 font-bold text-lg text-ink-900 transition-colors hover:text-brand-600 shrink-0"
          aria-label="ToolKit home"
        >
          <span className="w-9 h-9 rounded-xl bg-brand-600 text-white flex items-center justify-center">
            <Wrench className="w-5 h-5" />
          </span>
          <span className="inline">ToolKit</span>
        </button>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center gap-1">
          <button
            onClick={() => go('/')}
            className={`btn-ghost ${currentPath === '/' ? 'text-brand-600 bg-brand-50' : ''}`}
          >
            <Home className="w-4 h-4" />
            All Tools
          </button>
          <button
            onClick={() => go('/about')}
            className={`btn-ghost ${isActive('/about') ? 'text-brand-600 bg-brand-50' : ''}`}
          >
            About
          </button>
          <button
            onClick={() => go('/contact')}
            className={`btn-ghost ${isActive('/contact') ? 'text-brand-600 bg-brand-50' : ''}`}
          >
            Contact
          </button>
        </nav>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="md:hidden p-2 -mr-2 rounded-lg text-ink-700 hover:bg-ink-100 transition-colors"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile navigation panel */}
      {menuOpen && (
        <>
          <button
            aria-hidden="true"
            tabIndex={-1}
            onClick={() => setMenuOpen(false)}
            className="md:hidden fixed inset-0 top-16 bg-ink-900/20 backdrop-blur-[1px] cursor-default"
          />
          <nav
            id="mobile-menu"
            className="md:hidden relative bg-white border-b border-ink-200 shadow-lg animate-slide-up"
          >
            <ul className="max-w-6xl mx-auto px-4 sm:px-6 py-3 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <li key={item.path}>
                    <button
                      onClick={() => go(item.path)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left font-medium transition-colors ${
                        active
                          ? 'bg-brand-50 text-brand-700'
                          : 'text-ink-700 hover:bg-ink-50'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      {item.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        </>
      )}
    </header>
  );
}
