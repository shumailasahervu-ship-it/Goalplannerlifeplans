import AdBanner from '@/components/AdBanner';
import { useTheme } from '@/contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const tips = [
  {
    id: '1',
    title: 'Break Goals into Milestones',
    description: 'Large goals are easier to achieve when split into smaller, actionable steps.',
    icon: 'list-outline',
  },
  {
    id: '2',
    title: 'Review Progress Weekly',
    description: 'Set aside time each week to review what you’ve accomplished and adjust plans.',
    icon: 'calendar-outline',
  },
  {
    id: '3',
    title: 'Stay Flexible',
    description: 'Life changes—adjust your goals as needed without guilt.',
    icon: 'refresh-outline',
  },
];

const articles = [
  {
    id: '1',
    title: 'The Science of Habit Formation',
    readTime: '5 min',
    icon: 'library-outline',
  },
  {
    id: '2',
    title: 'Building Resilience During Setbacks',
    readTime: '4 min',
    icon: 'shield-checkmark-outline',
  },
  {
    id: '3',
    title: 'Time Management for Goal-Setters',
    readTime: '6 min',
    icon: 'time-outline',
  },
];

const activities = [
  {
    id: '1',
    title: '5-Minute Visualization',
    description: 'Visualize achieving your goal to boost motivation.',
    icon: 'eye-outline',
  },
  {
    id: '2',
    title: 'Gratitude Journal',
    description: 'Write three things you’re grateful for today.',
    icon: 'heart-outline',
  },
  {
    id: '3',
    title: 'Weekly Reflection',
    description: 'Reflect on wins and lessons from the past week.',
    icon: 'journal-outline',
  },
];

export default function ExploreScreen() {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={[colors.primary, colors.secondary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Explore</Text>
        <Text style={styles.headerSubtitle}>Grow your mind, achieve your goals</Text>
      </LinearGradient>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Tips Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Tips</Text>
          {tips.map((tip) => (
            <View key={tip.id} style={[styles.card, { backgroundColor: colors.surface }]}>
              <View style={styles.cardHeader}>
                <Ionicons name={tip.icon as any} size={24} color={colors.primary} />
                <Text style={[styles.cardTitle, { color: colors.text }]}>{tip.title}</Text>
              </View>
              <Text style={[styles.cardDescription, { color: colors.textSecondary }]}>{tip.description}</Text>
            </View>
          ))}
        </View>

        {/* Articles Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Articles</Text>
          {articles.map((article) => (
            <TouchableOpacity key={article.id} style={[styles.card, { backgroundColor: colors.surface }]}>
              <View style={styles.cardHeader}>
                <Ionicons name={article.icon as any} size={24} color={colors.accent} />
                <View style={styles.articleInfo}>
                  <Text style={[styles.cardTitle, { color: colors.text }]}>{article.title}</Text>
                  <Text style={[styles.readTime, { color: colors.textSecondary }]}>{article.readTime}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Activities Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Guided Activities</Text>
          {activities.map((activity) => (
            <TouchableOpacity key={activity.id} style={[styles.card, { backgroundColor: colors.surface }]}>
              <View style={styles.cardHeader}>
                <Ionicons name={activity.icon as any} size={24} color={colors.warning} />
                <View style={styles.activityInfo}>
                  <Text style={[styles.cardTitle, { color: colors.text }]}>{activity.title}</Text>
                  <Text style={[styles.cardDescription, { color: colors.textSecondary }]}>{activity.description}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
      <AdBanner />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingTop: 60, paddingHorizontal: 24, paddingBottom: 24 },
  headerTitle: { color: 'white', fontSize: 28, fontWeight: 'bold' },
  headerSubtitle: { color: 'rgba(255,255,255,0.9)', marginTop: 4 },
  scrollView: { flex: 1 },
  content: { padding: 20 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
  card: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  cardDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  articleInfo: {
    flex: 1,
  },
  readTime: {
    fontSize: 12,
    marginTop: 2,
  },
  activityInfo: {
    flex: 1,
  },
});