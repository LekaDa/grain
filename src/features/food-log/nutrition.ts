import { FOOD_DB } from './constants';
import type { Food, LoggedFood, MacroTotals, Meals } from './types';

export function sumMacros(foods: Pick<LoggedFood, 'cal' | 'p' | 'c' | 'f'>[]): MacroTotals {
  return foods.reduce(
    (acc, food) => ({
      cal: acc.cal + food.cal,
      p: acc.p + food.p,
      c: acc.c + food.c,
      f: acc.f + food.f,
    }),
    { cal: 0, p: 0, c: 0, f: 0 },
  );
}

export function totalsFromMeals(meals: Meals): MacroTotals {
  return sumMacros(Object.values(meals).flat());
}

export function progressPct(used: number, goal: number): number {
  if (goal <= 0) return 0;
  return Math.min(100, (used / goal) * 100);
}

export function filterFoods(search: string, category: string, limit = 12): Food[] {
  const query = search.trim().toLowerCase();
  return FOOD_DB.filter(
    (food) =>
      (category === 'All' || food.cat === category) &&
      food.name.toLowerCase().includes(query),
  ).slice(0, limit);
}

export function createLoggedFood(food: Food): LoggedFood {
  return {
    ...food,
    uid: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  };
}
