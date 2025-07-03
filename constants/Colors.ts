export const LightColors = {
  primary: '#db7e00',
  background: '#ffffff',
  textPrimary: '#000000',
  textSecondary: '#6a6666',
  backgroundProfile: '#F0F2F2',
  hoverFocus: '#CCCCCC',
  white: '#ffffff',
  error: '#dc3545',
  success: '#28a745',
  border: '#e0e0e0',
  shadow: 'rgba(0, 0, 0, 0.1)',
  primaryLight: '#db7e0020',
  warning: '#db7e00',
};

export const DarkColors = {
  primary: '#ff9500',
  background: '#1a1a1a',
  textPrimary: '#ffffff',
  textSecondary: '#a0a0a0',
  backgroundProfile: '#2a2a2a',
  hoverFocus: '#404040',
  white: '#ffffff',
  error: '#ff4757',
  success: '#2ed573',
  border: '#404040',
  shadow: 'rgba(0, 0, 0, 0.3)',
  primaryLight: '#ff950020',
  warning: '#ff9500',
};

// Create a complete color object with nested structure
export const getColors = (isDark: boolean) => {
  const baseColors = isDark ? DarkColors : LightColors;
  return {
    ...baseColors,
    text: {
      primary: baseColors.textPrimary,
      secondary: baseColors.textSecondary,
      light: baseColors.textSecondary,
      white: '#ffffff'
    },
    background: {
      primary: baseColors.background,
      secondary: baseColors.backgroundProfile,
      accent: baseColors.backgroundProfile
    },
  };
};

// Default export with nested structure for backward compatibility
const Colors = {
  ...LightColors,
  text: {
    primary: LightColors.textPrimary,
    secondary: LightColors.textSecondary,
    light: LightColors.textSecondary,
    white: '#ffffff'
  },
  background: {
    primary: LightColors.background,
    secondary: LightColors.backgroundProfile,
    accent: LightColors.backgroundProfile
  },
};

export const updateColors = (isDark: boolean) => {
  // This function is kept for compatibility but the main export remains static
  // Components should use getColors() or useTheme() for dynamic colors
};

export const Fonts = {
  regular: 'Inter-Regular',
  medium: 'Inter-Medium',
  semiBold: 'Inter-SemiBold',
  bold: 'Inter-Bold',
};

export default Colors;