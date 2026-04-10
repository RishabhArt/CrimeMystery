import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  View,
} from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, SHADOWS } from '../config/colors';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'outline';
  size?: 'small' | 'medium' | 'large';
  isLoading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

/**
 * Reusable Button Component
 * Features: Multiple variants, sizes, loading states, icons
 */
export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  isLoading = false,
  disabled = false,
  fullWidth = false,
  style,
  textStyle,
  icon,
  iconPosition = 'left',
}) => {
  const getBackgroundColor = (): string => {
    if (disabled) return COLORS.DISABLED;
    switch (variant) {
      case 'primary':
        return COLORS.PRIMARY;
      case 'secondary':
        return COLORS.SECONDARY;
      case 'danger':
        return COLORS.WARNING;
      case 'success':
        return COLORS.SUCCESS;
      case 'outline':
        return COLORS.SURFACE;
      default:
        return COLORS.PRIMARY;
    }
  };

  const getTextColor = (): string => {
    if (variant === 'outline') return COLORS.PRIMARY;
    if (variant === 'secondary' || variant === 'success') return COLORS.SURFACE;
    return COLORS.SURFACE;
  };

  const getPadding = (): { horizontal: number; vertical: number } => {
    switch (size) {
      case 'small':
        return { horizontal: SPACING.md, vertical: SPACING.sm };
      case 'large':
        return { horizontal: SPACING.xl, vertical: SPACING.lg };
      default:
        return { horizontal: SPACING.lg, vertical: SPACING.md };
    }
  };

  const getTextSize = (): number => {
    switch (size) {
      case 'small':
        return 12;
      case 'large':
        return 16;
      default:
        return 14;
    }
  };

  const padding = getPadding();

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: getBackgroundColor(),
          paddingHorizontal: padding.horizontal,
          paddingVertical: padding.vertical,
          width: fullWidth ? '100%' : 'auto',
          borderWidth: variant === 'outline' ? 2 : 0,
          borderColor: variant === 'outline' ? COLORS.PRIMARY : 'transparent',
          opacity: (disabled || isLoading) ? 0.6 : 1,
        },
        style,
        !disabled && !isLoading && SHADOWS.sm,
      ]}
      onPress={onPress}
      disabled={disabled || isLoading}
      activeOpacity={0.8}
    >
      {isLoading ? (
        <ActivityIndicator color={getTextColor()} size="small" />
      ) : (
        <View style={styles.content}>
          {icon && iconPosition === 'left' && (
            <View style={styles.iconLeft}>{icon}</View>
          )}
          <Text
            style={[
              styles.text,
              {
                color: getTextColor(),
                fontSize: getTextSize(),
              },
              textStyle,
            ]}
          >
            {title}
          </Text>
          {icon && iconPosition === 'right' && (
            <View style={styles.iconRight}>{icon}</View>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  text: {
    fontWeight: '600',
  },
  iconLeft: {
    marginRight: SPACING.xs,
  },
  iconRight: {
    marginLeft: SPACING.xs,
  },
});

export default Button;