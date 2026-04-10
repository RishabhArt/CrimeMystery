import React from 'react';
import {
  View,
  ViewStyle,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '../config/colors';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  variant?: 'default' | 'outlined' | 'elevated';
  padding?: 'small' | 'medium' | 'large';
}

/**
 * Card Component
 * Reusable container with consistent styling
 */
export const Card: React.FC<CardProps> = ({
  children,
  style,
  onPress,
  variant = 'default',
  padding = 'medium',
}) => {
  const getPadding = (): number => {
    switch (padding) {
      case 'small':
        return SPACING.md;
      case 'large':
        return SPACING.xl;
      default:
        return SPACING.lg;
    }
  };

  const containerStyle: ViewStyle = {
    backgroundColor: COLORS.SURFACE,
    borderRadius: BORDER_RADIUS.lg,
    padding: getPadding(),
    overflow: 'hidden',
  };

  if (variant === 'outlined') {
    containerStyle.borderWidth = 1;
    containerStyle.borderColor = COLORS.DIVIDER;
  } else if (variant === 'elevated') {
    Object.assign(containerStyle, SHADOWS.lg);
  }

  const Container = onPress ? TouchableOpacity : View;

  return (
    <Container
      style={[containerStyle, style]}
      {...(onPress && { onPress, activeOpacity: 0.8 })}
    >
      {children}
    </Container>
  );
};

export default Card;