import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = '@lifeplan_review_data';

export interface ReviewData {
  goalsCreated: number;
  hasReviewed: boolean;
  promptShownAt?: number | null;
}

const defaultData = (): ReviewData => ({
  goalsCreated: 0,
  hasReviewed: false,
  promptShownAt: null,
});

export const getReviewData = async (): Promise<ReviewData> => {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return defaultData();
    const parsed = JSON.parse(raw);
    return {
      ...defaultData(),
      ...parsed,
    };
  } catch {
    return defaultData();
  }
};

const setReviewData = async (data: ReviewData): Promise<void> => {
  await AsyncStorage.setItem(KEY, JSON.stringify(data));
};

export const incrementGoalsCreated = async (): Promise<void> => {
  const d = await getReviewData();
  await setReviewData({ ...d, goalsCreated: (d.goalsCreated || 0) + 1 });
};

export const markReviewPromptShown = async (): Promise<void> => {
  const d = await getReviewData();
  await setReviewData({ ...d, promptShownAt: Date.now() });
};

export const markUserReviewed = async (): Promise<void> => {
  const d = await getReviewData();
  await setReviewData({ ...d, hasReviewed: true, promptShownAt: Date.now() });
};

export const shouldShowReviewPrompt = async (): Promise<boolean> => {
  const d = await getReviewData();
  if (d.hasReviewed) return false;
  // Basic heuristic: show after 3 created goals, but only once per 7 days.
  if ((d.goalsCreated || 0) < 3) return false;
  const last = d.promptShownAt || 0;
  const weekMs = 7 * 24 * 60 * 60 * 1000;
  if (last && Date.now() - last < weekMs) return false;
  return true;
};

export const resetReviewData = async (): Promise<void> => {
  await AsyncStorage.removeItem(KEY);
};
