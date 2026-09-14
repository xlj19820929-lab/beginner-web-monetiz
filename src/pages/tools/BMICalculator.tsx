import { useState, useMemo } from 'react';
import ToolHeader from '@/components/ToolHeader';
import AdSlot from '@/components/AdSlot';
import {
  LocalProcessingNote,
  HowToUse,
  Faq,
  OtherTools,
  type BiText,
  type FaqItem,
} from '@/components/ToolExtras';
import { toolsById } from '@/data/tools';

type System = 'metric' | 'imperial';

interface BMIResult {
  bmi: number;
  category: string;
  color: string;
  bgColor: string;
  healthyMin: number;
  healthyMax: number;
}

function calcBMI(system: System, val1: number, val2: number): BMIResult | null {
  let weightKg: number;
  let heightM: number;

  if (system === 'metric') {
    weightKg = val1;
    heightM = val2 / 100;
  } else {
    weightKg = val1 * 0.453592;
    const totalInches = val2 * 12 + val2; // val2 is inches
    heightM = totalInches * 0.0254;
  }

  if (weightKg <= 0 || heightM <= 0) return null;
  const bmi = weightKg / (heightM * heightM);

  let category: string, color: string, bgColor: string;
  if (bmi < 18.5) {
    category = 'Underweight';
    color = 'text-blue-600';
    bgColor = 'bg-blue-50 border-blue-100';
  } else if (bmi < 25) {
    category = 'Healthy';
    color = 'text-brand-600';
    bgColor = 'bg-brand-50 border-brand-100';
  } else if (bmi < 30) {
    category = 'Overweight';
    color = 'text-amber-600';
    bgColor = 'bg-amber-50 border-amber-100';
  } else {
    category = 'Obese';
    color = 'text-red-600';
    bgColor = 'bg-red-50 border-red-100';
  }

  return {
    bmi: Math.round(bmi * 10) / 10,
    category,
    color,
    bgColor,
    healthyMin: Math.round(18.5 * heightM * heightM * 10) / 10,
    healthyMax: Math.round(24.9 * heightM * heightM * 10) / 10,
  };
}

const howToSteps: BiText[] = [
  {
    en: 'Choose metric or imperial units.',
    zh: '选择公制或英制单位。',
  },
  {
    en: 'Enter your weight and height in the fields above.',
    zh: '在上方输入你的体重和身高。',
  },
  {
    en: 'Your BMI, category and healthy weight range appear instantly.',
    zh: '系统会立即显示你的 BMI、所属类别以及健康体重范围。',
  },
];

const faqs: FaqItem[] = [
  {
    questionEn: 'Do you store my weight and height?',
    questionZh: '你们会保存我的体重和身高吗？',
    answerEn:
      'No. The BMI calculation runs entirely in your browser. The numbers you enter are never sent to or stored on our server.',
    answerZh:
      '不会。BMI 计算完全在你的浏览器本地进行，你输入的数值不会发送或保存在我们服务器。',
  },
  {
    questionEn: 'Which unit systems are supported?',
    questionZh: '支持哪些单位制式？',
    answerEn:
      'Both metric (kilograms and centimeters) and imperial (pounds and inches) are supported, and you can switch between them at any time.',
    answerZh:
      '同时支持公制（千克、厘米）和英制（磅、英寸），你可以随时切换。',
  },
  {
    questionEn: 'Is this BMI calculator free?',
    questionZh: '这个 BMI 计算器是免费的吗？',
    answerEn: 'Yes, it is completely free and no account is required.',
    answerZh: '是的，完全免费，无需注册账号。',
  },
];

export default function BMICalculator() {
  const tool = toolsById['bmi-calculator'];
  const [system, setSystem] = useState<System>('metric');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');

  // For imperial: weight = lbs, height = ft (simplified — single inches input)
  const result = useMemo(() => {
    const w = parseFloat(weight);
    const h = parseFloat(height);
    if (isNaN(w) || isNaN(h)) return null;
    return calcBMI(system, w, h);
  }, [system, weight, height]);

  const switchSystem = (s: System) => {
    setSystem(s);
    setWeight('');
    setHeight('');
  };

  return (
    <div className="tool-shell">
      <ToolHeader tool={tool} />

      {/* System toggle */}
      <div className="flex gap-2 mb-6">
        {(['metric', 'imperial'] as System[]).map((sys) => (
          <button
            key={sys}
            onClick={() => switchSystem(sys)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all capitalize ${
              system === sys
                ? 'bg-brand-600 text-white'
                : 'bg-white border border-ink-200 text-ink-600 hover:border-ink-300'
            }`}
          >
            {sys === 'metric' ? 'Metric (kg, cm)' : 'Imperial (lb, in)'}
          </button>
        ))}
      </div>

      {/* Inputs */}
      <div className="bg-white rounded-2xl border border-ink-200 p-6 mb-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-ink-600 block mb-2">
              {system === 'metric' ? 'Weight (kg)' : 'Weight (lb)'}
            </label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder={system === 'metric' ? 'e.g. 70' : 'e.g. 154'}
              className="input-field"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-ink-600 block mb-2">
              {system === 'metric' ? 'Height (cm)' : 'Height (inches)'}
            </label>
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              placeholder={system === 'metric' ? 'e.g. 175' : 'e.g. 69'}
              className="input-field"
            />
          </div>
        </div>
        {system === 'imperial' && (
          <p className="text-xs text-ink-400 mt-3">
            Tip: 5 ft 9 in = 69 inches
          </p>
        )}
      </div>

      {/* Result */}
      {result ? (
        <div className={`rounded-2xl border p-6 text-center animate-scale-in ${result.bgColor}`}>
          <p className="text-sm text-ink-500 mb-1">Your BMI</p>
          <p className={`text-5xl font-extrabold ${result.color}`}>{result.bmi}</p>
          <p className={`text-lg font-semibold mt-2 ${result.color}`}>{result.category}</p>
          <div className="mt-4 pt-4 border-t border-ink-100/60">
            <p className="text-sm text-ink-600">
              Healthy weight range:{' '}
              <span className="font-semibold text-ink-800">
                {result.healthyMin} – {result.healthyMax} {system === 'metric' ? 'kg' : 'lb'}
              </span>
            </p>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-ink-200 bg-white p-8 text-center text-ink-400">
          Enter your weight and height to see your BMI
        </div>
      )}

      {/* Scale reference */}
      <div className="mt-6 bg-white rounded-2xl border border-ink-200 p-5">
        <p className="text-sm font-medium text-ink-600 mb-3">BMI Categories</p>
        <div className="space-y-2 text-sm">
          {[
            { range: '< 18.5', label: 'Underweight', color: 'text-blue-600' },
            { range: '18.5 – 24.9', label: 'Healthy', color: 'text-brand-600' },
            { range: '25 – 29.9', label: 'Overweight', color: 'text-amber-600' },
            { range: '≥ 30', label: 'Obese', color: 'text-red-600' },
          ].map((row) => (
            <div key={row.label} className="flex items-center justify-between py-1.5 border-b border-ink-50 last:border-0">
              <span className={`font-medium ${row.color}`}>{row.label}</span>
              <span className="text-ink-500 font-mono">{row.range}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Local processing note */}
      <LocalProcessingNote
        en="All processing runs locally in your browser. Your weight and height will never be uploaded or stored on our server."
        zh="所有计算在浏览器本地执行，你的体重和身高永远不会上传或保存在我们服务器。"
      />

      <HowToUse steps={howToSteps} />
      <Faq items={faqs} />
      <OtherTools currentToolId={tool.id} />

      <AdSlot slot="2222222222" />
    </div>
  );
}
