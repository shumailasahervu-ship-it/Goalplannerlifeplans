import AdBanner from '@/components/AdBanner';
import { AvatarSelector, avatarOptions } from '@/components/AvatarSelector';
import { useAuth } from '@/contexts/AuthContext';
import { useSnackbar } from '@/contexts/SnackbarContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    ScrollView,
    StatusBar,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SettingsScreen() {
  const { colors, theme, setTheme } = useTheme();
  const { user, userProfile, logout, deleteAccount, updateDisplayName } = useAuth();
  const { showSnackbar } = useSnackbar();

  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(userProfile?.avatar || '1');
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [displayName, setDisplayName] = useState(userProfile?.displayName || '');

  const handleThemeChange = (value: boolean) => {
    setTheme(value ? 'dark' : 'premium');
  };

  const handleAvatarChange = async (avatarId: string) => {
    setSelectedAvatar(avatarId);
    setShowAvatarSelector(false);
    // TODO: Update avatar in Firestore
    Alert.alert('Success', 'Avatar updated successfully!');
  };

  const handlePrivacyPolicy = () => {
    Alert.alert(
      'Privacy Policy',
      'Life Plan App - Privacy Policy\n\n' +
      '1. Information We Collect\n' +
      '• Personal information: name, email, avatar\n' +
      '• Goal data: titles, descriptions, timelines, progress\n' +
      '• Usage analytics to improve our service\n\n' +
      '2. How We Use Your Information\n' +
      '• Provide and maintain the Life Plan service\n' +
      '• Send you notifications about your goals\n' +
      '• Analyze usage patterns to improve features\n\n' +
      '3. Data Protection\n' +
      '• All data is encrypted in transit and at rest\n' +
      '• We use industry-standard security measures\n' +
      '• Your data is backed up regularly\n\n' +
      '4. Data Sharing\n' +
      '• We never sell your personal information\n' +
      '• We only share data as required by law\n' +
      '• Aggregated analytics may be shared for research\n\n' +
      '5. Your Rights\n' +
      '• Access your data at any time\n' +
      '• Export your data\n' +
      '• Delete your account and all data\n\n' +
      '6. Contact Us\n' +
      'Privacy concerns: faranh31@gmail.com\n\n' +
      'Last updated: November 2024'
    );
  };

  const handleEULA = () => {
    Alert.alert(
      'End User License Agreement',
      'Life Plan App - EULA\n\n' +
      '1. Acceptance of Terms\n' +
      'By using Life Plan, you agree to these terms.\n\n' +
      '2. License Grant\n' +
      'We grant you a limited, non-exclusive license to use Life Plan for personal goal planning and tracking.\n\n' +
      '3. User Content\n' +
      'You retain ownership of your goals and personal data. We use this data solely to provide the service.\n\n' +
      '4. Privacy\n' +
      'Your privacy is important to us. See our Privacy Policy for details.\n\n' +
      '5. Disclaimer\n' +
      'Life Plan is provided "as is" without warranties of any kind.\n\n' +
      '6. Limitation of Liability\n' +
      'We shall not be liable for any indirect or consequential damages.\n\n' +
      '7. Termination\n' +
      'We may terminate access for violations of these terms.\n\n' +
      'Last updated: November 2024'
    );
  };

  const handleHelp = () => {
    setShowHelpModal(true);
  };

  const handleChangeUsername = async () => {
    const name = displayName.trim();
    if (!name) {
      Alert.alert('Update Name', 'Please enter a valid name.');
      return;
    }

    try {
      await updateDisplayName(name);
      showSnackbar('Name updated successfully', 'success');
    } catch (error: any) {
      Alert.alert('Update Failed', error.message || 'Could not update your name. Please try again.');
    }
  };

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log Out',
        style: 'destructive',
        onPress: async () => {
          await logout();
          showSnackbar('Logged out successfully', 'success');
          router.replace('/auth/login');
        },
      },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This will permanently delete your account and all data. This action cannot be undone. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteAccount();
              showSnackbar('Account deleted successfully', 'success');
              router.replace('/onboarding');
            } catch (error: any) {
              const msg = String(error?.message || 'Failed to delete account');
              if (msg.includes('requires-recent-login')) {
                Alert.alert(
                  'Re-authentication required',
                  'For security reasons, please sign in again to delete your account.',
                  [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Sign In', onPress: () => router.replace('/auth/login') },
                  ]
                );
              } else {
                Alert.alert('Error', msg);
              }
            }
          },
        },
      ]
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.primary }}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      <SafeAreaView style={{ backgroundColor: colors.primary }} edges={['top']} />
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <TouchableOpacity onPress={() => router.canGoBack() ? router.back() : router.push('/(tabs)')} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Account Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Account</Text>
          
          <TouchableOpacity style={[styles.item, { backgroundColor: colors.surface }]}>
            <View style={styles.itemLeft}>
              <View style={[styles.avatarCircle, { backgroundColor: avatarOptions.find(a => a.id === selectedAvatar)?.color + '20' }]}>
                <Ionicons 
                  name={avatarOptions.find(a => a.id === selectedAvatar)?.icon as any} 
                  size={20} 
                  color={avatarOptions.find(a => a.id === selectedAvatar)?.color} 
                />
              </View>
              <Text style={[styles.itemText, { color: colors.text }]}>{userProfile?.email}</Text>
            </View>
          </TouchableOpacity>

          <View style={[styles.item, { backgroundColor: colors.surface }]}
          >
            <View style={styles.itemLeft}>
              <Ionicons name="create-outline" size={20} color={colors.icon} />
              <TextInput
                style={[styles.itemText, { color: colors.text, padding: 0 }]}
                placeholder="Change username"
                placeholderTextColor={colors.textSecondary}
                value={displayName}
                onChangeText={setDisplayName}
                autoCapitalize="words"
              />
            </View>
            <TouchableOpacity onPress={handleChangeUsername}>
              <Text style={[styles.itemText, { color: colors.primary }]}>Save</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={() => setShowAvatarSelector(true)} style={[styles.item, { backgroundColor: colors.surface }]}>
            <View style={styles.itemLeft}>
              <Ionicons name="person-outline" size={20} color={colors.icon} />
              <Text style={[styles.itemText, { color: colors.text }]}>Change Avatar</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.icon} />
          </TouchableOpacity>
        </View>

        {/* Preferences Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Preferences</Text>
          
          <View style={[styles.item, { backgroundColor: colors.surface }]}>
            <View style={styles.itemLeft}>
              <Ionicons name={theme === 'dark' ? 'moon' : 'sunny'} size={20} color={colors.icon} />
              <Text style={[styles.itemText, { color: colors.text }]}>
                {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
              </Text>
            </View>
            <Switch
              value={theme === 'dark'}
              onValueChange={handleThemeChange}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={theme === 'dark' ? colors.primary : colors.textSecondary}
            />
          </View>

          <View style={[styles.item, { backgroundColor: colors.surface }]}>
            <View style={styles.itemLeft}>
              <Ionicons name="notifications-outline" size={20} color={colors.icon} />
              <Text style={[styles.itemText, { color: colors.text }]}>Notifications</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={notificationsEnabled ? colors.primary : colors.textSecondary}
            />
          </View>
        </View>

        {/* Legal Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Legal</Text>
          
          <TouchableOpacity style={[styles.item, { backgroundColor: colors.surface }]}>
            <View style={styles.itemLeft}>
              <Ionicons name="information-circle-outline" size={20} color={colors.icon} />
              <Text style={[styles.itemText, { color: colors.text }]}>Version</Text>
            </View>
            <Text style={[styles.itemText, { color: colors.textSecondary }]}>1.0.0</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.item, { backgroundColor: colors.surface }]} onPress={handleEULA}>
            <View style={styles.itemLeft}>
              <Ionicons name="document-text" size={20} color={colors.icon} />
              <Text style={[styles.itemText, { color: colors.text }]}>EULA</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.icon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handlePrivacyPolicy} style={[styles.item, { backgroundColor: colors.surface }]}>
            <View style={styles.itemLeft}>
              <Ionicons name="shield-checkmark" size={20} color={colors.icon} />
              <Text style={[styles.itemText, { color: colors.text }]}>Privacy Policy</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.icon} />
          </TouchableOpacity>
        </View>

        {/* Help Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Help</Text>
          <TouchableOpacity onPress={handleHelp} style={[styles.item, { backgroundColor: colors.surface }]}>
            <View style={styles.itemLeft}>
              <Ionicons name="help-circle-outline" size={20} color={colors.icon} />
              <Text style={[styles.itemText, { color: colors.text }]}>Help & Support</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.icon} />
          </TouchableOpacity>
        </View>

        {/* Danger Zone */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Danger Zone</Text>
          <TouchableOpacity onPress={handleLogout} style={[styles.item, { backgroundColor: colors.surface }]}>
            <View style={styles.itemLeft}>
              <Ionicons name="log-out-outline" size={20} color={colors.warning} />
              <Text style={[styles.itemText, { color: colors.warning }]}>Log Out</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.icon} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.item, { backgroundColor: colors.surface }]}
            onPress={handleDeleteAccount}
          >
            <View style={styles.itemLeft}>
              <Ionicons name="trash" size={20} color={colors.danger} />
              <Text style={[styles.itemText, { color: colors.danger }]}>Delete Account</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.icon} />
          </TouchableOpacity>
        </View>

        {showAvatarSelector && (
          <View style={[styles.avatarModal, { backgroundColor: colors.background }]}>
            <View style={styles.avatarModalHeader}>
              <Text style={[styles.avatarModalTitle, { color: colors.text }]}>Choose Avatar</Text>
              <TouchableOpacity onPress={() => setShowAvatarSelector(false)}>
                <Ionicons name="close" size={24} color={colors.icon} />
              </TouchableOpacity>
            </View>
            <AvatarSelector
              selectedAvatar={selectedAvatar}
              onSelectAvatar={handleAvatarChange}
            />
          </View>
        )}
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
    paddingBottom: 16,
    paddingHorizontal: 20,
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
  avatarModal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
    paddingTop: 80,
  },
  avatarModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  avatarModalTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  avatarCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    marginHorizontal: 20,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginHorizontal: 20,
    marginBottom: 1,
    borderRadius: 12,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  itemText: {
    fontSize: 16,
  },
});
