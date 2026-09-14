import { useState, useMemo } from 'react';
import { ArrowLeftRight } from 'lucide-react';
import ToolHeader from '@/components/ToolHeader';
import AdSlot from '@/components/AdSlot';
import { toolsById } from '@/data/tools';

type Category = 'length' | 'weight' | 'temperature';

interface Unit {
  id: string;
  label: string;
  toBase: (v: number) => number;
  fromBase: (v: number) => number;
}

const categories: Record<Category, { label: string; units: Unit[] }> = {
  length: {
    label: 'Length',
    units: [
      { id: 'm', label: 'Meters (m)', toBase: (v) => v, fromBase: (v) => v },
      { id: 'km', label: 'Kilometers (km)', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
      { id: 'cm', label: 'Centimeters (cm)', toBase: (v) => v / 100, fromBase: (v) => v * 100 },
      { id: 'mm', label: 'Millimeters (mm)', toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
      { id: 'mi', label: 'Miles (mi)', toBase: (v) => v * 1609.344, fromBase: (v) => v / 1609.344 },
      { id: 'yd', label: 'Yards (yd)', toBase: (v) => v * 0.9144, fromBase: (v) => v / 0.9144 },
      { id: 'ft', label: 'Feet (ft)', toBase: (v) => v * 0.3048, fromBase: (v) => v / 0.3048 },
      { id: 'in', label: 'Inches (in)', toBase: (v) => v * 0.0254, fromBase: (v) => v / 0.0254 },
    ],
  },
  weight: {
    label: 'Weight',
    units: [
      { id: 'kg', label: 'Kilograms (kg)', toBase: (v) => v, fromBase: (v) => v },
      { id: 'g', label: 'Grams (g)', toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
      { id: 'mg', label: 'Milligrams (mg)', toBase: (v) => v / 1e6, fromBase: (v) => v * 1e6 },
      { id: 'lb', label: 'Pounds (lb)', toBase: (v) => v * 0.453592, fromBase: (v) => v / 0.453592 },
      { id: 'oz', label: 'Ounces (oz)', toBase: (v) => v * 0.0283495, fromBase: (v) => v / 0.0283495 },
      { id: 't', label: 'Tonnes (t)', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
    ],
  },
  temperature: {
    label: 'Temperature',
    units: [
      { id: 'c', label: 'Celsius (°C)', toBase: (v) => v, fromBase: (v) => v },
      { id: 'f', label: 'Fahrenheit (°F)', toBase: (v) => (v - 32) * 5/9, fromBase: (v) => v * 9/5 + 32 },
      { id: 'k', label: 'Kelvin (K)', toBase: (v) => v - 273.15, fromBase: (v) => v + 273.15 },
    ],
  },
};

const categoryLabels: Record<Category, string> = {
  length: 'Length',
  weight: 'Weight',
  temperature: 'Temperature',
};

export default function UnitConverter() {
  const tool = toolsById['unit-converter'];
  const [category, setCategory] = useState<Category>('length');
  const [fromUnit, setFromUnit] = useState('m');
  const [toUnit, setToUnit] = useState('ft');
  const [input, setInput] = useState('1');

  const units = categories[category].units;

  const result = useMemo(() => {
    const val = parseFloat(input);
    if (isNaN(val)) return '';
    const from = units.find((u) => u.id === fromUnit);
    const to = units.find((u) => u.id === toUnit);
    if (!from || !to) return '';
    const base = from.toBase(val);
    const out = to.fromBase(base);
    return Number.isInteger(out) ? out.toString() : parseFloat(out.toFixed(6)).toString();
  }, [input, fromUnit, toUnit, units]);

  const handleCategoryChange = (cat: Category) => {
    setCategory(cat);
    const cats = categories[cat].units;
    setFromUnit(cats[0].id);
    setToUnit(cats[1].id);
  };

  const swap = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
    if (result) setInput(result);
  };

  return (
    <div className="tool-shell">
      <ToolHeader tool={tool} />

      {/* Category tabs */}
      <div className="flex gap-2 mb-6">
        {(Object.keys(categories) as Category[]).map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryChange(cat)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              category === cat
                ? 'bg-brand-600 text-white'
                : 'bg-white border border-ink-200 text-ink-600 hover:border-ink-300'
            }`}
          >
            {categoryLabels[cat]}
          </button>
        ))}
      </div>

      {/* Converter */}
      <div className="bg-white rounded-2xl border border-ink-200 p-6">
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] gap-4 items-end">
          {/* From */}
          <div>
            <label className="text-sm font-medium text-ink-600 block mb-2">From</label>
            <select
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value)}
              className="input-field mb-3"
            >
              {units.map((u) => (
                <option key={u.id} value={u.id}>{u.label}</option>
              ))}
            </select>
            <input
              type="number"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter value"
              className="input-field"
            />
          </div>

          {/* Swap button */}
          <div className="flex justify-center pb-3">
            <button
              onClick={swap}
              className="w-10 h-10 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center transition-all hover:bg-brand-600 hover:text-white active:scale-90"
              title="Swap units"
            >
              <ArrowLeftRight className="w-5 h-5" />
            </button>
          </div>

          {/* To */}
          <div>
            <label className="text-sm font-medium text-ink-600 block mb-2">To</label>
            <select
              value={toUnit}
              onChange={(e) => setToUnit(e.target.value)}
              className="input-field mb-3"
            >
              {units.map((u) => (
                <option key={u.id} value={u.id}>{u.label}</option>
              ))}
            </select>
            <div className="input-field bg-ink-50 font-mono text-lg text-ink-800 min-h-[2.75rem] flex items-center">
              {result || '—'}
            </div>
          </div>
        </div>

        {/* Result highlight */}
        {result && input && (
          <div className="mt-6 p-4 rounded-xl bg-brand-50 border border-brand-100 text-center animate-fade-in">
            <p className="text-lg text-ink-700">
              <span className="font-bold text-brand-700">{input}</span>{' '}
              {units.find((u) => u.id === fromUnit)?.label.split(' ')[0]} ={' '}
              <span className="font-bold text-brand-700">{result}</span>{' '}
              {units.find((u) => u.id === toUnit)?.label.split(' ')[0]}
            </p>
          </div>
        )}
      </div>
      <AdSlot slot="6666666666" />
    </div>
  );
}
