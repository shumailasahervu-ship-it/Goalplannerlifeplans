import AdBanner from '@/components/AdBanner';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { getGoalsByTimeline, getUserGoals, Goal } from '@/services/firestore';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Platform,
    RefreshControl,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export const options = {
  headerShown: false,
};

export default function GoalsListScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { user } = useAuth();
  const params = useLocalSearchParams<{ timeline?: string; status?: string }>();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [allGoals, setAllGoals] = useState<Goal[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [filterStart, setFilterStart] = useState(''); // YYYY-MM-DD
  const [filterEnd, setFilterEnd] = useState('');     // YYYY-MM-DD
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const parseDate = (value: string): Date | null => {
    const [yearStr, monthStr, dayStr] = value.split('-');
    const year = Number(yearStr);
    const month = Number(monthStr);
    const day = Number(dayStr);
    if (!year || !month || !day) return null;
    const d = new Date(year, month - 1, day);
    if (d.getFullYear() !== year || d.getMonth() !== month - 1 || d.getDate() !== day) return null;
    return d;
  };

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      let list: Goal[];
      if (params.timeline) {
        const years = Number(params.timeline);
        list = await getGoalsByTimeline(user.uid, years);
      } else {
        list = await getUserGoals(user.uid);
      }

      // Apply optional status filter from query params
      if (params.status === 'completed') {
        list = list.filter((g) => g.status === 'completed');
      } else if (params.status === 'active') {
        list = list.filter((g) => g.status !== 'completed');
      }

      setAllGoals(list);
      setGoals(list);
    } catch (e) {
      console.error('Failed to load goals list', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user, params.timeline]);

  React.useEffect(() => {
    load();
  }, [load]);

  const onRefresh = () => {
    setRefreshing(true);
    load();
  };

  const handleApplyDateFilter = () => {
    if (!filterStart && !filterEnd) {
      setGoals(allGoals);
      return;
    }

    const start = filterStart ? parseDate(filterStart.trim()) : null;
    const end = filterEnd ? parseDate(filterEnd.trim()) : null;

    if (filterStart && !start) {
      Alert.alert('Invalid Date', 'Start date must be in the format YYYY-MM-DD');
      return;
    }
    if (filterEnd && !end) {
      Alert.alert('Invalid Date', 'End date must be in the format YYYY-MM-DD');
      return;
    }

    const filtered = allGoals.filter((g) => {
      if (!g.startDate || !g.endDate) return false;
      const gStart = g.startDate.toDate();
      const gEnd = g.endDate.toDate();
      if (start && gEnd < start) return false;
      if (end && gStart > end) return false;
      return true;
    });

    setGoals(filtered);
  };

  const renderItem = ({ item }: { item: Goal }) => {
    let daysText = '';
    if (item.startDate && item.endDate) {
      const start = item.startDate.toDate();
      const end = item.endDate.toDate();
      const diffMs = end.getTime() - start.getTime();
      const diffDays = Math.max(0, Math.round(diffMs / (1000 * 60 * 60 * 24)));
      daysText = `${diffDays} day${diffDays === 1 ? '' : 's'}`;
    } else if (item.timelineYears) {
      const approxDays = item.timelineYears * 365;
      daysText = `${approxDays} days`;
    }

    const durationLabel = daysText || 'Duration N/A';

    return (
      <TouchableOpacity
        style={[styles.item, { backgroundColor: colors.surface }]}
        activeOpacity={0.75}
        onPress={() => router.push(`/goals/${item.id}`)}
      >
        <View style={styles.itemLeft}>
          <View style={[styles.itemIcon, { backgroundColor: colors.primary + '1A' }]}>
            <Ionicons name="flag-outline" size={18} color={colors.primary} />
          </View>
          <View style={styles.itemBody}>
            <Text style={[styles.itemTitle, { color: colors.text }]} numberOfLines={1}>
              {item.title}
            </Text>
            <Text style={[styles.itemSubtitle, { color: colors.textSecondary }]} numberOfLines={1}>
              {item.category || 'General'} • {durationLabel} • {item.status.replace('-', ' ')} • {item.progress}%
            </Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={18} color={colors.icon} />
      </TouchableOpacity>
    );
  };

  let headerTitle = 'All Goals';
  if (params.timeline) {
    headerTitle = `${params.timeline} Year Goals`;
  }
  if (params.status === 'completed') {
    headerTitle = `Completed ${headerTitle}`;
  } else if (params.status === 'active') {
    headerTitle = `Active ${headerTitle}`;
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
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <TouchableOpacity onPress={() => (router.canGoBack() ? router.back() : router.push('/(tabs)'))} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{headerTitle}</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.filterContainer}>
        <View style={styles.filterRow}>
          <View style={styles.filterField}>
            <Text style={[styles.filterLabel, { color: colors.textSecondary }]}>Start Date</Text>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setShowStartPicker(true)}
            >
              <View style={[styles.filterInput, { borderColor: colors.border, justifyContent: 'center' }]}
              >
                <Text style={{ color: filterStart ? colors.text : colors.textSecondary }}>
                  {filterStart || 'YYYY-MM-DD'}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.filterField}>
            <Text style={[styles.filterLabel, { color: colors.textSecondary }]}>End Date</Text>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setShowEndPicker(true)}
            >
              <View style={[styles.filterInput, { borderColor: colors.border, justifyContent: 'center' }]}
              >
                <Text style={{ color: filterEnd ? colors.text : colors.textSecondary }}>
                  {filterEnd || 'YYYY-MM-DD'}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.filterButtonsRow}>
          <TouchableOpacity style={[styles.filterButton, { borderColor: colors.border }]} onPress={() => { setFilterStart(''); setFilterEnd(''); setGoals(allGoals); }}>
            <Text style={[styles.filterButtonText, { color: colors.textSecondary }]}>Clear</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.filterButton, { backgroundColor: colors.primary, borderColor: colors.primary }]} onPress={handleApplyDateFilter}>
            <Text style={[styles.filterButtonText, { color: 'white' }]}>Apply</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        contentContainerStyle={styles.listContent}
        data={goals}
        keyExtractor={(g) => g.id}
        renderItem={renderItem}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="documents-outline" size={28} color={colors.icon} />
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No goals found</Text>
          </View>
        }
      />

      {showStartPicker && (
        <DateTimePicker
          value={filterStart ? parseDate(filterStart) || new Date() : new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event: DateTimePickerEvent, selected?: Date) => {
            if (Platform.OS !== 'ios') setShowStartPicker(false);
            if (!selected) return;
            const iso = selected.toISOString().slice(0, 10);
            setFilterStart(iso);
          }}
        />
      )}

      {showEndPicker && (
        <DateTimePicker
          value={filterEnd ? parseDate(filterEnd) || new Date() : new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event: DateTimePickerEvent, selected?: Date) => {
            if (Platform.OS !== 'ios') setShowEndPicker(false);
            if (!selected) return;
            const iso = selected.toISOString().slice(0, 10);
            setFilterEnd(iso);
          }}
        />
      )}
      <AdBanner />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingTop: 10,
    paddingBottom: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { color: 'white', fontSize: 18, fontWeight: '700' },
  listContent: { padding: 16 },
  filterContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 4,
    gap: 8,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 12,
  },
  filterField: {
    flex: 1,
  },
  filterLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  filterInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    fontSize: 14,
  },
  filterButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  filterButton: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  filterButtonText: {
    fontSize: 13,
    fontWeight: '600',
  },
  item: {
    padding: 14,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  itemLeft: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  itemIcon: { width: 32, height: 32, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  itemBody: { flex: 1 },
  itemTitle: { fontSize: 16, fontWeight: '600' },
  itemSubtitle: { fontSize: 13, marginTop: 2 },
  empty: { alignItems: 'center', marginTop: 40, gap: 8 },
  emptyText: { fontSize: 14 },
});
