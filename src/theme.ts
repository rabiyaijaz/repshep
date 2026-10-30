// Design tokens pulled from the RepShep Figma file ("🎨 Design System" page + main screens).
export const colors = {
  // Neutrals
  white: '#FFFFFF',
  bg: '#FAFAF9', // neutral 100 — app background
  surface: '#EBEBE6', // neutral 200 — cards, chips, inputs
  line: '#DADADA', // neutral 300
  stone: '#E2E1DA', // neutral 400
  ink: '#292927', // neutral 900 — primary text, dividers
  inkSoft: '#404040', // secondary text
  muted: '#737373',
  black: '#000000',

  // Brand
  primary: '#3B3BC9',
  accent: '#C5FFD6',

  // Semantic
  success: '#34C759',
  error: '#FF6A5F',
  danger: '#E5141B', // "Expired" badge
  warnSoft: '#FFA2A2',
  teal: '#36565A', // selected segmented tab
  frozen: '#6B6B6B',
} as const;

export const space = { xxs: 4, xs: 8, sm: 12, md: 16, lg: 24, xl: 32, xxl: 40, xxxl: 60 } as const;
export const radius = { xs: 4, sm: 12, md: 16, lg: 24, xl: 32, xxl: 40, pill: 100 } as const;

// Screens use Space Grotesk (the type sheet lists DM Sans, but every built screen uses Space Grotesk).
export const font = {
  regular: 'SpaceGrotesk_400Regular',
  medium: 'SpaceGrotesk_500Medium',
  semibold: 'SpaceGrotesk_600SemiBold',
  bold: 'SpaceGrotesk_700Bold',
} as const;

export const type = {
  display: { fontFamily: font.medium, fontSize: 36, lineHeight: 42 },
  h1: { fontFamily: font.medium, fontSize: 28, lineHeight: 34 },
  h2: { fontFamily: font.medium, fontSize: 24, lineHeight: 30 },
  h3: { fontFamily: font.medium, fontSize: 20, lineHeight: 26 },
  bodyL: { fontFamily: font.regular, fontSize: 16, lineHeight: 24 },
  bodyM: { fontFamily: font.medium, fontSize: 16, lineHeight: 22 },
  body: { fontFamily: font.regular, fontSize: 14, lineHeight: 20 },
  bodyStrong: { fontFamily: font.medium, fontSize: 14, lineHeight: 20 },
  caption: { fontFamily: font.medium, fontSize: 12, lineHeight: 16 },
  micro: { fontFamily: font.medium, fontSize: 10, lineHeight: 14 },
} as const;
