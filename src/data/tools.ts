import {
  KeyRound,
  FileText,
  Ruler,
  Palette,
  Type,
  HeartPulse,
  type LucideIcon,
} from 'lucide-react';

export type ToolId =
  | 'password-generator'
  | 'word-counter'
  | 'unit-converter'
  | 'color-converter'
  | 'case-converter'
  | 'bmi-calculator';

export interface ToolMeta {
  id: ToolId;
  name: string;
  short: string;
  description: string;
  icon: LucideIcon;
  keywords: string[];
  category: 'text' | 'dev' | 'health' | 'utility';
}

export const tools: ToolMeta[] = [
  {
    id: 'password-generator',
    name: 'Password Generator',
    short: 'Create strong, random passwords',
    description:
      'Generate secure, random passwords with customizable length and character sets. Everything runs locally in your browser — nothing is ever sent anywhere.',
    icon: KeyRound,
    keywords: ['password', 'generator', 'security', 'random', 'strong'],
    category: 'dev',
  },
  {
    id: 'word-counter',
    name: 'Word Counter',
    short: 'Count words, characters & sentences',
    description:
      'Instantly count words, characters, sentences, paragraphs and reading time. Perfect for essays, blog posts, and social media.',
    icon: FileText,
    keywords: ['word', 'count', 'character', 'letter', 'sentence', 'reading time'],
    category: 'text',
  },
  {
    id: 'unit-converter',
    name: 'Unit Converter',
    short: 'Convert length, weight & temperature',
    description:
      'Convert between metric and imperial units for length, weight, and temperature. Fast, accurate, and easy to use.',
    icon: Ruler,
    keywords: ['unit', 'convert', 'length', 'weight', 'temperature', 'metric', 'imperial'],
    category: 'utility',
  },
  {
    id: 'color-converter',
    name: 'Color Converter',
    short: 'Convert HEX, RGB & HSL colors',
    description:
      'Convert colors between HEX, RGB, and HSL formats. Pick any color and get all formats with a live preview.',
    icon: Palette,
    keywords: ['color', 'hex', 'rgb', 'hsl', 'convert', 'picker', 'css'],
    category: 'dev',
  },
  {
    id: 'case-converter',
    name: 'Case Converter',
    short: 'Transform text case instantly',
    description:
      'Convert text to upper case, lower case, title case, sentence case, camelCase, snake_case, and kebab-case.',
    icon: Type,
    keywords: ['case', 'upper', 'lower', 'title', 'camel', 'snake', 'kebab', 'text'],
    category: 'text',
  },
  {
    id: 'bmi-calculator',
    name: 'BMI Calculator',
    short: 'Calculate your Body Mass Index',
    description:
      'Calculate your Body Mass Index (BMI) with metric or imperial units. See your BMI category and healthy weight range.',
    icon: HeartPulse,
    keywords: ['bmi', 'body', 'mass', 'index', 'health', 'weight', 'calculator'],
    category: 'health',
  },
];

export const toolsById: Record<ToolId, ToolMeta> = Object.fromEntries(
  tools.map((t) => [t.id, t])
) as Record<ToolId, ToolMeta>;
