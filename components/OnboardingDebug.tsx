import { hasCompletedOnboarding, resetOnboarding } from '@/utils/storage';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function OnboardingDebug() {
  const [status, setStatus] = useState<string>('Checking...');
  const [lastChecked, setLastChecked] = useState<string>('');

  const checkStatus = async () => {
    try {
      const completed = await hasCompletedOnboarding();
      setStatus(completed ? 'Completed' : 'Not Completed');
      setLastChecked(new Date().toLocaleTimeString());
    } catch (error) {
      setStatus('Error: ' + (error as Error).message);
      setLastChecked(new Date().toLocaleTimeString());
    }
  };

  const handleReset = async () => {
    try {
      await resetOnboarding();
      setStatus('Reset - Not Completed');
      setLastChecked(new Date().toLocaleTimeString());
    } catch (error) {
      setStatus('Reset Error: ' + (error as Error).message);
    }
  };

  useEffect(() => {
    checkStatus();
  }, []);

  if (__DEV__) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Onboarding Debug</Text>
        <Text style={styles.status}>Status: {status}</Text>
        <Text style={styles.time}>Last Checked: {lastChecked}</Text>
        
        <TouchableOpacity style={styles.button} onPress={checkStatus}>
          <Text style={styles.buttonText}>Check Status</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.button, styles.resetButton]} onPress={handleReset}>
          <Text style={styles.buttonText}>Reset Onboarding</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 100,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.8)',
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
  resetButton: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
