import AdBanner from '@/components/AdBanner';
import { avatarOptions } from '@/components/AvatarSelector';
import { useAuth } from '@/contexts/AuthContext';
import { useSnackbar } from '@/contexts/SnackbarContext';
import { useTheme } from '@/contexts/ThemeContext';
import { getUserGoals } from '@/services/firestore';
import { showRewardedAd } from '@/utils/ads';
import { testATTRequest } from '@/utils/test-att';
import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const { colors, theme, toggleTheme } = useTheme();
  const { user, userProfile } = useAuth();
  const { showSnackbar } = useSnackbar();
  
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [totalGoals, setTotalGoals] = useState(0);
  const [completedGoals, setCompletedGoals] = useState(0);
  const [inProgressGoals, setInProgressGoals] = useState(0);

  const handleWatchMotivationAd = async () => {
    const rewarded = await showRewardedAd();
    if (rewarded) {
      showSnackbar("Great job investing in your growth! Here's to even stronger goals. 🎯", 'success');
    } else {
      showSnackbar('Watch the full ad to get your motivation boost!', 'info');
    }
  };

  const loadGoals = async () => {
    if (!user) {
      router.replace('/auth/login');
      return;
    }

    try {
      const allGoals = await getUserGoals(user.uid);

      let completed = 0;
      allGoals.forEach((goal) => {
        if (goal.status === 'completed') completed++;
      });

      setTotalGoals(allGoals.length);
      setCompletedGoals(completed);
      // Show active goals (not completed) to better reflect workload
      setInProgressGoals(Math.max(0, allGoals.length - completed));
    } catch (error) {
      console.error('Error loading goals:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadGoals();
    }, [user])
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadGoals();
  };

  if (!user) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={[styles.errorText, { color: colors.text }]}>Please log in to view your goals</Text>
        <TouchableOpacity 
          style={[styles.loginButton, { backgroundColor: colors.primary }]}
          onPress={() => router.push('/auth/login')}
        >
          <Text style={styles.loginButtonText}>Log In</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.primary }}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      <SafeAreaView style={{ backgroundColor: colors.primary }} edges={['top']} />
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        {/* Premium Header with Gradient */}
        <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <View style={styles.appLogoRow}>
          <View style={styles.appLogoMark}>
            <Ionicons name="planet-outline" size={18} color="white" />
          </View>
          <Text style={styles.appLogoText}>Life Plan</Text>
        </View>
        <View style={styles.headerTop}>
          <View style={styles.headerLeft}>
            <View style={styles.avatarCircle}>
              <Ionicons 
                name={avatarOptions.find(a => a.id === userProfile?.avatar)?.icon as any} 
                size={24} 
                color={avatarOptions.find(a => a.id === userProfile?.avatar)?.color || 'white'} 
              />
            </View>
            <View>
              <Text style={styles.headerSubtitle}>Welcome back, {userProfile?.displayName || 'User'}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.themeButton} onPress={toggleTheme}>
            <Ionicons 
              name={theme === 'dark' ? 'moon' : theme === 'premium' ? 'sunny' : 'contrast'} 
              size={28} 
              color="white" 
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.headerDescription}>
          Your journey to success starts here
        </Text>
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Premium Stats Section */}
        <View style={styles.statsSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Your Progress</Text>
          <View style={styles.statsContainer}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={[styles.statCard, { backgroundColor: colors.surface }]}
              onPress={() => router.push('/goals?status=completed')}
            >
              <View style={[styles.statIconContainer, { backgroundColor: colors.success + '20' }]}>
                <Ionicons name="checkmark-circle" size={22} color={colors.success} />
              </View>
              <Text style={[styles.statNumber, { color: colors.text }]}>{completedGoals}</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Completed</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              style={[styles.statCard, { backgroundColor: colors.surface }]}
              onPress={() => router.push('/goals?status=active')}
            >
              <View style={[styles.statIconContainer, { backgroundColor: colors.warning + '20' }]}>
                <Ionicons name="time" size={22} color={colors.warning} />
              </View>
              <Text style={[styles.statNumber, { color: colors.text }]}>{inProgressGoals}</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Active</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              style={[styles.statCard, { backgroundColor: colors.surface }]}
              onPress={() => router.push('/goals?status=active')}
            >
              <View style={[styles.statIconContainer, { backgroundColor: colors.primary + '20' }]}> 
                <Ionicons name="flame" size={22} color={colors.primary} />
              </View>
              <Text style={[styles.statNumber, { color: colors.text }]}>{userProfile?.stats?.currentStreak ?? 0}</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Day Streak</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Date Filter Entry Point */}
        <View style={styles.dateFilterSection}>
          <View style={styles.dateFilterHeaderRow}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Plan by Dates</Text>
            <Ionicons name="calendar-outline" size={20} color={colors.textSecondary} />
          </View>
          <Text style={[styles.sectionDescription, { color: colors.textSecondary }]}>View your goals within a custom date range.</Text>
          <TouchableOpacity
            style={[styles.dateFilterButton, { borderColor: colors.primary }]}
            activeOpacity={0.85}
            onPress={() => router.push('/goals')}
          >
            <Ionicons name="funnel-outline" size={18} color={colors.primary} />
            <Text style={[styles.dateFilterButtonText, { color: colors.primary }]}>Open Date Range Filter</Text>
          </TouchableOpacity>
        </View>

        {/* Premium Action Button */}
        <View style={styles.actionContainer}>
          <TouchableOpacity 
            style={[
              styles.actionButton,
              { 
                backgroundColor: colors.primary,
                shadowColor: colors.primary,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 12,
                elevation: 4,
              }
            ]}
            activeOpacity={0.85}
            onPress={() => router.push('/goals/create')}
          >
            <View style={styles.actionButtonContent}>
              <Ionicons name="add-circle" size={22} color="white" />
              <Text style={styles.actionButtonText}>Create New Goal</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Motivation button directly under Create New Goal */}
        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={[
              styles.actionButton,
              {
                backgroundColor: colors.surface,
              },
            ]}
            activeOpacity={0.85}
            onPress={handleWatchMotivationAd}
          >
            <View style={styles.actionButtonContent}>
              <Ionicons name="sparkles-outline" size={22} color={colors.primary} />
              <Text style={[styles.actionButtonText, { color: colors.primary }]}>Watch a short ad for motivation</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Debug ATT Test Button - Development Only */}
        {__DEV__ && (
          <View style={styles.actionContainer}>
            <TouchableOpacity
              style={[
                styles.actionButton,
                {
                  backgroundColor: '#FF6B6B',
                },
              ]}
              activeOpacity={0.85}
              onPress={async () => {
                console.log('Debug: Testing ATT permission...');
                await testATTRequest();
                showSnackbar('ATT permission test initiated. Check console for details.', 'info');
              }}
            >
              <View style={styles.actionButtonContent}>
                <Ionicons name="bug-outline" size={22} color="white" />
                <Text style={styles.actionButtonText}>Debug: Test ATT Permission</Text>
              </View>
            </TouchableOpacity>
          </View>
        )}

        {/* Bottom Padding */}
        <View style={{ height: 80 }} />
      </ScrollView>
      <AdBanner />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 64,
    paddingHorizontal: 28,
    paddingBottom: 32,
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
  },
  appLogoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  appLogoMark: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  appLogoText: {
    fontSize: 16,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.95)',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.85)',
    fontWeight: '500',
    letterSpacing: 0.3,
    textAlign: 'left',
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: '800',
    color: 'white',
    letterSpacing: -0.5,
    textAlign: 'left',
  },
  headerDescription: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
    letterSpacing: 0.2,
    lineHeight: 22,
  },
  themeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  statsSection: {
    marginBottom: 32,
  },
  dateFilterSection: {
    marginBottom: 32,
    paddingHorizontal: 4,
    gap: 8,
  },
  dateFilterHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateFilterButton: {
    marginTop: 12,
    borderWidth: 1,
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dateFilterButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  sectionDescription: {
    fontSize: 15,
    lineHeight: 21,
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  statCard: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignItems: 'center',
  },
  statIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  timelineSection: {
    marginBottom: 32,
  },
  timelineGrid: {
    gap: 12,
  },
  timelineCard: {
    borderRadius: 20,
    padding: 4,
  },
  timelineCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 16,
  },
  timelineIconContainer: {
    width: 52,
    height: 52,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  timelineInfo: {
    flex: 1,
  },
  timelineTitle: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 2,
  },
  timelineSubtitle: {
    fontSize: 14,
    fontWeight: '500',
  },
  actionContainer: {
    marginTop: 8,
    marginBottom: 24,
  },
  actionButton: {
    borderRadius: 18,
    paddingVertical: 4,
  },
  actionButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 24,
    gap: 10,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 17,
    fontWeight: '600',
  },
  errorText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  loginButton: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
