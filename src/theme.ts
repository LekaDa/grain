import { useMemo } from 'react';

export const BRAND = {
  ink: '#1B3B2F',
  ink80: 'rgba(27,59,47,0.8)',
  ink50: 'rgba(27,59,47,0.5)',
  ink25: 'rgba(27,59,47,0.25)',
  ink10: 'rgba(27,59,47,0.1)',
  bone: '#FAF8F3',
  parchment: '#EDE6D6',
  rust: '#A63D2F',
  wheat: '#D9A441',
  sage: '#6B8F71',
  sageDim: '#DDE6DE',
  wheatDim: '#F5E7C6',
  rustDim: '#F1DAD4',
} as const;

export const FONTS = {
  display: 'Fraunces_300Light',
  displayMedium: 'Fraunces_500Medium',
  displaySemi: 'Fraunces_600SemiBold',
  sans: 'IBMPlexSans_400Regular',
  sansMedium: 'IBMPlexSans_500Medium',
  sansSemi: 'IBMPlexSans_600SemiBold',
  mono: 'IBMPlexMono_400Regular',
  monoMedium: 'IBMPlexMono_500Medium',
  monoSemi: 'IBMPlexMono_600SemiBold',
} as const;

export type ThemeColors = {
  background: string;
  card: string;
  surface: string;
  border: string;
  borderStrong: string;
  primary: string;
  primaryStrong: string;
  onPrimary: string;
  onPrimaryStrong: string;
  text: string;
  textMid: string;
  textLight: string;
  danger: string;
  dangerSoft: string;
  statusUnder: string;
  statusNear: string;
  statusOver: string;
  ringCal: string;
  ringProtein: string;
  ringCarbs: string;
  ringFat: string;
};

export const THEME: ThemeColors = {
  background: BRAND.bone,
  card: BRAND.parchment,
  surface: BRAND.sageDim,
  border: BRAND.ink10,
  borderStrong: BRAND.ink25,
  primary: BRAND.ink,
  primaryStrong: BRAND.rust,
  onPrimary: BRAND.bone,
  onPrimaryStrong: BRAND.bone,
  text: BRAND.ink,
  textMid: BRAND.ink80,
  textLight: BRAND.ink50,
  danger: BRAND.rust,
  dangerSoft: BRAND.rustDim,
  statusUnder: BRAND.sage,
  statusNear: BRAND.wheat,
  statusOver: BRAND.rust,
  ringCal: BRAND.wheat,
  ringProtein: BRAND.sage,
  ringCarbs: BRAND.wheat,
  ringFat: BRAND.rust,
};

export function useThemeColors(): ThemeColors {
  return THEME;
}

export function useThemedStyles<T>(factory: (colors: ThemeColors) => T): T {
  return useMemo(() => factory(THEME), [factory]);
}

export function statusColor(pct: number): string {
  if (pct >= 100) return THEME.statusOver;
  if (pct >= 75) return THEME.statusNear;
  return THEME.statusUnder;
}

export function formatNumber(value: number): string {
  return Math.round(value)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
