import { getBannerAdUnitId } from '@/constants/admob';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';

export const AdBanner: React.FC = () => {
  const unitId = getBannerAdUnitId();
  const [adError, setAdError] = useState<string | null>(null);
  const [adLoaded, setAdLoaded] = useState(false);
  
  console.log('🔔 LIFEPLAN: AdBanner rendering with unit ID:', unitId);
  console.log('🔔 LIFEPLAN: Is development mode:', __DEV__);
  
  // Set a timeout to show error if ad doesn't load
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!adLoaded && !adError) {
        console.log('🔔 LIFEPLAN: ⏰ Ad loading timeout (10 seconds)');
        setAdError('Ad loading timeout - please check network connection');
      }
    }, 10000);
    
    return () => clearTimeout(timeout);
  }, [adLoaded, adError]);

  return (
    <View style={styles.container}>
      <BannerAd
        unitId={unitId}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        onAdLoaded={() => {
          console.log('🔔 LIFEPLAN: ✅ Banner ad loaded successfully');
          setAdError(null);
          setAdLoaded(true);
        }}
        onAdFailedToLoad={(error) => {
          console.error('🔔 LIFEPLAN: ❌ Banner ad failed to load:', error);
          console.error('🔔 LIFEPLAN: ❌ Ad error:', JSON.stringify(error, null, 2));
          setAdError(error.message);
        }}
        onAdOpened={() => {
          console.log('🔔 LIFEPLAN: 📱 Banner ad opened');
        }}
        onAdClosed={() => {
          console.log('🔔 LIFEPLAN: 📱 Banner ad closed');
        }}
      />
      {__DEV__ && adError && (
        <Text style={styles.errorText}>Ad Error: {adError}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  errorText: {
    fontSize: 10,
    color: 'red',
    textAlign: 'center',
  },
});

export default AdBanner;
