import {
    getTrackingPermissionsAsync,
    requestTrackingPermissionsAsync,
} from 'expo-tracking-transparency';
import { Platform } from 'react-native';
import mobileAds, {
    AdEventType,
    AppOpenAd,
    InterstitialAd,
    MaxAdContentRating,
    RequestConfiguration,
    RewardedAd,
    RewardedAdEventType,
} from 'react-native-google-mobile-ads';

import {
    getAppOpenAdUnitId,
    getInterstitialAdUnitId,
    getRewardedAdUnitId,
} from '@/constants/admob';

let appOpenAd: AppOpenAd | null = null;
let interstitialAd: InterstitialAd | null = null;
let rewardedAd: RewardedAd | null = null;
let isInitialized = false;

/**
 * Request App Tracking Transparency permission on iOS.
 * This must be called before initializing ads for personalized ad targeting.
 */
export const requestTrackingPermission = async (): Promise<boolean> => {
  if (Platform.OS !== 'ios') {
    console.log('ATT: Not iOS, skipping permission request');
    return true; // Android doesn't need ATT
  }

  try {
    console.log('ATT: Checking current permission status...');
    const { status } = await getTrackingPermissionsAsync();
    console.log('ATT: Current status:', status);
    
    if (status === 'undetermined') {
      console.log('ATT: Permission is undetermined, requesting...');
      const { status: newStatus } = await requestTrackingPermissionsAsync();
      console.log('ATT: Permission request result:', newStatus);
      
      if (newStatus === 'granted') {
        console.log('ATT: User granted tracking permission');
      } else if (newStatus === 'denied') {
        console.log('ATT: User denied tracking permission');
      }
      
      return newStatus === 'granted';
    } else if (status === 'granted') {
      console.log('ATT: Permission already granted');
    } else if (status === 'denied') {
      console.log('ATT: Permission already denied');
    }
    
    return status === 'granted';
  } catch (error) {
    console.error('ATT: Failed to request tracking permission:', error);
    return false;
  }
};

export const initializeMobileAds = async () => {
  if (isInitialized) return;
  
  try {
    console.log('🔔 LIFEPLAN: Initializing mobile ads...');
    
    // Request ATT permission first (iOS only)
    const trackingGranted = await requestTrackingPermission();
    console.log('🔔 LIFEPLAN: Tracking permission granted:', trackingGranted);
    
    // Set request configuration for better ad targeting
    const requestConfiguration: RequestConfiguration = {
      maxAdContentRating: MaxAdContentRating.G,
      tagForChildDirectedTreatment: false,
      tagForUnderAgeOfConsent: false,
    };
    
    console.log('🔔 LIFEPLAN: Setting ad request configuration...');
    await mobileAds().setRequestConfiguration(requestConfiguration);
    
    console.log('🔔 LIFEPLAN: Initializing Google Mobile Ads SDK...');
    await mobileAds().initialize();
    isInitialized = true;
    console.log('🔔 LIFEPLAN: ✅ Mobile ads initialized successfully');
  } catch (error) {
    console.error('🔔 LIFEPLAN: ❌ Failed to initialize mobile ads:', error);
    console.error('🔔 LIFEPLAN: ❌ Error details:', JSON.stringify(error, null, 2));
  }
};

export const showAppOpenAd = async (): Promise<void> => {
  return new Promise((resolve) => {
    try {
      const unitId = getAppOpenAdUnitId();
      console.log('Loading app open ad with unit ID:', unitId);
      appOpenAd = AppOpenAd.createForAdRequest(unitId);

      const unsubscribeLoaded = appOpenAd.addAdEventListener(AdEventType.LOADED, () => {
        console.log('App open ad loaded successfully');
        appOpenAd?.show();
      });

      const unsubscribeClosed = appOpenAd.addAdEventListener(AdEventType.CLOSED, () => {
        console.log('App open ad closed');
        unsubscribeLoaded();
        unsubscribeClosed();
        unsubscribeError();
        resolve();
      });

      const unsubscribeError = appOpenAd.addAdEventListener(AdEventType.ERROR, (error) => {
        console.error('App open ad failed to load:', error);
        unsubscribeLoaded();
        unsubscribeClosed();
        unsubscribeError();
        resolve();
      });

      appOpenAd.load();
    } catch (error) {
      console.error('Failed to show app open ad:', error);
      resolve();
    }
  });
};

export const showInterstitialAd = async (): Promise<void> => {
  return new Promise((resolve) => {
    try {
      const unitId = getInterstitialAdUnitId();
      console.log('Loading interstitial ad with unit ID:', unitId);
      interstitialAd = InterstitialAd.createForAdRequest(unitId);

      const unsubscribeLoaded = interstitialAd.addAdEventListener(AdEventType.LOADED, () => {
        console.log('Interstitial ad loaded successfully');
        interstitialAd?.show();
      });

      const unsubscribeClosed = interstitialAd.addAdEventListener(AdEventType.CLOSED, () => {
        console.log('Interstitial ad closed');
        unsubscribeLoaded();
        unsubscribeClosed();
        unsubscribeError();
        resolve();
      });

      const unsubscribeError = interstitialAd.addAdEventListener(AdEventType.ERROR, (error) => {
        console.error('Interstitial ad failed to load:', error);
        unsubscribeLoaded();
        unsubscribeClosed();
        unsubscribeError();
        resolve();
      });

      interstitialAd.load();
    } catch (error) {
      console.error('Failed to show interstitial ad:', error);
      resolve();
    }
  });
};

export const showRewardedAd = async (): Promise<boolean> => {
  return new Promise((resolve) => {
    try {
      const unitId = getRewardedAdUnitId();
      console.log('Loading rewarded ad with unit ID:', unitId);
      rewardedAd = RewardedAd.createForAdRequest(unitId);

      const unsubscribeLoaded = rewardedAd.addAdEventListener(RewardedAdEventType.LOADED, () => {
        console.log('Rewarded ad loaded successfully');
        rewardedAd?.show();
      });

      const unsubscribeEarned = rewardedAd.addAdEventListener(RewardedAdEventType.EARNED_REWARD, (reward) => {
        console.log('User earned reward:', reward);
        cleanup();
        resolve(true); // User watched the ad and earned reward
      });

      const unsubscribeClosed = rewardedAd.addAdEventListener(AdEventType.CLOSED, () => {
        console.log('Rewarded ad closed');
        cleanup();
        resolve(false); // User closed without earning reward
      });

      const unsubscribeError = rewardedAd.addAdEventListener(AdEventType.ERROR, (error) => {
        console.error('Rewarded ad failed to load:', error);
        cleanup();
        resolve(false);
      });

      const cleanup = () => {
        unsubscribeLoaded();
        unsubscribeEarned();
        unsubscribeClosed();
        unsubscribeError();
      };

      rewardedAd.load();
    } catch (error) {
      console.error('Failed to show rewarded ad:', error);
      resolve(false);
    }
  });
};
