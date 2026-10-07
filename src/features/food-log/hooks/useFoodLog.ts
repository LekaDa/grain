import { useMemo, useState } from 'react';

import {
  DEFAULT_GOALS,
  EMPTY_MANUAL,
  EMPTY_MEALS,
} from '../constants';
import { createLoggedFood, filterFoods, totalsFromMeals } from '../nutrition';
import type {
  Food,
  MacroGoals,
  ManualFoodInput,
  MealName,
  Meals,
  ScannedProduct,
} from '../types';

type UseFoodLogOptions = {
  macroGoals?: MacroGoals;
};

export function useFoodLog({ macroGoals }: UseFoodLogOptions = {}) {
  const goals = macroGoals ?? DEFAULT_GOALS;
  const [meals, setMeals] = useState<Meals>({
    Breakfast: [...EMPTY_MEALS.Breakfast],
    Lunch: [...EMPTY_MEALS.Lunch],
    Dinner: [...EMPTY_MEALS.Dinner],
    Snacks: [...EMPTY_MEALS.Snacks],
  });
  const [addingTo, setAddingTo] = useState<MealName | null>(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [manual, setManual] = useState<ManualFoodInput>(EMPTY_MANUAL);
  const [lastScanned, setLastScanned] = useState<ScannedProduct | null>(null);
  const [scanTarget, setScanTarget] = useState<MealName | null>(null);

  const totals = useMemo(() => totalsFromMeals(meals), [meals]);
  const filteredFoods = useMemo(
    () => filterFoods(search, category),
    [search, category],
  );

  const toggleAddingTo = (meal: MealName) => {
    setAddingTo((current) => (current === meal ? null : meal));
    setSearch('');
  };

  const addFood = (meal: MealName, food: Food) => {
    setMeals((prev) => ({
      ...prev,
      [meal]: [...prev[meal], createLoggedFood(food)],
    }));
    setAddingTo(null);
    setSearch('');
    setLastScanned(null);
    setScanTarget(null);
  };

  const removeFood = (meal: MealName, uid: string) => {
    setMeals((prev) => ({
      ...prev,
      [meal]: prev[meal].filter((food) => food.uid !== uid),
    }));
  };

  const addManual = () => {
    if (!manual.name.trim() || !manual.cal) return false;
    addFood(addingTo || 'Snacks', {
      name: `${manual.name} (${manual.srv})`,
      cal: Number(manual.cal),
      p: Number(manual.p) || 0,
      c: Number(manual.c) || 0,
      f: Number(manual.f) || 0,
    });
    setManual(EMPTY_MANUAL);
    return true;
  };

  const assignScannedToMeal = (meal: MealName) => {
    if (!lastScanned) return;
    addFood(meal, lastScanned);
  };

  const dismissScanned = () => {
    setLastScanned(null);
    setScanTarget(null);
  };

  return {
    goals,
    meals,
    totals,
    addingTo,
    search,
    setSearch,
    category,
    setCategory,
    manual,
    setManual,
    lastScanned,
    setLastScanned,
    scanTarget,
    setScanTarget,
    filteredFoods,
    toggleAddingTo,
    addFood,
    removeFood,
    addManual,
    assignScannedToMeal,
    dismissScanned,
  };
}
