/**
 * Central design tokens - single source of truth for the brand palette.
 *
 * Brand: Teal + Warm Apricot harmony (two primary tones used together).
 * Everything else (CSS variables, Ant Design theme, components) derives from here.
 */

export const BRAND = {
  navy: '#0F766E',
  navyLight: '#14B8A6',
  navyDark: '#115E59',
  teal: '#D97706',
  tealLight: '#F59E0B',
  tealDark: '#B45309',
} as const

/** Neutral scale (light mode is the reference spec). */
export const NEUTRAL = {
  bg: '#F7FAF9',
  surface: '#FFFFFF',
  surfaceHover: '#F1F5F4',
  surfaceElevated: '#FBFDFC',
  border: '#E3EAE8',
  borderLight: '#EDF3F1',
  text: '#132A2E',
  textSecondary: '#4B6468',
  textTertiary: '#8AA0A3',
} as const

/** Functional colors - statuses only, never decoration. */
export const FUNCTIONAL = {
  success: '#16A34A',
  warning: '#D97706',
  error: '#DC2626',
  info: '#0284C7',
} as const

/** Restrained professional corner radii (px). */
export const RADIUS = {
  /** Small controls (checkbox, small tag) */
  xs: 4,
  /** Buttons */
  sm: 5,
  /** Input fields */
  md: 6,
  /** Cards */
  lg: 8,
  /** Large containers / modals / drawers */
  xl: 10,
  /** Hero imagery and oversized surfaces */
  xxl: 12,
} as const

export const FONT_SANS =
  "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Kufi Arabic', sans-serif"
export const FONT_DISPLAY =
  "'Outfit', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, 'Noto Kufi Arabic', sans-serif"
export const FONT_MONO = "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace"

export interface PaletteMode {
  bg: string
  surface: string
  surfaceHover: string
  surfaceElevated: string
  border: string
  borderLight: string
  text: string
  textSecondary: string
  textTertiary: string
  muted: string
  primary: string
  primaryLight: string
  primaryDark: string
  primaryGlow: string
  secondary: string
  secondaryLight: string
  secondaryDark: string
  secondaryGlow: string
  /** Legacy alias — now mapped to teal so no usage breaks. */
  accent: string
  accentLight: string
  accentDark: string
  accentGlow: string
  /** Legacy alias — mapped to error. */
  highlight: string
  highlightLight: string
  highlightDark: string
  success: string
  warning: string
  error: string
  info: string
  shadowSoft: string
  shadowCard: string
  shadowElevated: string
  shadowDialog: string
}

export const palette: Record<'dark' | 'light', PaletteMode> = {
  dark: {
    bg: '#0B1516',
    surface: '#102022',
    surfaceHover: '#162A2C',
    surfaceElevated: '#132628',
    border: '#234145',
    borderLight: '#1A3336',
    text: '#EAF6F4',
    textSecondary: '#9FB8B5',
    textTertiary: '#6E8A87',
    muted: '#234145',
    primary: '#2DD4BF',
    primaryLight: '#5EEAD4',
    primaryDark: '#0F766E',
    primaryGlow: 'rgba(45, 212, 191, 0.18)',
    secondary: '#F59E0B',
    secondaryLight: '#FCD34D',
    secondaryDark: '#D97706',
    secondaryGlow: 'rgba(245, 158, 11, 0.18)',
    accent: '#F59E0B',
    accentLight: '#FCD34D',
    accentDark: '#D97706',
    accentGlow: 'rgba(245, 158, 11, 0.18)',
    highlight: '#F87171',
    highlightLight: '#FCA5A5',
    highlightDark: '#EF4444',
    success: '#34D399',
    warning: '#FBBF24',
    error: '#F87171',
    info: '#38BDF8',
    shadowSoft: '0 1px 2px rgba(2, 8, 23, 0.5)',
    shadowCard: '0 8px 24px -16px rgba(2, 8, 23, 0.7)',
    shadowElevated: '0 18px 40px -18px rgba(2, 8, 23, 0.75)',
    shadowDialog: '0 28px 60px -24px rgba(2, 8, 23, 0.8)',
  },
  light: {
    bg: NEUTRAL.bg,
    surface: NEUTRAL.surface,
    surfaceHover: NEUTRAL.surfaceHover,
    surfaceElevated: NEUTRAL.surfaceElevated,
    border: NEUTRAL.border,
    borderLight: NEUTRAL.borderLight,
    text: NEUTRAL.text,
    textSecondary: NEUTRAL.textSecondary,
    textTertiary: NEUTRAL.textTertiary,
    muted: '#E3EAE8',
    primary: BRAND.navy,
    primaryLight: BRAND.navyLight,
    primaryDark: BRAND.navyDark,
    primaryGlow: 'rgba(15, 118, 110, 0.14)',
    secondary: BRAND.teal,
    secondaryLight: BRAND.tealLight,
    secondaryDark: BRAND.tealDark,
    secondaryGlow: 'rgba(217, 119, 6, 0.16)',
    accent: BRAND.teal,
    accentLight: BRAND.tealLight,
    accentDark: BRAND.tealDark,
    accentGlow: 'rgba(217, 119, 6, 0.16)',
    highlight: FUNCTIONAL.error,
    highlightLight: '#EF4444',
    highlightDark: '#B91C1C',
    success: FUNCTIONAL.success,
    warning: FUNCTIONAL.warning,
    error: FUNCTIONAL.error,
    info: FUNCTIONAL.info,
    shadowSoft: '0 1px 2px rgba(19, 42, 46, 0.05)',
    shadowCard: '0 8px 24px -18px rgba(19, 42, 46, 0.12)',
    shadowElevated: '0 18px 40px -20px rgba(19, 42, 46, 0.16)',
    shadowDialog: '0 28px 60px -28px rgba(19, 42, 46, 0.22)',
  },
}
