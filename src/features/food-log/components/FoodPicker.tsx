import { useRouter } from 'expo-router';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { BRAND, FONTS } from '@/theme';

import { FOOD_CATEGORIES } from '../constants';
import { useFoodLogContext } from '../context';
import type { ManualFoodInput, MealName } from '../types';

type FoodPickerProps = {
  meal: MealName;
};

export function FoodPicker({ meal }: FoodPickerProps) {
  const router = useRouter();
  const {
    search,
    setSearch,
    category,
    setCategory,
    filteredFoods,
    addFood,
    manual,
    setManual,
    addManual,
  } = useFoodLogContext();

  const setManualField = (field: keyof ManualFoodInput) => (value: string) =>
    setManual((prev) => ({ ...prev, [field]: value }));

  const canAddManual = manual.name.trim().length > 0 && manual.cal.trim().length > 0;

  return (
    <View style={styles.container}>
      <TextInput
        value={search}
        onChangeText={setSearch}
        placeholder="Search foods..."
        placeholderTextColor={BRAND.ink50}
        style={styles.input}
        autoCorrect={false}
        returnKeyType="search"
      />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipRow}>
        {FOOD_CATEGORIES.map((cat) => {
          const active = category === cat;
          return (
            <Pressable
              key={cat}
              onPress={() => setCategory(cat)}
              style={[styles.chip, active && styles.chipActive]}>
              <Text style={[styles.chipText, active && styles.chipTextActive]}>{cat}</Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <Pressable
        style={styles.scanButton}
        onPress={() => router.push({ pathname: '/scan', params: { meal } })}
        accessibilityRole="button"
        accessibilityLabel={`Scan barcode for ${meal}`}>
        <Text style={styles.scanButtonText}>SCAN BARCODE</Text>
      </Pressable>

      {filteredFoods.length === 0 ? (
        <Text style={styles.emptyResults}>No foods match your search.</Text>
      ) : (
        filteredFoods.map((food) => (
          <Pressable
            key={food.name}
            onPress={() => addFood(meal, food)}
            style={({ pressed }) => [styles.resultRow, pressed && styles.resultRowPressed]}>
            <Text style={styles.resultName}>{food.name}</Text>
            <Text style={styles.resultCal}>{food.cal} kcal</Text>
          </Pressable>
        ))
      )}

      <Text style={styles.manualHeading}>OR ADD MANUALLY</Text>
      <TextInput
        value={manual.name}
        onChangeText={setManualField('name')}
        placeholder="Food name"
        placeholderTextColor={BRAND.ink50}
        style={styles.input}
      />
      <TextInput
        value={manual.srv}
        onChangeText={setManualField('srv')}
        placeholder="Serving (e.g. 1 serving)"
        placeholderTextColor={BRAND.ink50}
        style={styles.input}
      />
      <View style={styles.macroRow}>
        <TextInput
          value={manual.cal}
          onChangeText={setManualField('cal')}
          placeholder="kcal"
          placeholderTextColor={BRAND.ink50}
          style={[styles.input, styles.macroInput]}
          keyboardType="numeric"
        />
        <TextInput
          value={manual.p}
          onChangeText={setManualField('p')}
          placeholder="P (g)"
          placeholderTextColor={BRAND.ink50}
          style={[styles.input, styles.macroInput]}
          keyboardType="numeric"
        />
        <TextInput
          value={manual.c}
          onChangeText={setManualField('c')}
          placeholder="C (g)"
          placeholderTextColor={BRAND.ink50}
          style={[styles.input, styles.macroInput]}
          keyboardType="numeric"
        />
        <TextInput
          value={manual.f}
          onChangeText={setManualField('f')}
          placeholder="F (g)"
          placeholderTextColor={BRAND.ink50}
          style={[styles.input, styles.macroInput]}
          keyboardType="numeric"
        />
      </View>
      <Pressable
        onPress={addManual}
        disabled={!canAddManual}
        style={[styles.addButton, !canAddManual && styles.addButtonDisabled]}
        accessibilityRole="button">
        <Text style={styles.addButtonText}>ADD</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 12,
    gap: 8,
    backgroundColor: BRAND.bone,
    borderRadius: 8,
    padding: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: BRAND.ink10,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontFamily: FONTS.sans,
    fontSize: 13.5,
    color: BRAND.ink,
    backgroundColor: '#FFFFFF',
  },
  chipRow: {
    gap: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: BRAND.sageDim,
  },
  chipActive: {
    backgroundColor: BRAND.ink,
  },
  chipText: {
    fontFamily: FONTS.mono,
    fontSize: 11,
    color: BRAND.ink,
  },
  chipTextActive: {
    color: BRAND.bone,
  },
  scanButton: {
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: BRAND.rust,
  },
  scanButtonText: {
    fontFamily: FONTS.monoMedium,
    fontSize: 11.5,
    letterSpacing: 1,
    color: BRAND.bone,
  },
  emptyResults: {
    fontFamily: FONTS.sans,
    fontSize: 13,
    color: BRAND.ink50,
    paddingVertical: 8,
    textAlign: 'center',
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: BRAND.ink10,
  },
  resultRowPressed: {
    backgroundColor: BRAND.parchment,
  },
  resultName: {
    fontFamily: FONTS.sans,
    fontSize: 13.5,
    color: BRAND.ink,
    flexShrink: 1,
  },
  resultCal: {
    fontFamily: FONTS.monoMedium,
    fontSize: 12,
    color: BRAND.ink80,
  },
  manualHeading: {
    marginTop: 8,
    fontFamily: FONTS.mono,
    fontSize: 10.5,
    letterSpacing: 1,
    color: BRAND.ink50,
  },
  macroRow: {
    flexDirection: 'row',
    gap: 8,
  },
  macroInput: {
    flex: 1,
    paddingHorizontal: 8,
  },
  addButton: {
    backgroundColor: BRAND.ink,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  addButtonDisabled: {
    opacity: 0.4,
  },
  addButtonText: {
    fontFamily: FONTS.monoMedium,
    fontSize: 12,
    letterSpacing: 1,
    color: BRAND.bone,
  },
});
