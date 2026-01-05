import { Platform } from 'react-native';

// Set to true to use Google's test ad units (always show test ads)
const USE_TEST_ADS = __DEV__;

// Google's official test ad unit IDs - always fill with test ads
const TEST_AD_UNITS = {
  banner: 'ca-app-pub-3940256099942544/2934735716',
  interstitial: 'ca-app-pub-3940256099942544/4411468910',
  rewarded: 'ca-app-pub-3940256099942544/1712485313',
  appOpen: 'ca-app-pub-3940256099942544/5575463023',
};

export const ADMOB_CONFIG = {
  android: {
    appId: 'ca-app-pub-4386055252112057~5841505720',
    banner: 'ca-app-pub-4386055252112057/2419359368',
    interstitial: 'ca-app-pub-4386055252112057/1106277690',
    rewarded: 'ca-app-pub-4386055252112057/8793196026',
    appOpen: 'ca-app-pub-4386055252112057/5683106516',
  },
  ios: {
    appId: 'ca-app-pub-4386055252112057~7452194192',
    banner: 'ca-app-pub-4386055252112057/1902260716',
    interstitial: 'ca-app-pub-4386055252112057/4826030859',
    rewarded: 'ca-app-pub-4386055252112057/9836591055',
    appOpen: 'ca-app-pub-4386055252112057/5874678208',
  },
} as const;

export const getBannerAdUnitId = () => {
  if (USE_TEST_ADS) return TEST_AD_UNITS.banner;
  return Platform.OS === 'ios' ? ADMOB_CONFIG.ios.banner : ADMOB_CONFIG.android.banner;
};

export const getInterstitialAdUnitId = () => {
  if (USE_TEST_ADS) return TEST_AD_UNITS.interstitial;
  return Platform.OS === 'ios' ? ADMOB_CONFIG.ios.interstitial : ADMOB_CONFIG.android.interstitial;
};

export const getRewardedAdUnitId = () => {
  if (USE_TEST_ADS) return TEST_AD_UNITS.rewarded;
  return Platform.OS === 'ios' ? ADMOB_CONFIG.ios.rewarded : ADMOB_CONFIG.android.rewarded;
};

export const getAppOpenAdUnitId = () => {
  if (USE_TEST_ADS) return TEST_AD_UNITS.appOpen;
  return Platform.OS === 'ios' ? ADMOB_CONFIG.ios.appOpen : ADMOB_CONFIG.android.appOpen;
};
