import type { Food, MacroGoals, MealName, NovaGroup, NovaInfo } from './types';

export const DEFAULT_GOALS: MacroGoals = {
  cal: 2000,
  p: 150,
  c: 225,
  f: 65,
};

export const MEAL_NAMES: MealName[] = ['Breakfast', 'Lunch', 'Dinner', 'Snacks'];

export const EMPTY_MEALS = {
  Breakfast: [],
  Lunch: [],
  Dinner: [],
  Snacks: [],
} as const;

export const FOOD_CATEGORIES = ['All', 'Protein', 'Grain', 'Fruit', 'Dairy', 'Snack'] as const;

export const EMPTY_MANUAL = {
  name: '',
  srv: '1 serving',
  cal: '',
  p: '',
  c: '',
  f: '',
};

export const FOOD_DB: Food[] = [
  { name: 'Grilled Chicken Breast', cat: 'Protein', cal: 165, p: 31, c: 0, f: 3.6 },
  { name: 'Brown Rice (1 cup)', cat: 'Grain', cal: 216, p: 5, c: 45, f: 1.8 },
  { name: 'Avocado (half)', cat: 'Fruit', cal: 120, p: 1.5, c: 6, f: 10.5 },
  { name: 'Greek Yogurt (1 cup)', cat: 'Dairy', cal: 150, p: 20, c: 9, f: 4 },
  { name: 'Almonds (1 oz)', cat: 'Snack', cal: 164, p: 6, c: 6, f: 14 },
];

export const NOVA_INFO: Record<NovaGroup, NovaInfo> = {
  1: {
    label: 'Minimally Processed',
    color: '#4A7C6F',
    emoji: '🟢',
    desc: 'Whole or minimally processed food.',
  },
  2: {
    label: 'Processed Ingredient',
    color: '#C49A3C',
    emoji: '🟡',
    desc: 'A culinary ingredient like oil, flour, or sugar.',
  },
  3: {
    label: 'Processed Food',
    color: '#F5832B',
    emoji: '🟠',
    desc: 'Processed with salt, sugar, or other substances.',
  },
  4: {
    label: 'Ultra-Processed',
    color: '#C4445A',
    emoji: '🔴',
    desc: 'Engineered for maximum craving.',
  },
};

export const ADDED_SUGARS = [
  'high fructose corn syrup',
  'corn syrup',
  'dextrose',
  'maltose',
  'sucrose',
  'fructose',
  'glucose',
  'cane sugar',
  'cane juice',
  'evaporated cane',
  'brown sugar',
  'invert sugar',
  'malt syrup',
  'molasses',
  'honey',
  'agave',
  'rice syrup',
  'barley malt',
  'fruit juice concentrate',
];
