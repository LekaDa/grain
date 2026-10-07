import { StyleSheet, Text, View, type ViewProps } from 'react-native';

import { BRAND, FONTS } from '@/theme';

export function Card({ style, children, ...rest }: ViewProps) {
  return (
    <View style={[styles.card, style]} {...rest}>
      {children}
    </View>
  );
}

export function CardLabel({ children }: { children: React.ReactNode }) {
  return <Text style={styles.label}>{children}</Text>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: BRAND.parchment,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  label: {
    fontFamily: FONTS.displayMedium,
    fontSize: 19,
    color: BRAND.ink,
    marginBottom: 10,
  },
});
