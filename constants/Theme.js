import { Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

const PALETTE = {
  primary: '#4F46E5',    // Indigo 600
  primaryLight: '#818CF8', // Indigo 400
  primaryDark: '#3730A3',  // Indigo 800
  
  secondary: '#10B981',  // Emerald 500
  secondaryLight: '#34D399', // Emerald 400
  secondaryDark: '#059669',  // Emerald 600

  background: '#F8FAFC', // Slate 50
  surface: '#FFFFFF',    // White
  
  text: '#0F172A',       // Slate 900
  textSecondary: '#64748B', // Slate 500
  textLight: '#94A3B8',  // Slate 400
  
  white: '#FFFFFF',
  
  error: '#EF4444',
  success: '#10B981',
  warning: '#F59E0B',
  info: '#3B82F6',

  // Gradient stops
  gradientPrimary: ['#4F46E5', '#6366F1'],
  gradientSecondary: ['#10B981', '#34D399'],
  gradientDark: ['#1E293B', '#334155'],
};

export const Theme = {
  colors: PALETTE,
  
  spacing: {
    xs: 4,
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
    xxl: 48,
  },
  
  borderRadius: {
    s: 8,
    m: 12,
    l: 20,
    xl: 32,
    round: 9999,
  },
  
  typography: {
    h1: {
      fontSize: 32,
      fontWeight: '700',
      color: PALETTE.text,
      letterSpacing: -1,
    },
    h2: {
      fontSize: 24,
      fontWeight: '700',
      color: PALETTE.text,
      letterSpacing: -0.5,
    },
    h3: {
      fontSize: 20,
      fontWeight: '600',
      color: PALETTE.text,
    },
    body: {
      fontSize: 16,
      color: PALETTE.textSecondary,
      lineHeight: 24,
    },
    bodySmall: {
      fontSize: 14,
      color: PALETTE.textSecondary,
      lineHeight: 20,
    },
    button: {
      fontSize: 16,
      fontWeight: '600',
      color: PALETTE.white,
      letterSpacing: 0.5,
    },
  },
  
  shadows: {
    small: {
      shadowColor: '#64748B',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 3,
      elevation: 2,
    },
    medium: {
      shadowColor: '#64748B',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    large: {
      shadowColor: '#4F46E5',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.15,
      shadowRadius: 20,
      elevation: 10,
    },
  },
  
  layout: {
    width,
    height,
    isSmallDevice: width < 375,
  },
};
