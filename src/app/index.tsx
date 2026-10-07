import { useRouter } from 'expo-router';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CalorieDial } from '@/features/food-log/components/CalorieDial';
import { MacroJars } from '@/features/food-log/components/MacroJars';
import { MealSection } from '@/features/food-log/components/MealSection';
import { OverGoalBanner } from '@/features/food-log/components/OverGoalBanner';
import { ScannedProductModal } from '@/features/food-log/components/ScannedProductModal';
import { MEAL_NAMES } from '@/features/food-log/constants';
import { useFoodLogContext } from '@/features/food-log/context';
import { BRAND, FONTS } from '@/theme';

const WEEKDAYS = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

function todayEyebrow(): string {
  const now = new Date();
  return `${WEEKDAYS[now.getDay()]}, ${MONTHS[now.getMonth()]} ${now.getDate()}`;
}

export default function FoodLogScreen() {
  const router = useRouter();
  const { totals, goals } = useFoodLogContext();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>{todayEyebrow()}</Text>
          <Text style={styles.title}>Today's plate</Text>
        </View>
        <Pressable
          onPress={() => router.push('/scan')}
          style={styles.quickScan}
          accessibilityRole="button"
          accessibilityLabel="Quick scan barcode">
          <Text style={styles.quickScanText}>SCAN</Text>
        </Pressable>
      </View>
      <OverGoalBanner />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled">
          <View style={styles.dialWrap}>
            <CalorieDial used={totals.cal} goal={goals.cal} />
          </View>

          <MacroJars totals={totals} goals={goals} />

          <View style={styles.mealsBlock}>
            {MEAL_NAMES.map((meal) => (
              <MealSection key={meal} meal={meal} />
            ))}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <ScannedProductModal />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: BRAND.bone,
  },
  flex: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingTop: 8,
    paddingBottom: 48,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 12,
  },
  eyebrow: {
    fontFamily: FONTS.mono,
    fontSize: 10.5,
    letterSpacing: 1.2,
    color: BRAND.ink50,
    textTransform: 'uppercase',
  },
  title: {
    fontFamily: FONTS.display,
    fontSize: 30,
    color: BRAND.ink,
    marginTop: 2,
  },
  quickScan: {
    backgroundColor: BRAND.ink,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 9,
    marginBottom: 4,
  },
  quickScanText: {
    fontFamily: FONTS.monoMedium,
    fontSize: 11,
    letterSpacing: 1,
    color: BRAND.bone,
  },
  dialWrap: {
    alignItems: 'center',
    marginVertical: 14,
  },
  mealsBlock: {
    marginTop: 18,
  },
});
