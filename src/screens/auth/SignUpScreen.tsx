import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ActivityIndicator, SafeAreaView, ScrollView } from 'react-native';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { signUpWithEmail } from '../../redux/slices/authSlice';
import { showNotification } from '../../redux/slices/uiSlice';
import { COLORS, TYPOGRAPHY, SPACING } from '../../config/colors';
import { validateEmail, validatePassword, validateDisplayName } from '../../utils/validators';

const SignUpScreen: React.FC<any> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((state) => state.auth);
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleSignUp = async () => {
    if (!displayName.trim() || !email.trim() || !password || !confirmPassword) {
      dispatch(
        showNotification({
          type: 'error',
          message: 'Please fill in all fields',
        })
      );
      return;
    }

    if (!validateDisplayName(displayName)) {
      dispatch(
        showNotification({
          type: 'error',
          message: 'Name must be 2-100 characters',
        })
      );
      return;
    }

    if (!validateEmail(email)) {
      dispatch(
        showNotification({
          type: 'error',
          message: 'Invalid email format',
        })
      );
      return;
    }

    if (!validatePassword(password)) {
      dispatch(
        showNotification({
          type: 'error',
          message: 'Password: 8+ chars, uppercase, lowercase, numbers',
        })
      );
      return;
    }

    if (password !== confirmPassword) {
      dispatch(
        showNotification({
          type: 'error',
          message: 'Passwords do not match',
        })
      );
      return;
    }

    if (!agreedToTerms) {
      dispatch(
        showNotification({
          type: 'error',
          message: 'Please agree to Terms of Service',
        })
      );
      return;
    }

    try {
      await dispatch(
        signUpWithEmail({
          email: email.trim(),
          password,
          displayName: displayName.trim(),
        })
      ).unwrap();

      dispatch(
        showNotification({
          type: 'success',
          message: 'Account created successfully!',
        })
      );
    } catch (error: any) {
      dispatch(
        showNotification({
          type: 'error',
          message: error.message || 'Sign up failed',
        })
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.emoji}>🔍</Text>
          <Text style={styles.title}>Become a Detective</Text>
          <Text style={styles.subtitle}>Create your badge</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {/* Display Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Detective Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Your detective name"
              placeholderTextColor={COLORS.TEXT_SECONDARY}
              value={displayName}
              onChangeText={setDisplayName}
              editable={!isLoading}
            />
          </View>

          {/* Email */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="your@email.com"
              placeholderTextColor={COLORS.TEXT_SECONDARY}
              value={email}
              onChangeText={setEmail}
              editable={!isLoading}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Password */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordInput}>
              <TextInput
                style={styles.input}
                placeholder="At least 8 characters"
                placeholderTextColor={COLORS.TEXT_SECONDARY}
                value={password}
                onChangeText={setPassword}
                editable={!isLoading}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} disabled={isLoading}>
                <Text style={styles.passwordToggle}>{showPassword ? '👁️' : '👁️‍🗨️'}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Confirm Password */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Confirm Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Re-enter password"
              placeholderTextColor={COLORS.TEXT_SECONDARY}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              editable={!isLoading}
              secureTextEntry={!showPassword}
            />
          </View>

          {/* Terms Checkbox */}
          <View style={styles.termsBox}>
            <TouchableOpacity
              style={[styles.checkbox, agreedToTerms && styles.checkboxChecked]}
              onPress={() => setAgreedToTerms(!agreedToTerms)}
              disabled={isLoading}
            >
              {agreedToTerms && <Text style={styles.checkmark}>✓</Text>}
            </TouchableOpacity>
            <Text style={styles.termsText}>I agree to Terms of Service</Text>
          </View>

          {/* Sign Up Button */}
          <TouchableOpacity
            style={[
              styles.signupButton,
              (!displayName || !email || !password || !agreedToTerms || isLoading) && {
                opacity: 0.6,
              },
            ]}
            onPress={handleSignUp}
            disabled={!displayName || !email || !password || !agreedToTerms || isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={COLORS.SURFACE} />
            ) : (
              <Text style={styles.signupButtonText}>Create Badge</Text>
            )}
          </TouchableOpacity>

          {/* Login Link */}
          <View style={styles.loginLink}>
            <Text style={styles.loginText}>Already a detective? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')} disabled={isLoading}>
              <Text style={styles.loginLinkText}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xxxl,
  },
  emoji: {
    fontSize: 48,
    marginBottom: SPACING.lg,
  },
  title: {
    ...TYPOGRAPHY.H1,
    color: COLORS.PRIMARY,
    marginBottom: SPACING.sm,
  },
  subtitle: {
    ...TYPOGRAPHY.BODY,
    color: COLORS.TEXT_SECONDARY,
  },
  form: {
    gap: SPACING.lg,
  },
  inputGroup: {
    gap: SPACING.sm,
  },
  label: {
    ...TYPOGRAPHY.BUTTON,
    color: COLORS.TEXT_PRIMARY,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.DIVIDER,
    borderRadius: 8,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.SURFACE,
    color: COLORS.TEXT_PRIMARY,
  },
  passwordInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.DIVIDER,
    borderRadius: 8,
    backgroundColor: COLORS.SURFACE,
    paddingRight: SPACING.lg,
  },
  passwordToggle: {
    fontSize: 20,
    padding: SPACING.md,
  },
  termsBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: COLORS.PRIMARY,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: COLORS.PRIMARY,
  },
  checkmark: {
    color: COLORS.SURFACE,
    fontWeight: 'bold',
  },
  termsText: {
    ...TYPOGRAPHY.BODY_SMALL,
    color: COLORS.TEXT_PRIMARY,
    flex: 1,
  },
  signupButton: {
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 8,
    paddingVertical: SPACING.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SPACING.lg,
  },
  signupButtonText: {
    ...TYPOGRAPHY.BUTTON,
    color: COLORS.SURFACE,
    fontSize: 16,
  },
  loginLink: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SPACING.lg,
  },
  loginText: {
    ...TYPOGRAPHY.BODY,
    color: COLORS.TEXT_SECONDARY,
  },
  loginLinkText: {
    ...TYPOGRAPHY.BUTTON,
    color: COLORS.PRIMARY,
  },
});

export default SignUpScreen;