import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
} from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../config/colors';

interface NotificationProps {
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
  onClose?: () => void;
}

/**
 * Notification/Toast Component
 * Displays temporary messages to user
 */
export const Notification: React.FC<NotificationProps> = ({
  type,
  message,
  duration = 3000,
  onClose,
}) => {
  const [opacity] = React.useState(new Animated.Value(0));

  useEffect(() => {
    // Animate in
    Animated.timing(opacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    // Auto hide
    const timer = setTimeout(() => {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        onClose?.();
      });
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, opacity, onClose]);

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return COLORS.SUCCESS_LIGHT;
      case 'error':
        return COLORS.ERROR_LIGHT;
      case 'warning':
        return COLORS.WARNING_LIGHT;
      case 'info':
        return COLORS.INFO_LIGHT;
      default:
        return COLORS.INFO_LIGHT;
    }
  };

  const getTextColor = () => {
    switch (type) {
      case 'success':
        return COLORS.SUCCESS;
      case 'error':
        return COLORS.ERROR;
      case 'warning':
        return COLORS.WARNING;
      case 'info':
        return COLORS.INFO;
      default:
        return COLORS.INFO;
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      case 'info':
        return 'ℹ️';
      default:
        return 'ℹ️';
    }
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity,
          backgroundColor: getBackgroundColor(),
          borderLeftColor: getTextColor(),
        },
      ]}
    >
      <Text style={styles.icon}>{getIcon()}</Text>
      <Text
        style={[
          styles.message,
          {
            color: getTextColor(),
          },
        ]}
      >
        {message}
      </Text>
      <TouchableOpacity onPress={onClose}>
        <Text style={[styles.closeIcon, { color: getTextColor() }]}>✕</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    borderLeftWidth: 4,
    marginHorizontal: SPACING.lg,
    marginVertical: SPACING.md,
  },
  icon: {
    fontSize: 20,
  },
  message: {
    ...TYPOGRAPHY.BODY_SMALL,
    flex: 1,
  },
  closeIcon: {
    fontSize: 16,
    fontWeight: 'bold',
    padding: SPACING.sm,
  },
});

export default Notification;