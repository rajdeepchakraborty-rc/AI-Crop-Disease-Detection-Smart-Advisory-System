// ─────────────────────────────────────────────
//  CropAI Mobile — Design System Tokens
// ─────────────────────────────────────────────

export const COLORS = {
  // Backgrounds
  bg:          '#050F08',
  bgCard:      '#0D1F14',
  bgCardAlt:   '#112218',
  bgGlass:     'rgba(26,92,50,0.25)',

  // Primary brand
  primary:     '#22C55E',
  primaryDark: '#16A34A',
  primaryGlow: 'rgba(34,197,94,0.20)',

  // Accent
  accent:      '#4ADE80',
  accentSoft:  'rgba(74,222,128,0.12)',

  // Status
  danger:      '#EF4444',
  warning:     '#F59E0B',
  info:        '#38BDF8',
  success:     '#22C55E',

  // Text
  textPrimary:   '#F0FDF4',
  textSecondary: '#86EFAC',
  textMuted:     '#4B7A5C',
  textWhite:     '#FFFFFF',

  // Borders
  border:      'rgba(34,197,94,0.18)',
  borderBright:'rgba(74,222,128,0.40)',

  // Overlay
  overlay:     'rgba(5,15,8,0.85)',
};

export const FONTS = {
  regular:    'Inter_400Regular',
  medium:     'Inter_500Medium',
  semiBold:   'Inter_600SemiBold',
  bold:       'Inter_700Bold',
  extraBold:  'Inter_800ExtraBold',
};

export const SPACING = {
  xs:  4,
  sm:  8,
  md:  16,
  lg:  24,
  xl:  32,
  xxl: 48,
};

export const RADIUS = {
  sm:  8,
  md:  14,
  lg:  20,
  xl:  28,
  full: 999,
};

export const SHADOW = {
  card: {
    shadowColor: '#22C55E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 8,
  },
  glow: {
    shadowColor: '#4ADE80',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.45,
    shadowRadius: 20,
    elevation: 12,
  },
};
