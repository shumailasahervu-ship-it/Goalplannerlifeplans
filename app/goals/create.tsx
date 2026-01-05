import ReviewPrompt from '@/components/ReviewPrompt';
import { useAuth } from '@/contexts/AuthContext';
import { useSnackbar } from '@/contexts/SnackbarContext';
import { useTheme } from '@/contexts/ThemeContext';
import { createGoal } from '@/services/firestore';
import { showInterstitialAd } from '@/utils/ads';
import { incrementGoalsCreated, shouldShowReviewPrompt } from '@/utils/review';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Timestamp } from 'firebase/firestore';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
 

// We no longer use fixed 5/10/15/20/25 year timelines; goals now have
// explicit start and end dates.

const priorityOptions = [
  { value: 'low', label: 'Low', color: '#10B981' },
  { value: 'medium', label: 'Medium', color: '#F59E0B' },
  { value: 'high', label: 'High', color: '#EF4444' },
];

export default function CreateGoalScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { colors } = useTheme();
  const { user } = useAuth();
  const { showSnackbar } = useSnackbar();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [startDate, setStartDate] = useState(''); // YYYY-MM-DD
  const [endDate, setEndDate] = useState('');     // YYYY-MM-DD
  const [selectedPriority, setSelectedPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [loading, setLoading] = useState(false);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [showReviewPrompt, setShowReviewPrompt] = useState(false);


  const parseDate = (value: string): Date | null => {
    const [yearStr, monthStr, dayStr] = value.split('-');
    const year = Number(yearStr);
    const month = Number(monthStr);
    const day = Number(dayStr);
    if (!year || !month || !day) return null;
    const d = new Date(year, month - 1, day);
    if (d.getFullYear() !== year || d.getMonth() !== month - 1 || d.getDate() !== day) {
      return null;
    }
    return d;
  };

  const handleCreateGoal = async () => {
    if (loading) return;
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a goal title');
      return;
    }

    if (!user) {
      Alert.alert('Error', 'You must be logged in to create goals');
      return;
    }

    if (!startDate.trim() || !endDate.trim()) {
      Alert.alert('Error', 'Please enter both a start date and an end date');
      return;
    }

    const start = parseDate(startDate.trim());
    const end = parseDate(endDate.trim());
    if (!start || !end) {
      Alert.alert('Error', 'Dates must be in the format YYYY-MM-DD');
      return;
    }
    if (end < start) {
      Alert.alert('Error', 'End date cannot be before start date');
      return;
    }

    setLoading(true);
    try {
      await createGoal(user.uid, {
        title: title.trim(),
        description: description.trim(),
        category: category.trim() || 'General',
        startDate: Timestamp.fromDate(start),
        endDate: Timestamp.fromDate(end),
        priority: selectedPriority,
        status: 'not-started',
        progress: 0,
      });

      // Increment goals created counter
      await incrementGoalsCreated();
      
      // Check if we should show review prompt
      const shouldShow = await shouldShowReviewPrompt();
      if (shouldShow) {
        setShowReviewPrompt(true);
      }

      showSnackbar('Goal created successfully!', 'success');
      // Navigate first, then show interstitial ad (non-blocking)
      router.replace('/(tabs)');
      showInterstitialAd().catch(console.error);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const timelineColor = colors.primary;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={[timelineColor, colors.primary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => router.canGoBack() ? router.back() : router.push('/(tabs)')} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Create New Goal</Text>
          <View style={{ width: 40 }} />
        </View>
      </LinearGradient>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={[styles.label, { color: colors.text }]}>Goal Title *</Text>
          <TextInput
            style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.surface }]}
            placeholder="E.g., Start my own business"
            placeholderTextColor={colors.textSecondary}
            value={title}
            onChangeText={setTitle}
          />
        </View>

        <View style={styles.section}>
          <Text style={[styles.label, { color: colors.text }]}>Description</Text>
          <TextInput
            style={[styles.textArea, { color: colors.text, borderColor: colors.border, backgroundColor: colors.surface }]}
            placeholder="Describe your goal in detail..."
            placeholderTextColor={colors.textSecondary}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.section}>
          <Text style={[styles.label, { color: colors.text }]}>Category</Text>
          <TextInput
            style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.surface }]}
            placeholder="E.g., Career, Health, Finance"
            placeholderTextColor={colors.textSecondary}
            value={category}
            onChangeText={setCategory}
          />
        </View>

        <View style={styles.section}>
          <Text style={[styles.label, { color: colors.text }]}>Timeline</Text>
          <Text style={[styles.helperText, { color: colors.textSecondary }]}>Set a start and end date for this goal (YYYY-MM-DD).</Text>
          <View style={{ flexDirection: 'row', gap: 12, marginTop: 8 }}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.label, { color: colors.text, fontSize: 12 }]}>Start Date</Text>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setShowStartPicker(true)}
              >
                <View style={[styles.input, { justifyContent: 'center', borderColor: colors.border, backgroundColor: colors.surface }]}
                >
                  <Text style={{ color: startDate ? colors.text : colors.textSecondary }}>
                    {startDate || '2025-01-01'}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.label, { color: colors.text, fontSize: 12 }]}>End Date</Text>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setShowEndPicker(true)}
              >
                <View style={[styles.input, { justifyContent: 'center', borderColor: colors.border, backgroundColor: colors.surface }]}
                >
                  <Text style={{ color: endDate ? colors.text : colors.textSecondary }}>
                    {endDate || '2025-12-31'}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.label, { color: colors.text }]}>Priority</Text>
          <View style={styles.priorityContainer}>
            {priorityOptions.map((option) => {
              const isSelected = selectedPriority === option.value;
              return (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.priorityOption,
                    { 
                      backgroundColor: isSelected ? option.color + '20' : colors.surface,
                      borderColor: isSelected ? option.color : colors.border,
                    }
                  ]}
                  onPress={() => setSelectedPriority(option.value as any)}
                >
                  <Text style={[
                    styles.priorityLabel,
                    { color: isSelected ? option.color : colors.text }
                  ]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.createButton, { backgroundColor: timelineColor }]}
            onPress={handleCreateGoal}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <>
                <Ionicons name="checkmark-circle" size={24} color="white" />
                <Text style={styles.createButtonText}>Create Goal</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {showStartPicker && (
        <DateTimePicker
          value={parseDate(startDate) || new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event: DateTimePickerEvent, selected?: Date) => {
            if (Platform.OS !== 'ios') setShowStartPicker(false);
            if (!selected) return;
            const iso = selected.toISOString().slice(0, 10);
            setStartDate(iso);
          }}
        />
      )}

      {showEndPicker && (
        <DateTimePicker
          value={parseDate(endDate) || new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event: DateTimePickerEvent, selected?: Date) => {
            if (Platform.OS !== 'ios') setShowEndPicker(false);
            if (!selected) return;
            const iso = selected.toISOString().slice(0, 10);
            setEndDate(iso);
          }}
        />
      )}
      
      <ReviewPrompt
        visible={showReviewPrompt}
        onClose={() => setShowReviewPrompt(false)}
      />
      
      <ReviewDebug />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 20,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  helperText: {
    fontSize: 12,
    marginTop: 2,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    minHeight: 100,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  timelineOption: {
    flex: 1,
    minWidth: '45%',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    gap: 8,
  },
  optionLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  priorityContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  priorityOption: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
  },
  priorityLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  buttonContainer: {
    paddingHorizontal: 20,
    marginTop: 32,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    borderRadius: 16,
    gap: 8,
  },
  createButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  customInputContainer: {
    marginTop: 16,
  },
  customLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  customInput: {
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 16,
  },
});

const categories = [
  { id: 'personal', label: 'Personal', icon: 'person-outline' },
  { id: 'career', label: 'Career', icon: 'briefcase-outline' },
  { id: 'health', label: 'Health', icon: 'heart-outline' },
  { id: 'learning', label: 'Learning', icon: 'book-outline' },
];

const timelines = [
  { id: '1-3', label: '1-3 months' },
  { id: '3-5', label: '3-5 months' },
  { id: '5-10', label: '5-10 months' },
  { id: '10+', label: '10+ months' },
];

const priorities = [
  { id: 'low', label: 'Low', color: '#34C759' },
  { id: 'medium', label: 'Medium', color: '#FF9500' },
  { id: 'high', label: 'High', color: '#FF3B30' },
];
