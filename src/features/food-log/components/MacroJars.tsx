import { StyleSheet, Text, View } from 'react-native';

import { BRAND, FONTS } from '@/theme';

import type { MacroGoals, MacroTotals } from '../types';

type MacroJarsProps = {
  totals: MacroTotals;
  goals: MacroGoals;
};

export function MacroJars({ totals, goals }: MacroJarsProps) {
  const jars = [
    { label: 'Protein', used: totals.p, goal: goals.p, color: BRAND.sage },
    { label: 'Carbs', used: totals.c, goal: goals.c, color: BRAND.wheat },
    { label: 'Fat', used: totals.f, goal: goals.f, color: BRAND.rust },
  ];

  return (
    <View style={styles.row}>
      {jars.map((jar) => {
        const pct = jar.goal > 0 ? (jar.used / jar.goal) * 100 : 0;
        const fill = Math.max(4, Math.min(100, pct));
        return (
          <View key={jar.label} style={styles.jar}>
            <View style={styles.track}>
              <View
                style={[styles.fill, { height: `${fill}%`, backgroundColor: jar.color }]}
              />
            </View>
            <Text style={styles.value}>{Math.round(jar.used)}g</Text>
            <Text style={styles.label}>{jar.label}</Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  jar: {
    flex: 1,
    backgroundColor: BRAND.parchment,
    borderRadius: 8,
    padding: 10,
  },
  track: {
    height: 44,
    borderRadius: 5,
    backgroundColor: 'rgba(27,59,47,0.08)',
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  fill: {
    width: '100%',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  value: {
    fontFamily: FONTS.monoSemi,
    fontSize: 12,
    color: BRAND.ink,
    marginTop: 6,
  },
  label: {
    fontFamily: FONTS.mono,
    fontSize: 9.5,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: BRAND.ink50,
    marginTop: 2,
  },
});
