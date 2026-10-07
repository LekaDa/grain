import { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { BRAND, FONTS } from '@/theme';

import { MEAL_NAMES } from '../constants';
import { useFoodLogContext } from '../context';
import { getNovaInfo } from '../scoring';

export function ScannedProductModal() {
  const { lastScanned, scanTarget, assignScannedToMeal, dismissScanned } =
    useFoodLogContext();
  const [pickingOtherMeal, setPickingOtherMeal] = useState(false);

  if (!lastScanned) return null;

  const showConfirm = scanTarget !== null && !pickingOtherMeal;

  const assign = (meal: (typeof MEAL_NAMES)[number]) => {
    assignScannedToMeal(meal);
    setPickingOtherMeal(false);
  };
  const dismiss = () => {
    dismissScanned();
    setPickingOtherMeal(false);
  };

  const nova = getNovaInfo(lastScanned.nova);
  const rows: [string, number, string][] = [
    ['Calories', lastScanned.cal, 'kcal'],
    ['Protein', lastScanned.p, 'g'],
    ['Carbs', lastScanned.c, 'g'],
    ['Fat', lastScanned.f, 'g'],
  ];

  return (
    <Modal
      visible
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={dismiss}>
      <Pressable style={styles.backdrop} onPress={dismiss}>
        <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
          <Text style={styles.name}>{lastScanned.name}</Text>
          <Text style={styles.per100}>PER 100G</Text>

          <View style={styles.macroGrid}>
            {rows.map(([label, value, unit]) => (
              <View key={label} style={styles.macroCell}>
                <Text style={styles.macroValue}>
                  {value}
                  {unit}
                </Text>
                <Text style={styles.macroLabel}>{label}</Text>
              </View>
            ))}
          </View>

          {nova && (
            <View style={[styles.novaBadge, { borderColor: nova.color }]}>
              <Text style={[styles.novaTitle, { color: nova.color }]}>
                {nova.emoji} NOVA {lastScanned.nova} — {nova.label}
              </Text>
              <Text style={styles.novaDesc}>{nova.desc}</Text>
            </View>
          )}

          {lastScanned.earlyAddedSugars.length > 0 && (
            <Text style={styles.sugarWarning}>
              ⚠ Added sugars in first 5 ingredients:{' '}
              {lastScanned.earlyAddedSugars.join(', ')}
            </Text>
          )}

          {showConfirm ? (
            <>
              <Pressable
                onPress={() => assign(scanTarget)}
                style={styles.confirmButton}
                accessibilityRole="button">
                <Text style={styles.confirmButtonText}>✓ ADD TO {scanTarget.toUpperCase()}</Text>
              </Pressable>
              <View style={styles.secondaryRow}>
                <Pressable
                  onPress={() => setPickingOtherMeal(true)}
                  style={styles.secondaryButton}
                  accessibilityRole="button">
                  <Text style={styles.secondaryButtonText}>DIFFERENT MEAL</Text>
                </Pressable>
                <Pressable
                  onPress={dismiss}
                  style={styles.secondaryButton}
                  accessibilityRole="button">
                  <Text style={styles.secondaryButtonText}>DISMISS</Text>
                </Pressable>
              </View>
            </>
          ) : (
            <>
              <Text style={styles.assignLabel}>ADD TO MEAL</Text>
              <View style={styles.mealRow}>
                {MEAL_NAMES.map((meal) => (
                  <Pressable
                    key={meal}
                    onPress={() => assign(meal)}
                    style={styles.mealButton}
                    accessibilityRole="button">
                    <Text style={styles.mealButtonText}>{meal}</Text>
                  </Pressable>
                ))}
              </View>
              <Pressable
                onPress={dismiss}
                style={[styles.secondaryButton, styles.secondaryFull]}
                accessibilityRole="button">
                <Text style={styles.secondaryButtonText}>DISMISS</Text>
              </Pressable>
            </>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(27,59,47,0.5)',
    justifyContent: 'center',
    padding: 24,
  },
  sheet: {
    backgroundColor: BRAND.bone,
    borderRadius: 10,
    padding: 20,
    maxHeight: '85%',
  },
  name: {
    fontFamily: FONTS.displayMedium,
    fontSize: 22,
    color: BRAND.ink,
  },
  per100: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    letterSpacing: 1,
    color: BRAND.ink50,
    marginTop: 2,
    marginBottom: 12,
  },
  macroGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: BRAND.parchment,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 8,
    marginBottom: 12,
  },
  macroCell: {
    alignItems: 'center',
    flex: 1,
  },
  macroValue: {
    fontFamily: FONTS.monoSemi,
    fontSize: 14,
    color: BRAND.ink,
  },
  macroLabel: {
    fontFamily: FONTS.mono,
    fontSize: 9.5,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: BRAND.ink50,
    marginTop: 3,
  },
  novaBadge: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  novaTitle: {
    fontFamily: FONTS.sansSemi,
    fontSize: 13,
  },
  novaDesc: {
    fontFamily: FONTS.sans,
    fontSize: 12,
    color: BRAND.ink80,
    marginTop: 2,
  },
  sugarWarning: {
    fontFamily: FONTS.sans,
    fontSize: 12,
    color: BRAND.rust,
    marginBottom: 10,
  },
  assignLabel: {
    fontFamily: FONTS.mono,
    fontSize: 10.5,
    letterSpacing: 1,
    color: BRAND.ink50,
    marginBottom: 6,
  },
  mealRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 10,
  },
  mealButton: {
    backgroundColor: BRAND.ink,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  mealButtonText: {
    fontFamily: FONTS.sansMedium,
    fontSize: 13,
    color: BRAND.bone,
  },
  confirmButton: {
    backgroundColor: BRAND.ink,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  confirmButtonText: {
    fontFamily: FONTS.monoMedium,
    fontSize: 12.5,
    letterSpacing: 1,
    color: BRAND.bone,
  },
  secondaryRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: BRAND.parchment,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  secondaryFull: {
    flex: undefined,
    alignSelf: 'stretch',
  },
  secondaryButtonText: {
    fontFamily: FONTS.monoMedium,
    fontSize: 11,
    letterSpacing: 0.8,
    color: BRAND.ink,
  },
});
