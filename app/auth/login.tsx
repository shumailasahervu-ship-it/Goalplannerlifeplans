import AdBanner from '@/components/AdBanner';
import { auth } from '@/constants/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { useSnackbar } from '@/contexts/SnackbarContext';
import { useTheme } from '@/contexts/ThemeContext';
import { showAppOpenAd } from '@/utils/ads';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { sendPasswordResetEmail } from 'firebase/auth';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 40,
    paddingHorizontal: 24,
    paddingBottom: 60,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  inputContainer: {
    marginBottom: 16,
    position: 'relative',
  },
  inputIcon: {
    position: 'absolute',
    left: 16,
    top: 20,
    zIndex: 1,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 16,
    paddingLeft: 48,
    paddingRight: 48,
    fontSize: 16,
    height: 56,
  },
  eyeIcon: {
    position: 'absolute',
    right: 16,
    top: 20,
    padding: 8,
  },
  button: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 24,
    minHeight: 56,
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  footerText: {
    fontSize: 14,
  },
  linkText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  form: {
    flex: 1,
    padding: 24,
  },
});

export default function LoginScreen() {
  const { colors } = useTheme();
  const { signIn } = useAuth();
  const { showSnackbar } = useSnackbar();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async () => {
    const emailTrimmed = email.trim();
    if (!emailTrimmed) {
      Alert.alert('Reset Password', 'Please enter your email address first so we can send you a reset link.');
      return;
    }

    try {
      await sendPasswordResetEmail(auth, emailTrimmed);
      showSnackbar('Password reset link sent to your email.', 'success');
    } catch (error: any) {
      console.error('Password reset error:', error);
      const code = error?.code as string | undefined;
      let message = 'We could not send a reset link. Please try again.';

      if (code === 'auth/user-not-found') {
        message = "We couldn't find an account with that email. Please check the address or sign up.";
      } else if (code === 'auth/invalid-email') {
        message = 'That email address does not look valid. Please check and try again.';
      }

      Alert.alert('Reset Password Failed', message);
    }
  };

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      showSnackbar('Please fill in all fields', 'error');
      return;
    }

    setLoading(true);
    try {
      await signIn(email.trim(), password.trim());
      showSnackbar('Welcome back!', 'success');
      // Navigate to home first, then show ad (don't block navigation)
      router.replace('/(tabs)');
      // Show app open ad after navigation (non-blocking)
      showAppOpenAd().catch(console.error);
    } catch (error: any) {
      console.error('Sign in error:', error);
      const code = error?.code as string | undefined;
      let message = 'Something went wrong while signing you in. Please try again.';

      if (code === 'auth/user-not-found') {
        message = "We couldn't find an account with that email. Please check your email or sign up for a new account.";
      } else if (code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
        message = 'Incorrect email or password. Please double-check and try again.';
      } else if (code === 'auth/too-many-requests') {
        message = 'Too many failed attempts. Please wait a moment or reset your password and try again.';
      }

      Alert.alert('Sign In Failed', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.primary }}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      <SafeAreaView style={{ backgroundColor: colors.primary }} edges={['top']} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1, backgroundColor: colors.background }}
      >
        <LinearGradient
          colors={[colors.primary, colors.secondary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <View>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to continue your journey</Text>
          </View>
        </LinearGradient>

        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={20} color={colors.icon} style={styles.inputIcon} />
            <TextInput
              style={[styles.input, { color: colors.text, borderColor: colors.border }]}
              placeholder="Email"
              placeholderTextColor={colors.textSecondary}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color={colors.icon} style={styles.inputIcon} />
            <TextInput
              style={[styles.input, { color: colors.text, borderColor: colors.border }]}
              placeholder="Password"
              placeholderTextColor={colors.textSecondary}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity 
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeIcon}
            >
              <Ionicons 
                name={showPassword ? 'eye-off-outline' : 'eye-outline'} 
                size={20} 
                color={colors.icon} 
              />
            </TouchableOpacity>
          </View>

          <View style={{ alignItems: 'flex-end', marginBottom: 8 }}>
            <TouchableOpacity onPress={handleForgotPassword}>
              <Text style={[styles.linkText, { color: colors.primary }]}>Forgot password?</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[
              styles.button,
              { 
                backgroundColor: colors.primary,
                opacity: loading ? 0.7 : 1,
              },
            ]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <>
                <Ionicons name="log-in-outline" size={20} color="white" />
                <Text style={styles.buttonText}>Sign In</Text>
              </>
            )}
          </TouchableOpacity>

          <View style={[styles.footer, { marginBottom: 24 }]}>
            <Text style={[styles.footerText, { color: colors.textSecondary }]}>
              Don't have an account?{' '}
            </Text>
            <TouchableOpacity 
              onPress={() => router.push('/auth/signup')}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={[styles.linkText, { color: colors.primary }]}>
                Sign up
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <AdBanner />
      </KeyboardAvoidingView>
    </View>
  );
}
