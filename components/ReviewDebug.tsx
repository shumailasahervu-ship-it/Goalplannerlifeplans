import {
    getReviewData,
    incrementGoalsCreated,
    resetReviewData,
    shouldShowReviewPrompt
} from '@/utils/review';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ReviewDebug() {
  const [reviewData, setReviewData] = useState<any>(null);
  const [shouldShow, setShouldShow] = useState<boolean>(false);
  const [lastChecked, setLastChecked] = useState<string>('');

  const checkReviewStatus = async () => {
    try {
      const data = await getReviewData();
      const show = await shouldShowReviewPrompt();
      setReviewData(data);
      setShouldShow(show);
      setLastChecked(new Date().toLocaleTimeString());
    } catch (error) {
      console.error('Review debug error:', error);
    }
  };

  const handleIncrementGoals = async () => {
    await incrementGoalsCreated();
    await checkReviewStatus();
  };

  const handleReset = async () => {
    await resetReviewData();
    await checkReviewStatus();
  };

  useEffect(() => {
    checkReviewStatus();
  }, []);

  if (__DEV__) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Review System Debug</Text>
        
        <Text style={styles.status}>
          Goals Created: {reviewData?.goalsCreated || 0}
        </Text>
        <Text style={styles.status}>
          Has Reviewed: {reviewData?.hasReviewed ? 'Yes' : 'No'}
        </Text>
        <Text style={styles.status}>
          Should Show Prompt: {shouldShow ? 'Yes' : 'No'}
        </Text>
        <Text style={styles.time}>Last Checked: {lastChecked}</Text>
        
        <TouchableOpacity style={styles.button} onPress={checkReviewStatus}>
          <Text style={styles.buttonText}>Check Status</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.button, styles.incrementButton]} onPress={handleIncrementGoals}>
          <Text style={styles.buttonText}>Add Goal (+1)</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.button, styles.resetButton]} onPress={handleReset}>
          <Text style={styles.buttonText}>Reset Review Data</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.9)',
    padding: 20,
    borderRadius: 10,
    zIndex: 9999,
  },
  title: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  status: {
    color: 'white',
    fontSize: 14,
    marginBottom: 5,
  },
  time: {
    color: 'white',
    fontSize: 12,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  incrementButton: {
    backgroundColor: '#34C759',
  },
  resetButton: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
