import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ActivityIndicator, SafeAreaView } from 'react-native';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { signInWithEmail, clearError } from '../../redux/slices/authSlice';
import { showNotification } from '../../redux/slices/uiSlice';
import { COLORS, TYPOGRAPHY, SPACING } from '../../config/colors';
import { validateEmail, validatePassword } from '../../utils/validators';

const LoginScreen: React.FC<any> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      dispatch(
        showNotification({
          type: 'error',
          message: 'Please fill in all fields',
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

    try {
      await dispatch(
        signInWithEmail({
          email: email.trim(),
          password,
        })
      ).unwrap();
      
      dispatch(
        showNotification({
          type: 'success',
          message: 'Login successful!',
        })
      );
    } catch (error: any) {
      dispatch(
        showNotification({
          type: 'error',
          message: error.message || 'Login failed',
        })
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.emoji}>🔍</Text>
          <Text style={styles.title}>Crime Mystery</Text>
          <Text style={styles.subtitle}>Detective Agency</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {error && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {/* Email Input */}
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

          {/* Password Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordInput}>
              <TextInput
                style={styles.input}
                placeholder="Enter password"
                placeholderTextColor={COLORS.TEXT_SECONDARY}
                value={password}
                onChangeText={setPassword}
                editable={!isLoading}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                <Text style={styles.passwordToggle}>
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Login Button */}
          <TouchableOpacity
            style={[
              styles.loginButton,
              isLoading && { opacity: 0.6 },
            ]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={COLORS.SURFACE} />
            ) : (
              <Text style={styles.loginButtonText}>Login</Text>
            )}
          </TouchableOpacity>

          {/* Sign Up Link */}
          <View style={styles.signupLink}>
            <Text style={styles.signupText}>Don't have an account? </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('SignUp')}
              disabled={isLoading}
            >
              <Text style={styles.signupLinkText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    justifyContent: 'center',
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
  errorBox: {
    backgroundColor: COLORS.ACCENT_LIGHT,
    borderRadius: 8,
    padding: SPACING.md,
  },
  errorText: {
    ...TYPOGRAPHY.BODY_SMALL,
    color: COLORS.ACCENT,
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
  loginButton: {
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 8,
    paddingVertical: SPACING.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SPACING.lg,
  },
  loginButtonText: {
    ...TYPOGRAPHY.BUTTON,
    color: COLORS.SURFACE,
    fontSize: 16,
  },
  signupLink: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SPACING.lg,
  },
  signupText: {
    ...TYPOGRAPHY.BODY,
    color: COLORS.TEXT_SECONDARY,
  },
  signupLinkText: {
    ...TYPOGRAPHY.BUTTON,
    color: COLORS.PRIMARY,
  },
});

export default LoginScreen;