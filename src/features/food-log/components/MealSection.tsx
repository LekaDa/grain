import { Pressable, StyleSheet, Text, View } from 'react-native';

import { BRAND, FONTS } from '@/theme';

import { useFoodLogContext } from '../context';
import type { MealName } from '../types';
import { Card, CardLabel } from './Card';
import { FoodPicker } from './FoodPicker';

type MealSectionProps = {
  meal: MealName;
};

export function MealSection({ meal }: MealSectionProps) {
  const { meals, addingTo, toggleAddingTo, removeFood } = useFoodLogContext();
  const foods = meals[meal];
  const isAdding = addingTo === meal;

  return (
    <Card>
      <View style={styles.header}>
        <CardLabel>{meal}</CardLabel>
        <Pressable
          onPress={() => toggleAddingTo(meal)}
          style={[styles.toggle, isAdding && styles.toggleOpen]}
          accessibilityRole="button">
          <Text style={[styles.toggleText, isAdding && styles.toggleTextOpen]}>
            {isAdding ? '✕ CLOSE' : '+ ADD'}
          </Text>
        </Pressable>
      </View>

      {foods.length === 0 && <Text style={styles.empty}>No foods logged</Text>}

      {foods.map((food) => (
        <View key={food.uid} style={styles.foodRow}>
          <View style={styles.nameBlock}>
            <Text style={styles.foodName} numberOfLines={1}>
              {food.name}
            </Text>
            <Text style={styles.foodMacros}>
              P:{food.p}g · C:{food.c}g · F:{food.f}g
            </Text>
          </View>
          <View style={styles.leader} />
          <Text style={styles.foodCal}>{food.cal}</Text>
          <Pressable
            onPress={() => removeFood(meal, food.uid)}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel={`Remove ${food.name}`}>
            <Text style={styles.remove}>✕</Text>
          </Pressable>
        </View>
      ))}

      {isAdding && <FoodPicker meal={meal} />}
    </Card>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toggle: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: BRAND.sageDim,
  },
  toggleOpen: {
    backgroundColor: BRAND.ink,
  },
  toggleText: {
    fontFamily: FONTS.monoMedium,
    fontSize: 10.5,
    letterSpacing: 0.8,
    color: BRAND.ink,
  },
  toggleTextOpen: {
    color: BRAND.bone,
  },
  empty: {
    fontFamily: FONTS.sans,
    fontSize: 13,
    color: BRAND.ink50,
    fontStyle: 'italic',
  },
  foodRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 6,
    paddingVertical: 7,
  },
  nameBlock: {
    flexShrink: 1,
    maxWidth: '62%',
  },
  foodName: {
    fontFamily: FONTS.sans,
    fontSize: 13.5,
    color: BRAND.ink,
  },
  foodMacros: {
    fontFamily: FONTS.mono,
    fontSize: 10.5,
    color: BRAND.ink50,
    marginTop: 2,
  },
  leader: {
    flex: 1,
    borderBottomWidth: 1,
    borderStyle: 'dotted',
    borderBottomColor: BRAND.ink25,
    marginBottom: 5,
  },
  foodCal: {
    fontFamily: FONTS.monoMedium,
    fontSize: 13,
    color: BRAND.ink,
  },
  remove: {
    fontSize: 13,
    color: BRAND.rust,
    padding: 4,
  },
});
