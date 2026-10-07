import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

import { BRAND, FONTS, formatNumber, statusColor } from '@/theme';

const SIZE = 168;
const STROKE = 14;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

type CalorieDialProps = {
  used: number;
  goal: number;
};

export function CalorieDial({ used, goal }: CalorieDialProps) {
  const pct = goal > 0 ? (used / goal) * 100 : 0;
  const clamped = Math.max(0, Math.min(100, pct));
  const offset = CIRCUMFERENCE * (1 - clamped / 100);

  return (
    <View style={styles.container}>
      <Svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
        <Circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke={BRAND.parchment}
          strokeWidth={STROKE}
        />
        <Circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke={statusColor(pct)}
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
        />
      </Svg>
      <View style={styles.center} pointerEvents="none">
        <Text style={styles.figure}>{formatNumber(used)}</Text>
        <Text style={styles.label}>OF {formatNumber(goal)} KCAL</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    position: 'absolute',
    alignItems: 'center',
  },
  figure: {
    fontFamily: FONTS.monoMedium,
    fontSize: 34,
    color: BRAND.ink,
  },
  label: {
    fontFamily: FONTS.mono,
    fontSize: 10,
    letterSpacing: 1,
    color: BRAND.ink50,
    marginTop: 2,
    textTransform: 'uppercase',
  },
});
