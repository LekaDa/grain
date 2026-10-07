export type MealName = 'Breakfast' | 'Lunch' | 'Dinner' | 'Snacks';

export type MacroGoals = {
  cal: number;
  p: number;
  c: number;
  f: number;
};

export type MacroTotals = MacroGoals;

export type FoodCategory = 'Protein' | 'Grain' | 'Fruit' | 'Dairy' | 'Snack';

export type Food = {
  name: string;
  cat?: FoodCategory | string;
  cal: number;
  p: number;
  c: number;
  f: number;
};

export type LoggedFood = Food & {
  uid: string;
};

export type Meals = Record<MealName, LoggedFood[]>;

export type NovaGroup = 1 | 2 | 3 | 4;

export type NovaInfo = {
  label: string;
  color: string;
  emoji: string;
  desc: string;
};

export type IngredientScore = {
  addedSugars: string[];
  earlyAddedSugars: string[];
};

export type ScannedProduct = Food & {
  barcode: string;
  nova: NovaGroup | null;
  sugarsTot: number;
  addedSugars: string[];
  earlyAddedSugars: string[];
  nutriscoreGrade: string | null;
  ingredientsText: string;
};

export type ManualFoodInput = {
  name: string;
  srv: string;
  cal: string;
  p: string;
  c: string;
  f: string;
};

export type OpenFoodFactsProduct = {
  product_name?: string;
  nova_group?: number;
  ingredients_text?: string;
  nutriscore_grade?: string;
  nutriments?: Record<string, number | undefined>;
};

export type OpenFoodFactsResponse = {
  status: number;
  product?: OpenFoodFactsProduct;
};
