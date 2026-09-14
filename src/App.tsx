import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HomePage from '@/pages/HomePage';
import PasswordGenerator from '@/pages/tools/PasswordGenerator';
import WordCounter from '@/pages/tools/WordCounter';
import UnitConverter from '@/pages/tools/UnitConverter';
import ColorConverter from '@/pages/tools/ColorConverter';
import CaseConverter from '@/pages/tools/CaseConverter';
import BMICalculator from '@/pages/tools/BMICalculator';
import PrivacyPolicy from '@/pages/PrivacyPolicy';
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

function App() {
  const [path, setPath] = useState(currentPath());

  useEffect(() => {
    setRouter((p: string) => setPath(p));
  }, []);

  // Parse route
  const toolMatch = path.match(/^\/tools\/(.+)$/);
  const toolId = toolMatch?.[1] as ToolId | undefined;

  let page: JSX.Element;
  if (path === '/') {
    page = <HomePage />;
  } else if (path === '/privacy-policy') {
    page = <PrivacyPolicy />;
  } else if (toolId && toolRoutes[toolId]) {
    const ToolComponent = toolRoutes[toolId];
    page = <ToolComponent />;
  } else if (toolId) {
    page = (
      <div className="max-w-2xl mx-auto py-20 text-center">
        <h1 className="text-3xl font-bold text-ink-800 mb-3">Tool not found</h1>
        <p className="text-ink-500 mb-6">The tool you're looking for doesn't exist.</p>
        <button onClick={() => navigate('/')} className="btn-primary">
          Back to all tools
        </button>
      </div>
    );
  } else {
    page = (
      <div className="max-w-2xl mx-auto py-20 text-center">
        <h1 className="text-3xl font-bold text-ink-800 mb-3">Page not found</h1>
        <button onClick={() => navigate('/')} className="btn-primary">
          Go home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-ink-50">
      <Header currentPath={path} />
      <main className="flex-1">{page}</main>
      <Footer />
    </div>
  );
}

export default App;
