import { getTrackingPermissionsAsync, requestTrackingPermissionsAsync } from 'expo-tracking-transparency';
import { Platform } from 'react-native';

/**
 * Test function to manually request ATT permission
 * This can be called from a debug screen or console
 */
export const testATTRequest = async (): Promise<void> => {
  if (Platform.OS !== 'ios') {
    console.log('ATT: Not an iOS device');
    return;
  }

  try {
    // First check current status
    const { status } = await getTrackingPermissionsAsync();
    console.log('ATT Test: Current status before request:', status);

    // Always request to show the dialog (only if undetermined)
    if (status === 'undetermined') {
      console.log('ATT Test: Requesting permission...');
      const { status: newStatus } = await requestTrackingPermissionsAsync();
      console.log('ATT Test: Status after request:', newStatus);
    } else {
      console.log('ATT Test: Permission already determined:', status);
      console.log('ATT Test: To reset, go to Settings > Privacy & Security > Tracking');
    }
  } catch (error) {
    console.error('ATT Test: Error:', error);
  }
};

// Make it available globally in development
if (__DEV__) {
  (global as any).testATT = testATTRequest;
}
