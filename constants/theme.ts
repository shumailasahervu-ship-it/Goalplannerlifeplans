/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    primary: '#007AFF',
    secondary: '#5856D6',
    accent: '#FF9500',
    warning: '#FF9500',
    danger: '#FF3B30',
    success: '#34C759',
    surface: '#F2F2F7',
    border: '#C6C6C8',
    textSecondary: '#8E8E93',
    primaryLight: '#E6F4FE',
  },
  premium: {
    text: '#1a1a1a',
    background: '#FEFEFE',
    tint: '#6366F1',
    icon: '#6B7280',
    tabIconDefault: '#9CA3AF',
    tabIconSelected: '#6366F1',
    primary: '#6366F1',
    secondary: '#8B5CF6',
    accent: '#F59E0B',
    warning: '#F59E0B',
    danger: '#EF4444',
    success: '#10B981',
    surface: '#F9FAFB',
    border: '#E5E7EB',
    textSecondary: '#6B7280',
    primaryLight: '#EEF2FF',
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    primary: '#0A84FF',
    secondary: '#5E5CE6',
    accent: '#FF9F0A',
    warning: '#FF9F0A',
    danger: '#FF453A',
    success: '#32D74B',
    surface: '#2C2C2E',
    border: '#48484A',
    textSecondary: '#98989D',
    primaryLight: '#1C3A5A',
  },
};

export const TimelineColors = {
  '1-3': '#007AFF',
  '3-5': '#5856D6', 
  '5-10': '#34C759',
  '10+': '#FF9500',
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
