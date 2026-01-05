import { useTheme } from '@/contexts/ThemeContext';
import { setOnboardingComplete } from '@/utils/storage';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const { width, height } = Dimensions.get('window');

const onboardingData = [
  {
    id: '1',
    title: 'Welcome to Life Plan',
    description: 'Transform your dreams into achievable goals with our intelligent planning system.',
    icon: 'rocket',
    color: '#6366F1',
  },
  {
    id: '2',
    title: 'Set Your Timeline',
    description: 'Plan across 5, 10, 15, 20, or 25+ years. Or create your own custom timeline.',
    icon: 'calendar',
    color: '#8B5CF6',
  },
  {
    id: '3',
    title: 'Track Progress',
    description: 'Monitor your journey with beautiful stats and celebrate every milestone.',
    icon: 'trending-up',
    color: '#10B981',
  },
  {
    id: '4',
    title: 'Stay Inspired',
    description: 'Access wellness tips, articles, and guided activities to keep you motivated.',
    icon: 'heart',
    color: '#F59E0B',
  },
];

export default function OnboardingScreen() {
  const { colors } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    {
      useNativeDriver: false,
      listener: (event: any) => {
        const index = Math.round(event.nativeEvent.contentOffset.x / width);
        setCurrentIndex(index);
      },
    }
  );

  const handleNext = async () => {
    if (currentIndex < onboardingData.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      scrollRef.current?.scrollTo({ x: nextIndex * width, animated: true });
    } else {
      console.log('Onboarding: Setting complete and navigating to signup');
      try {
        await setOnboardingComplete();
        console.log('Onboarding: Complete set, waiting a moment before navigation');
        // Add small delay to ensure AsyncStorage is updated
        await new Promise(resolve => setTimeout(resolve, 100));
        console.log('Onboarding: Navigating to signup');
        router.replace('/auth/signup');
      } catch (error) {
        console.error('Onboarding: Error during navigation:', error);
        // Still try to navigate even if there's an error
        router.replace('/auth/signup');
      }
    }
  };

  const handleSkip = async () => {
    try {
      await setOnboardingComplete();
      console.log('Onboarding: Skip - Complete set, waiting a moment before navigation');
      // Add small delay to ensure AsyncStorage is updated
      await new Promise(resolve => setTimeout(resolve, 100));
      console.log('Onboarding: Skip - Navigating to signup');
      router.replace('/auth/signup');
    } catch (error) {
      console.error('Onboarding: Skip - Error during navigation:', error);
      // Still try to navigate even if there's an error
      router.replace('/auth/signup');
    }
  };

  const scrollRef = useRef<ScrollView>(null);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.skipContainer}>
        <TouchableOpacity onPress={handleSkip}>
          <Text style={[styles.skipText, { color: colors.textSecondary }]}>Skip</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {onboardingData.map((item, index) => (
          <View key={item.id} style={[styles.slide, { width }]}>
            <LinearGradient
              colors={[item.color + '20', item.color + '05']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.gradientBackground}
            />
            
            <View style={styles.iconContainer}>
              <View style={[styles.iconCircle, { backgroundColor: item.color + '15' }]}>
                <Ionicons name={item.icon as any} size={80} color={item.color} />
              </View>
            </View>

            <View style={styles.content}>
              <Text style={[styles.title, { color: colors.text }]}>{item.title}</Text>
              <Text style={[styles.description, { color: colors.textSecondary }]}>
                {item.description}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.pagination}>
          {onboardingData.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                {
                  backgroundColor: index === currentIndex ? colors.primary : colors.border,
                  width: index === currentIndex ? 24 : 8,
                },
              ]}
            />
          ))}
        </View>

        <TouchableOpacity
          style={[
            styles.nextButton,
            {
              backgroundColor: colors.primary,
              shadowColor: colors.primary,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.2,
              shadowRadius: 12,
              elevation: 4,
            },
          ]}
          onPress={handleNext}
          activeOpacity={0.85}
        >
          <Text style={styles.nextButtonText}>
            {currentIndex === onboardingData.length - 1 ? "Get Started" : "Next"}
          </Text>
          <Ionicons 
            name={currentIndex === onboardingData.length - 1 ? "checkmark" : "arrow-forward"} 
            size={20} 
            color="white" 
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  skipContainer: {
    position: 'absolute',
    top: 60,
    right: 24,
    zIndex: 1,
  },
  skipText: {
    fontSize: 16,
    fontWeight: '500',
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  gradientBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  iconContainer: {
    marginBottom: 48,
  },
  iconCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    maxWidth: 320,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  description: {
    fontSize: 17,
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: '500',
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 48,
    paddingTop: 24,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 32,
    gap: 8,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 16,
    gap: 8,
  },
  nextButtonText: {
    color: 'white',
    fontSize: 17,
    fontWeight: '600',
  },
});
