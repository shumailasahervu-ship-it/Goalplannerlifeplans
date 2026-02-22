import { Platform } from 'react-native';

export const requestTrackingPermission = async (): Promise<boolean> => {
  // ATT is iOS-only; for other platforms just return true.
  if (Platform.OS !== 'ios') return true;

  try {
    // Lazy import so bundling doesn't require this module when not installed.
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const mod = require('expo-tracking-transparency');
    if (typeof mod?.requestTrackingPermissionsAsync !== 'function') return false;
    const res = await mod.requestTrackingPermissionsAsync();
    return res?.status === 'granted';
  } catch {
    return false;
  }
};

export const initializeMobileAds = async (): Promise<void> => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { MobileAds } = require('react-native-google-mobile-ads');
    if (MobileAds?.initialize) {
      await MobileAds.initialize();
    }
  } catch {
    // ignore
  }
};

export const showInterstitialAd = async (): Promise<void> => {
  // No-op placeholder. Implement with react-native-google-mobile-ads if needed.
};

export const showAppOpenAd = async (): Promise<void> => {
  // No-op placeholder. Implement with react-native-google-mobile-ads if needed.
};
