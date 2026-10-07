import { ADDED_SUGARS, NOVA_INFO } from './constants';
import type { IngredientScore, NovaGroup } from './types';

export function scoreIngredients(ingredientsText = ''): IngredientScore {
  const text = ingredientsText.toLowerCase();
  const found = ADDED_SUGARS.filter((s) => text.includes(s));
  const earlyHits = found.filter((s) => {
    const idx = text.indexOf(s);
    const commasBefore = (text.slice(0, idx).match(/,/g) || []).length;
    return commasBefore < 5; // appears in first 5 ingredients
  });
  return { addedSugars: found, earlyAddedSugars: earlyHits };
}

export function isNovaGroup(value: unknown): value is NovaGroup {
  return value === 1 || value === 2 || value === 3 || value === 4;
}

export function getNovaInfo(nova: unknown) {
  return isNovaGroup(nova) ? NOVA_INFO[nova] : null;
}
