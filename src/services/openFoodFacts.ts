import { getNovaInfo, scoreIngredients } from '@/features/food-log/scoring';
import type { OpenFoodFactsResponse, ScannedProduct } from '@/features/food-log/types';

const OFF_FIELDS = [
  'product_name',
  'nutriments',
  'nova_group',
  'ingredients_text',
  'additives_tags',
  'nutriscore_grade',
].join(',');

export class ProductNotFoundError extends Error {
  constructor(barcode: string) {
    super(`No Open Food Facts product for barcode ${barcode}`);
    this.name = 'ProductNotFoundError';
  }
}

function roundNutrient(value: number | undefined): number {
  return Math.round(value || 0);
}

export async function fetchProductByBarcode(barcode: string): Promise<ScannedProduct> {
  const url = `https://world.openfoodfacts.org/api/v2/product/${encodeURIComponent(barcode)}?fields=${OFF_FIELDS}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Open Food Facts request failed (${response.status})`);
  }

  const data = (await response.json()) as OpenFoodFactsResponse;
  if (data.status !== 1 || !data.product) {
    throw new ProductNotFoundError(barcode);
  }

  const product = data.product;
  const nutriments = product.nutriments || {};
  const ingredientsText = product.ingredients_text || '';
  const { addedSugars, earlyAddedSugars } = scoreIngredients(ingredientsText);
  const nova = getNovaInfo(product.nova_group) ? product.nova_group : null;

  return {
    barcode,
    name: product.product_name || 'Scanned Food',
    cal: roundNutrient(nutriments['energy-kcal_100g']),
    p: roundNutrient(nutriments.proteins_100g),
    c: roundNutrient(nutriments.carbohydrates_100g),
    f: roundNutrient(nutriments.fat_100g),
    nova: nova === 1 || nova === 2 || nova === 3 || nova === 4 ? nova : null,
    sugarsTot: roundNutrient(nutriments.sugars_100g),
    addedSugars,
    earlyAddedSugars,
    nutriscoreGrade: product.nutriscore_grade ?? null,
    ingredientsText,
  };
}
