import AsyncStorage from '@react-native-async-storage/async-storage';

const REVIEW_PROMPT_KEY = '@lifeplan_review_prompt';
const GOALS_CREATED_KEY = '@lifeplan_goals_created';
const LAST_REVIEW_PROMPT_KEY = '@lifeplan_last_review_prompt';

export interface ReviewData {
  hasSeenPrompt: boolean;
  hasReviewed: boolean;
  goalsCreated: number;
  lastPromptDate?: string;
}

/**
 * Get review data from storage
 */
export const getReviewData = async (): Promise<ReviewData> => {
  try {
    const reviewPrompt = await AsyncStorage.getItem(REVIEW_PROMPT_KEY);
    const goalsCreated = await AsyncStorage.getItem(GOALS_CREATED_KEY);
    const lastPrompt = await AsyncStorage.getItem(LAST_REVIEW_PROMPT_KEY);
    
    return {
      hasSeenPrompt: reviewPrompt === 'true',
      hasReviewed: reviewPrompt === 'reviewed',
      goalsCreated: goalsCreated ? parseInt(goalsCreated, 10) : 0,
      lastPromptDate: lastPrompt || undefined,
    };
  } catch (error) {
    console.error('Error getting review data:', error);
    return {
      hasSeenPrompt: false,
      hasReviewed: false,
      goalsCreated: 0,
    };
  }
};

/**
 * Increment goals created count
 */
export const incrementGoalsCreated = async (): Promise<void> => {
  try {
    const current = await AsyncStorage.getItem(GOALS_CREATED_KEY);
    const count = current ? parseInt(current, 10) : 0;
    await AsyncStorage.setItem(GOALS_CREATED_KEY, (count + 1).toString());
    console.log('Goals created count:', count + 1);
  } catch (error) {
    console.error('Error incrementing goals created:', error);
  }
};

/**
 * Check if we should show review prompt
 */
export const shouldShowReviewPrompt = async (): Promise<boolean> => {
  try {
    const data = await getReviewData();
    
    // Don't show if already reviewed
    if (data.hasReviewed) return false;
    
    // Don't show if seen recently (wait at least 30 days)
    if (data.lastPromptDate) {
      const lastPrompt = new Date(data.lastPromptDate);
      const now = new Date();
      const daysSincePrompt = (now.getTime() - lastPrompt.getTime()) / (1000 * 60 * 60 * 24);
      if (daysSincePrompt < 30) return false;
    }
    
    // Show after creating 3+ goals
    return data.goalsCreated >= 3;
  } catch (error) {
    console.error('Error checking review prompt:', error);
    return false;
  }
};

/**
 * Mark review prompt as shown
 */
export const markReviewPromptShown = async (): Promise<void> => {
  try {
    await AsyncStorage.setItem(REVIEW_PROMPT_KEY, 'true');
    await AsyncStorage.setItem(LAST_REVIEW_PROMPT_KEY, new Date().toISOString());
    console.log('Review prompt marked as shown');
  } catch (error) {
    console.error('Error marking review prompt shown:', error);
  }
};

/**
 * Mark user as reviewed
 */
export const markUserReviewed = async (): Promise<void> => {
  try {
    await AsyncStorage.setItem(REVIEW_PROMPT_KEY, 'reviewed');
    console.log('User marked as reviewed');
  } catch (error) {
    console.error('Error marking user reviewed:', error);
  }
};

/**
 * Reset review data (for testing)
 */
export const resetReviewData = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove([
      REVIEW_PROMPT_KEY,
      GOALS_CREATED_KEY,
      LAST_REVIEW_PROMPT_KEY,
    ]);
    console.log('Review data reset');
  } catch (error) {
    console.error('Error resetting review data:', error);
  }
};
