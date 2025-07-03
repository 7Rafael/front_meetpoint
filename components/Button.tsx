import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  View
} from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { getColors, Fonts } from '@/constants/Colors';

interface ButtonProps {
  title: string;
  onPress: () => void;
  primary?: boolean;
  outline?: boolean;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  children?: React.ReactNode;
}

const Button = ({ 
  title, 
  onPress, 
  primary = true, 
  outline = false,
  loading = false,
  disabled = false,
  style,
  textStyle,
  children
}: ButtonProps) => {
  const { isDark } = useTheme();
  const colors = getColors(isDark);

  const styles = StyleSheet.create({
    button: {
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 25,
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: 120,
    },
    primaryButton: {
      backgroundColor: colors.primary,
    },
    outlineButton: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: colors.primary,
    },
    disabledButton: {
      backgroundColor: colors.hoverFocus,
      opacity: 0.7,
    },
    text: {
      fontSize: 16,
      fontFamily: Fonts.semiBold,
    },
    primaryText: {
      color: colors.white,
    },
    outlineText: {
      color: colors.primary,
    },
    disabledText: {
      color: colors.white,
    },
    childrenContainer: {
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

  const buttonStyles = [
    styles.button,
    primary && !outline && styles.primaryButton,
    outline && styles.outlineButton,
    disabled && styles.disabledButton,
    style,
  ];

  const textStyles = [
    styles.text,
    primary && !outline && styles.primaryText,
    outline && styles.outlineText,
    disabled && styles.disabledText,
    textStyle,
  ];

  return (
    <TouchableOpacity 
      style={buttonStyles} 
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator 
          color={outline ? colors.primary : colors.white} 
          size="small" 
        />
      ) : children ? (
        <View style={styles.childrenContainer}>
          {children}
        </View>
      ) : (
        <Text style={textStyles}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

export default Button;