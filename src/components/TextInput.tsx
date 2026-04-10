import React, { useState } from 'react';
import {
  View,
  TextInput as RNTextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInputProps as RNTextInputProps,
  ViewStyle,
} from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../config/colors';
import { validateEmail, validatePassword } from '../utils/validators';

interface TextInputProps extends RNTextInputProps {
  label?: string;
  error?: string;
  helper?: string;
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconPress?: () => void;
  validationType?: 'email' | 'password' | 'none';
  containerStyle?: ViewStyle;
  showValidationIndicator?: boolean;
}

/**
 * TextInput Component
 * Features: label, error, helper text, icons, validation
 */
export const TextInput: React.FC<TextInputProps> = ({
  label,
  error,
  helper,
  icon,
  rightIcon,
  onRightIconPress,
  validationType = 'none',
  containerStyle,
  value,
  onChangeText,
  showValidationIndicator = true,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isValid, setIsValid] = useState(true);

  const handleChangeText = (text: string) => {
    onChangeText?.(text);

    // Validation
    if (validationType !== 'none' && text.length > 0) {
      let valid = true;
      switch (validationType) {
        case 'email':
          valid = validateEmail(text);
          break;
        case 'password':
          valid = validatePassword(text);
          break;
      }
      setIsValid(valid);
    } else {
      setIsValid(true);
    }
  };

  const borderColor = error
    ? COLORS.WARNING
    : !isValid && value
    ? COLORS.WARNING
    : isFocused
    ? COLORS.PRIMARY
    : COLORS.DIVIDER;

  const labelColor = error || (!isValid && value) ? COLORS.WARNING : COLORS.TEXT_PRIMARY;

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={[styles.label, { color: labelColor }]}>
          {label}
        </Text>
      )}

      <View
        style={[
          styles.inputContainer,
          {
            borderColor,
            backgroundColor: isFocused
              ? COLORS.PRIMARY_LIGHT
              : COLORS.SURFACE,
          },
        ]}
      >
        {icon && <View style={styles.iconLeft}>{icon}</View>}

        <RNTextInput
          style={styles.input}
          placeholderTextColor={COLORS.TEXT_SECONDARY}
          value={value}
          onChangeText={handleChangeText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />

        {rightIcon && (
          <TouchableOpacity
            style={styles.iconRight}
            onPress={onRightIconPress}
          >
            {rightIcon}
          </TouchableOpacity>
        )}

        {showValidationIndicator && validationType !== 'none' && value && (
          <View style={styles.validationIcon}>
            <Text>{isValid ? '✅' : '❌'}</Text>
          </View>
        )}
      </View>

      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}

      {!error && helper && (
        <Text style={styles.helperText}>{helper}</Text>
      )}

      {validationType === 'password' && value && !isValid && (
        <Text style={styles.helperText}>
          Password must have uppercase, lowercase, numbers, and be 8+ chars
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.lg,
  },
  label: {
    ...TYPOGRAPHY.BUTTON,
    marginBottom: SPACING.sm,
    fontWeight: '600',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.lg,
    minHeight: 50,
  },
  input: {
    ...TYPOGRAPHY.BODY,
    color: COLORS.TEXT_PRIMARY,
    paddingVertical: SPACING.md,
    flex: 1,
  },
  iconLeft: {
    marginRight: SPACING.sm,
  },
  iconRight: {
    marginLeft: SPACING.sm,
    padding: SPACING.sm,
  },
  validationIcon: {
    padding: SPACING.sm,
  },
  errorText: {
    ...TYPOGRAPHY.CAPTION,
    color: COLORS.WARNING,
    marginTop: SPACING.sm,
  },
  helperText: {
    ...TYPOGRAPHY.CAPTION,
    color: COLORS.TEXT_SECONDARY,
    marginTop: SPACING.sm,
  },
});

export default TextInput;