import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export const LaunchTest: React.FC = () => {
  useEffect(() => {
    console.log('🚀 LIFEPLAN LAUNCH TEST: Component mounted!');
    console.log('🚀 LIFEPLAN LAUNCH TEST: App is running!');
    
    // Also write to AsyncStorage to prove app launched
    import('@react-native-async-storage/async-storage').then(({ AsyncStorage }) => {
      AsyncStorage.setItem('LAUNCH_TEST', new Date().toISOString());
      console.log('🚀 LIFEPLAN LAUNCH TEST: AsyncStorage updated!');
    });
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>🚀 App Launched Successfully!</Text>
      <Text style={styles.small}>Check console for launch logs</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  small: {
    fontSize: 16,
    color: 'white',
  },
});
