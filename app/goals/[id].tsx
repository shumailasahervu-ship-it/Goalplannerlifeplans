import AdBanner from '@/components/AdBanner';
import { Colors } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { deleteGoal, getGoal, Goal, updateGoalProgress } from '@/services/firestore';
import { showInterstitialAd } from '@/utils/ads';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity, useColorScheme, View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// removed react-native-reanimated to avoid native crashes in Expo Go
 
 
export default function GoalDetailScreen() {
  const colorScheme = useColorScheme() as keyof typeof Colors;
  const colors = Colors[colorScheme] || Colors.light;
  const router = useRouter();
  const { user } = useAuth();
  const { id } = useLocalSearchParams<{ id: string }>();
  if (!id) {
    router.back();
    return null;
  }
  
  const [goal, setGoal] = useState<Goal | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGoal();
    // Show interstitial ad when goal detail page is opened (non-blocking)
    showInterstitialAd().catch(console.error);
  }, [id]);

  const loadGoal = async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      const goalData = await getGoal(id);
      setGoal(goalData);
    } catch (error) {
      Alert.alert('Error', 'Failed to load goal');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProgress = async (newProgress: number) => {
    if (!id || !goal) return;
    
    try {
      await updateGoalProgress(id, newProgress);
      setGoal({ ...goal, progress: newProgress });
      Alert.alert('Success', 'Progress updated!');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Goal',
      'Are you sure you want to delete this goal? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            if (!id || !user) return;
            try {
              await deleteGoal(id, user.uid);
              // Navigate first, then show interstitial ad (non-blocking)
              router.replace('/(tabs)');
              showInterstitialAd().catch(console.error);
            } catch (error: any) {
              Alert.alert('Error', error.message);
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!goal) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={[styles.errorText, { color: colors.text }]}>Goal not found</Text>
        <TouchableOpacity onPress={() => router.replace('/(tabs)')} style={[styles.button, { backgroundColor: colors.primary }]}>
          <Text style={styles.buttonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const timelineColor = colors.primary;

  const priorityColors: Record<string, string> = {
    low: colors.accent,
    medium: colors.warning,
    high: colors.danger,
  };

  const statusInfo: Record<string, { label: string; color: string; icon: any }> = {
    'not-started': { label: 'Not Started', color: colors.textSecondary, icon: 'ellipse-outline' as const },
    'in-progress': { label: 'In Progress', color: colors.warning, icon: 'hourglass-outline' as const },
    'completed': { label: 'Completed', color: colors.accent, icon: 'checkmark-circle' as const },
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.primary }}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      <SafeAreaView style={{ backgroundColor: colors.primary }} edges={['top']} />
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <LinearGradient
          colors={[timelineColor, colors.primary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => router.replace('/(tabs)')} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
            <Ionicons name="trash-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>
        <View style={styles.headerContent}>
          <Text style={styles.headerCategory}>{goal.category}</Text>
          <Text style={styles.headerTitle}>{goal.title}</Text>
          <View style={styles.headerBadges}>
            <View style={styles.badge}>
              <Ionicons name="calendar-outline" size={16} color="white" />
              <Text style={styles.badgeText}>{goal.timelineYears} Years</Text>
            </View>
            <View style={[styles.badge, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
              <Ionicons name={statusInfo[goal.status].icon} size={16} color="white" />
              <Text style={styles.badgeText}>{statusInfo[goal.status].label}</Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Progress</Text>
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${goal.progress}%`, backgroundColor: timelineColor }]} />
            </View>
            <Text style={[styles.progressText, { color: colors.text }]}>{goal.progress}%</Text>
          </View>
          <View style={styles.progressButtons}>
            {[0, 25, 50, 75, 100].map((value) => (
              <TouchableOpacity
                key={value}
                style={[
                  styles.progressButton,
                  { 
                    backgroundColor: goal.progress === value ? timelineColor : colors.surface,
                    borderColor: colors.border,
                  }
                ]}
                onPress={() => handleUpdateProgress(value)}
              >
                <Text style={[
                  styles.progressButtonText,
                  { color: goal.progress === value ? 'white' : colors.text }
                ]}>
                  {value}%
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {goal.description ? (
          <View style={[styles.card, { backgroundColor: colors.surface }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Description</Text>
            <Text style={[styles.description, { color: colors.textSecondary }]}>{goal.description}</Text>
          </View>
        ) : null}

        <View style={[styles.card, { backgroundColor: colors.surface }]}> 
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Details</Text>
          <View style={styles.detailRow}>
            <Ionicons name="flag" size={20} color={priorityColors[goal.priority]} />
            <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Priority:</Text>
            <Text style={[styles.detailValue, { color: colors.text }]}>
              {goal.priority.charAt(0).toUpperCase() + goal.priority.slice(1)}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="time-outline" size={20} color={colors.icon} />
            <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Created:</Text>
            <Text style={[styles.detailValue, { color: colors.text }]}> 
              {goal.createdAt.toDate().toLocaleDateString()}
            </Text>
          </View>
        </View>

        <View style={{ height: 40 }} />
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
    paddingTop: 10,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContent: {
    gap: 8,
  },
  headerCategory: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },
  headerBadges: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    gap: 4,
  },
  badgeText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  card: {
    marginHorizontal: 20,
    marginTop: 16,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 16,
    fontWeight: 'bold',
    minWidth: 45,
  },
  progressButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  progressButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
  },
  progressButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  detailLabel: {
    fontSize: 14,
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  errorText: {
    fontSize: 18,
    marginBottom: 20,
  },
  button: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
