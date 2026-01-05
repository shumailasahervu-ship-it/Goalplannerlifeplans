import { useTheme } from '@/contexts/ThemeContext';
import { markReviewPromptShown, markUserReviewed } from '@/utils/review';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
    Alert,
    Linking,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface ReviewPromptProps {
  visible: boolean;
  onClose: () => void;
}

export default function ReviewPrompt({ visible, onClose }: ReviewPromptProps) {
  const { colors } = useTheme();
  const [selectedStars, setSelectedStars] = useState(0);

  const handleStarPress = (rating: number) => {
    setSelectedStars(rating);
  };

  const handleRateApp = async () => {
    if (selectedStars === 0) {
      Alert.alert('Please select a rating');
      return;
    }

    try {
      // Mark as reviewed
      await markUserReviewed();
      
      // If rating is 4+ stars, direct to App Store
      if (selectedStars >= 4) {
        const appStoreUrl = 'https://apps.apple.com/app/id6448311069?action=write-review';
        await Linking.openURL(appStoreUrl);
      }
      
      onClose();
    } catch (error) {
      console.error('Error handling rate app:', error);
      // Still close the modal even if there's an error
      onClose();
    }
  };

  const handleMaybeLater = async () => {
    await markReviewPromptShown();
    onClose();
  };

  const handleNoThanks = async () => {
    await markReviewPromptShown();
    onClose();
  };

  const StarButton = ({ filled, onPress }: { filled: boolean; onPress: () => void }) => (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <Ionicons
        name={filled ? 'star' : 'star-outline'}
        size={40}
        color={filled ? '#FFD700' : colors.border}
      />
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.container, { backgroundColor: colors.surface }]}>
          {/* Header */}
          <LinearGradient
            colors={[colors.primary, colors.primary + '80']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.header}
          >
            <Ionicons name="heart" size={40} color="white" />
            <Text style={styles.title}>Does LifePlans help you feel clearer about your goals?</Text>
          </LinearGradient>

          {/* Content */}
          <View style={styles.content}>
            <Text style={[styles.message, { color: colors.text }]}>
              Your feedback helps us improve and create better features for you!
            </Text>

            {/* Stars */}
            <View style={styles.starsContainer}>
              <Text style={[styles.starsLabel, { color: colors.text }]}>
                How would you rate your experience?
              </Text>
              <View style={styles.starsRow}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <StarButton
                    key={star}
                    filled={star <= selectedStars}
                    onPress={() => handleStarPress(star)}
                  />
                ))}
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.buttonsContainer}>
              <TouchableOpacity
                style={[styles.rateButton, { backgroundColor: colors.primary }]}
                onPress={handleRateApp}
                disabled={selectedStars === 0}
              >
                <Text style={styles.rateButtonText}>
                  {selectedStars >= 4 ? 'Rate on App Store' : 'Submit Feedback'}
                </Text>
              </TouchableOpacity>

              <View style={styles.secondaryButtons}>
                <TouchableOpacity onPress={handleMaybeLater}>
                  <Text style={[styles.secondaryButtonText, { color: colors.textSecondary }]}>
                    Maybe Later
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={handleNoThanks}>
                  <Text style={[styles.secondaryButtonText, { color: colors.textSecondary }]}>
                    No Thanks
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  container: {
    borderRadius: 20,
    width: '100%',
    maxWidth: 350,
    overflow: 'hidden',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },
  header: {
    padding: 24,
    alignItems: 'center',
    gap: 12,
  },
  title: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  content: {
    padding: 24,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  starsContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  starsLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  starsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  buttonsContainer: {
    gap: 16,
  },
  rateButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  rateButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
});
