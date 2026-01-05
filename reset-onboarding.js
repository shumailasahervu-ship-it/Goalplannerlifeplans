import { resetOnboarding } from '@/utils/storage';

// Run this in your app's development console or create a temporary debug component
resetOnboarding().then(() => {
  console.log('Onboarding reset - restart the app to see onboarding screen');
});
