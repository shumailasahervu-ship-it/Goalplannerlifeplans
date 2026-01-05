import { Stack, useRootNavigationState, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { SnackbarProvider } from '@/contexts/SnackbarContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { initializeMobileAds, requestTrackingPermission } from '@/utils/ads';
import { hasCompletedOnboarding } from '@/utils/storage';

export const unstable_settings = {
  anchor: '(tabs)',
};

function RootLayoutNav() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const segments = useSegments();
  const navigationState = useRootNavigationState();
  const adsInitializedRef = useRef(false);
  const navigationHandledRef = useRef(false);
  const [onboardingChecked, setOnboardingChecked] = useState(false);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);

  // Request ATT permission and initialize ads once
  useEffect(() => {
    const setupAds = async () => {
      if (!adsInitializedRef.current) {
        adsInitializedRef.current = true;
        
        // Add delay to ensure app is fully loaded
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Request ATT permission first (iOS only)
        console.log('🔔 LIFEPLAN: Requesting ATT permission...');
        const trackingGranted = await requestTrackingPermission();
        console.log('🔔 LIFEPLAN: ATT permission granted:', trackingGranted);
        
        // Initialize ads with retry mechanism
        let retryCount = 0;
        const maxRetries = 3;
        
        while (retryCount < maxRetries) {
          try {
            console.log(`🔔 LIFEPLAN: Initializing mobile ads (attempt ${retryCount + 1}/${maxRetries})...`);
            await initializeMobileAds();
            console.log('🔔 LIFEPLAN: ✅ Mobile ads initialized successfully');
            break;
          } catch (error) {
            console.error(`🔔 LIFEPLAN: ❌ Failed to initialize ads (attempt ${retryCount + 1}/${maxRetries}):`, error);
            retryCount++;
            
            if (retryCount < maxRetries) {
              console.log('🔔 LIFEPLAN: Retrying ad initialization in 3 seconds...');
              await new Promise(resolve => setTimeout(resolve, 3000));
            } else {
              console.error('🔔 LIFEPLAN: ❌ Max retries reached, ads will not be available');
            }
          }
        }
      }
    };
    setupAds();
  }, []);

  // Check onboarding status on mount only
  useEffect(() => {
    const checkOnboarding = async () => {
      const completed = await hasCompletedOnboarding();
      console.log('Onboarding status checked:', completed);
      setHasSeenOnboarding(completed);
      setOnboardingChecked(true);
    };
    checkOnboarding();
  }, []); // Remove segments dependency to prevent re-checking

  // Handle initial navigation based on auth and onboarding status
  useEffect(() => {
    // Wait for navigation to be ready and auth to be loaded
    if (!navigationState?.key || loading || !onboardingChecked) return;

    const inAuthGroup = segments[0] === 'auth';
    const inOnboarding = segments[0] === 'onboarding';
    const inTabs = segments[0] === '(tabs)';

    console.log('Navigation check:', {
      segments,
      hasSeenOnboarding,
      user: !!user,
      inAuthGroup,
      inOnboarding,
    });

    // New user who hasn't seen onboarding
    if (!hasSeenOnboarding && !inOnboarding) {
      console.log('Redirecting to onboarding');
      router.replace('/onboarding');
      return;
    }

    // User who has seen onboarding but not logged in - show login
    if (hasSeenOnboarding && !user && !inAuthGroup && !inOnboarding) {
      console.log('Redirecting to login');
      router.replace('/auth/login');
      return;
    }

    // Logged in user on auth/onboarding pages - go to home
    if (user && (inAuthGroup || inOnboarding)) {
      console.log('Redirecting to home');
      router.replace('/(tabs)');
      return;
    }
  }, [navigationState?.key, user, loading, onboardingChecked, hasSeenOnboarding, segments]);

  if (loading || !onboardingChecked) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <>
      <OnboardingDebug />
      <Stack>
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="auth/login" options={{ headerShown: false }} />
        <Stack.Screen name="auth/signup" options={{ headerShown: false }} />
        <Stack.Screen name="goals/index" options={{ headerShown: false }} />
        <Stack.Screen name="goals/create" options={{ headerShown: false }} />
        <Stack.Screen name="goals/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SnackbarProvider>
          <RootLayoutNav />
        </SnackbarProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
