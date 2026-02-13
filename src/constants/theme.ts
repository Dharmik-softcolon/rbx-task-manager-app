// Splitwise-inspired color palette with dark/light mode support

export const Colors = {
  primary: '#1CC29F',
  primaryDark: '#17A888',
  primaryLight: '#ACE4D6',
  accentOrange: '#FF6B35',
  accentGold: '#FFD700',
  success: '#10B981',
  error: '#EF4444',
  warning: '#F59E0B',
  info: '#3B82F6',
  coinGold: '#FFD700',
  coinGoldDark: '#DAA520',
};

export const LightTheme = {
  dark: false,
  colors: {
    ...Colors,
    background: '#F5F5F5',
    surface: '#FFFFFF',
    card: '#FFFFFF',
    cardElevated: '#FFFFFF',
    textPrimary: '#1A1A2E',
    textSecondary: '#6B7280',
    textTertiary: '#9CA3AF',
    textInverse: '#FFFFFF',
    border: '#E5E7EB',
    borderLight: '#F3F4F6',
    divider: '#E5E7EB',
    shadow: 'rgba(0, 0, 0, 0.08)',
    overlay: 'rgba(0, 0, 0, 0.5)',
    tabBar: '#FFFFFF',
    tabBarBorder: '#E5E7EB',
    statusBar: 'dark-content' as const,
    shimmer: '#E5E7EB',
    inputBackground: '#F9FAFB',
  },
};

export const DarkTheme = {
  dark: true,
  colors: {
    ...Colors,
    background: '#0F0F1A',
    surface: '#1A1A2E',
    card: '#1A1A2E',
    cardElevated: '#252540',
    textPrimary: '#F9FAFB',
    textSecondary: '#9CA3AF',
    textTertiary: '#6B7280',
    textInverse: '#1A1A2E',
    border: '#2D2D44',
    borderLight: '#252540',
    divider: '#2D2D44',
    shadow: 'rgba(0, 0, 0, 0.3)',
    overlay: 'rgba(0, 0, 0, 0.7)',
    tabBar: '#1A1A2E',
    tabBarBorder: '#2D2D44',
    statusBar: 'light-content' as const,
    shimmer: '#252540',
    inputBackground: '#252540',
  },
};

export type ThemeColors = typeof LightTheme.colors;

export const Typography = {
  h1: { fontSize: 28, fontWeight: '700' as const, letterSpacing: -0.5 },
  h2: { fontSize: 22, fontWeight: '700' as const, letterSpacing: -0.3 },
  h3: { fontSize: 18, fontWeight: '600' as const, letterSpacing: -0.2 },
  subtitle: { fontSize: 16, fontWeight: '600' as const },
  body: { fontSize: 14, fontWeight: '400' as const },
  bodyMedium: { fontSize: 14, fontWeight: '500' as const },
  caption: { fontSize: 12, fontWeight: '400' as const },
  small: { fontSize: 10, fontWeight: '500' as const },
  button: { fontSize: 16, fontWeight: '600' as const, letterSpacing: 0.3 },
  coinLarge: { fontSize: 36, fontWeight: '800' as const, letterSpacing: -1 },
  coinMedium: { fontSize: 24, fontWeight: '700' as const, letterSpacing: -0.5 },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 999,
};
