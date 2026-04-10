import React from 'react';
import {
  Modal,
  View,
  ActivityIndicator,
  Text,
  StyleSheet,
} from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING } from '../config/colors';

interface LoadingOverlayProps {
  visible: boolean;
  message?: string;
}

/**
 * Loading Overlay Component
 * Full-screen loading indicator
 */
export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  visible,
  message = 'Loading...',
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <View style={styles.container}>
        <View style={styles.box}>
          <ActivityIndicator
            size="large"
            color={COLORS.PRIMARY}
          />
          {message && (
            <Text style={styles.message}>{message}</Text>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.OVERLAY,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    backgroundColor: COLORS.SURFACE,
    borderRadius: 12,
    padding: SPACING.xl,
    alignItems: 'center',
    gap: SPACING.lg,
  },
  message: {
    ...TYPOGRAPHY.BODY,
    color: COLORS.TEXT_PRIMARY,
  },
});

export default LoadingOverlay;