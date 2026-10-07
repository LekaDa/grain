import { StyleSheet, Text, View } from 'react-native';

import { BRAND, FONTS } from '@/theme';

import { useFoodLogContext } from '../context';

export function OverGoalBanner() {
  const { totals, goals } = useFoodLogContext();

  const overs = [
    { label: 'Calories', over: totals.cal - goals.cal, unit: ' kcal' },
    { label: 'Protein', over: totals.p - goals.p, unit: 'g' },
    { label: 'Carbs', over: totals.c - goals.c, unit: 'g' },
    { label: 'Fat', over: totals.f - goals.f, unit: 'g' },
  ].filter((entry) => entry.over > 0);

  if (overs.length === 0) return null;

  const details = overs
    .map((entry) => `${entry.label} +${Math.round(entry.over)}${entry.unit}`)
    .join(' · ');

  return (
    <View
      style={styles.banner}
      accessibilityRole="alert"
      accessibilityLabel={`Daily goal exceeded: ${details}`}>
      <Text style={styles.title}>OVER DAILY GOAL</Text>
      <Text style={styles.details}>{details}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: BRAND.rustDim,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: BRAND.rust,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginHorizontal: 16,
    marginBottom: 8,
  },
  title: {
    fontFamily: FONTS.monoMedium,
    fontSize: 11,
    letterSpacing: 1,
    color: BRAND.rust,
  },
  details: {
    fontFamily: FONTS.mono,
    fontSize: 11.5,
    color: BRAND.rust,
    marginTop: 2,
  },
});
