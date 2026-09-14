import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CookieConsent from '@/components/CookieConsent';
import HomePage from '@/pages/HomePage';
import PasswordGenerator from '@/pages/tools/PasswordGenerator';
import WordCounter from '@/pages/tools/WordCounter';
import UnitConverter from '@/pages/tools/UnitConverter';
import ColorConverter from '@/pages/tools/ColorConverter';
import CaseConverter from '@/pages/tools/CaseConverter';
import BMICalculator from '@/pages/tools/BMICalculator';
import PrivacyPolicy from '@/pages/PrivacyPolicy';
import TermsOfService from '@/pages/TermsOfService';
import Disclaimer from '@/pages/Disclaimer';
import About from '@/pages/About';
import Contact from '@/pages/Contact';
import { setRouter, currentPath, navigate } from '@/lib/router';
import type { ToolId } from '@/data/tools';

const toolRoutes: Record<string, () => JSX.Element> = {
  'password-generator': PasswordGenerator,
  'word-counter': WordCounter,
  'unit-converter': UnitConverter,
  'color-converter': ColorConverter,
  'case-converter': CaseConverter,
  'bmi-calculator': BMICalculator,
};

/** Static pages available at a fixed path. */
const staticRoutes: Record<string, () => JSX.Element> = {
  '/privacy-policy': PrivacyPolicy,
  '/terms': TermsOfService,
  '/disclaimer': Disclaimer,
  '/about': About,
  '/contact': Contact,
};

function NotFound({ title, message }: { title: string; message: string }) {
  return (
    <div className="max-w-2xl mx-auto py-20 px-4 text-center">
      <h1 className="text-3xl font-bold text-ink-800 mb-3">{title}</h1>
      <p className="text-ink-500 mb-6">{message}</p>
      <button onClick={() => navigate('/')} className="btn-primary">
        Back to all tools
      </button>
    </div>
  );
}

function App() {
  const [path, setPath] = useState(currentPath());

  useEffect(() => {
    setRouter((p: string) => setPath(p));
  }, []);

  // The router state must also track browser back/forward and direct loads.
  useEffect(() => {
    const onPop = () => setPath(window.location.pathname);
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  // Normalise the path before matching. Static hosts (Cloudflare Pages, most
  // CDNs) may serve or redirect to a trailing-slash URL such as
  // `/privacy-policy/`; without this, the exact-match lookups below would miss
  // and every page would render as "not found".
  const route = path.length > 1 ? path.replace(/\/+$/, '') : path;

  // Parse route
  const toolMatch = route.match(/^\/tools\/(.+)$/);
  const toolId = toolMatch?.[1] as ToolId | undefined;
  const StaticPage = staticRoutes[route];

  let page: JSX.Element;
  if (route === '/') {
    page = <HomePage />;
  } else if (StaticPage) {
    page = <StaticPage />;
  } else if (toolId && toolRoutes[toolId]) {
    const ToolComponent = toolRoutes[toolId];
    page = <ToolComponent />;
  } else if (toolId) {
    page = (
      <NotFound
        title="Tool not found"
        message="The tool you're looking for doesn't exist."
      />
    );
  } else {
    page = (
      <NotFound
        title="Page not found"
        message="The page you're looking for doesn't exist or may have been moved."
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-ink-50">
      <Header currentPath={path} />
      <main className="flex-1">{page}</main>
      <Footer />
      <CookieConsent />
    </div>
  );
}

export default App;
