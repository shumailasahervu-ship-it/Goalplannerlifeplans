import AsyncStorage from '@react-native-async-storage/async-storage';

const ONBOARDING_COMPLETE_KEY = '@lifeplan_onboarding_complete';

/**
 * Check if the user has completed onboarding
 */
export const hasCompletedOnboarding = async (): Promise<boolean> => {
  try {
    const value = await AsyncStorage.getItem(ONBOARDING_COMPLETE_KEY);
    console.log('Checking onboarding status:', value);
    return value === 'true';
  } catch (error) {
    console.error('Error checking onboarding status:', error);
    return false;
  }
};

/**
 * Mark onboarding as complete
 */
export const setOnboardingComplete = async (): Promise<void> => {
  try {
    await AsyncStorage.setItem(ONBOARDING_COMPLETE_KEY, 'true');
    console.log('Onboarding marked as complete in AsyncStorage');
  } catch (error) {
    console.error('Error setting onboarding complete:', error);
  }
};

/**
 * Reset onboarding status (for testing)
 */
export const resetOnboarding = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(ONBOARDING_COMPLETE_KEY);
    console.log('Onboarding status reset');
  } catch (error) {
    console.error('Error resetting onboarding:', error);
  }
};

/**
 * Reset ATT permission status (for testing only - remove in production)
 * Note: This doesn't actually reset the system permission, just our tracking
 */
export const resetATTPreference = async (): Promise<void> => {
  if (__DEV__) {
    console.log('ATT reset function called (dev only)');
    // In development, we can't actually reset the system ATT permission
    // The user would need to go to Settings > Privacy & Security > Tracking
  }
};
