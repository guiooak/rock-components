/**
 * CSS variable name constants. Use these as the source of truth when reading
 * or mutating tokens at runtime, e.g.:
 *
 *   document.documentElement.style.setProperty(tokens.colorPrimary, '#e63946');
 *
 * Override defaults by re-declaring `--sd-*` variables in your own CSS.
 */
export const tokens = {
  // Semantic surface
  colorBg: '--sd-color-bg',
  colorBgSubtle: '--sd-color-bg-subtle',
  colorFg: '--sd-color-fg',
  colorFgMuted: '--sd-color-fg-muted',
  colorBorder: '--sd-color-border',

  // Semantic intent
  colorPrimary: '--sd-color-primary',
  colorPrimaryFg: '--sd-color-primary-fg',
  colorSuccess: '--sd-color-success',
  colorWarning: '--sd-color-warning',
  colorError: '--sd-color-error',
  colorInfo: '--sd-color-info',

  // Spacing scale
  spacing0: '--sd-spacing-0',
  spacing1: '--sd-spacing-1',
  spacing2: '--sd-spacing-2',
  spacing3: '--sd-spacing-3',
  spacing4: '--sd-spacing-4',
  spacing5: '--sd-spacing-5',
  spacing6: '--sd-spacing-6',
  spacing8: '--sd-spacing-8',
  spacing10: '--sd-spacing-10',
  spacing12: '--sd-spacing-12',
  spacing16: '--sd-spacing-16',
  spacing20: '--sd-spacing-20',

  // Typography
  fontFamilySans: '--sd-font-family-sans',
  fontFamilyMono: '--sd-font-family-mono',
  fontSizeXs: '--sd-font-size-xs',
  fontSizeSm: '--sd-font-size-sm',
  fontSizeMd: '--sd-font-size-md',
  fontSizeLg: '--sd-font-size-lg',
  fontSizeXl: '--sd-font-size-xl',
  fontSize2xl: '--sd-font-size-2xl',
  fontSize3xl: '--sd-font-size-3xl',
  fontSize4xl: '--sd-font-size-4xl',
  fontWeightRegular: '--sd-font-weight-regular',
  fontWeightMedium: '--sd-font-weight-medium',
  fontWeightSemibold: '--sd-font-weight-semibold',
  fontWeightBold: '--sd-font-weight-bold',
  lineHeightTight: '--sd-line-height-tight',
  lineHeightNormal: '--sd-line-height-normal',
  lineHeightRelaxed: '--sd-line-height-relaxed',

  // Shadows
  shadowSm: '--sd-shadow-sm',
  shadowMd: '--sd-shadow-md',
  shadowLg: '--sd-shadow-lg',
  shadowXl: '--sd-shadow-xl',

  // Radii
  radiusNone: '--sd-radius-none',
  radiusSm: '--sd-radius-sm',
  radiusMd: '--sd-radius-md',
  radiusLg: '--sd-radius-lg',
  radiusXl: '--sd-radius-xl',
  radiusFull: '--sd-radius-full',

  // Breakpoints
  breakpointSm: '--sd-breakpoint-sm',
  breakpointMd: '--sd-breakpoint-md',
  breakpointLg: '--sd-breakpoint-lg',
  breakpointXl: '--sd-breakpoint-xl',
  breakpoint2xl: '--sd-breakpoint-2xl',

  // Z-index
  zBase: '--sd-z-base',
  zDropdown: '--sd-z-dropdown',
  zSticky: '--sd-z-sticky',
  zOverlay: '--sd-z-overlay',
  zModal: '--sd-z-modal',
  zPopover: '--sd-z-popover',
  zTooltip: '--sd-z-tooltip',
} as const;

export type TokenName = keyof typeof tokens;
export type TokenCSSVar = (typeof tokens)[TokenName];
