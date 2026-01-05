import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';

interface Avatar {
  id: string;
  icon: string;
  color: string;
  name: string;
}

const avatarOptions: Avatar[] = [
  { id: '1', icon: 'rocket', color: '#6366F1', name: 'Explorer' },
  { id: '2', icon: 'star', color: '#8B5CF6', name: 'Star' },
  { id: '3', icon: 'diamond', color: '#10B981', name: 'Diamond' },
  { id: '4', icon: 'trophy', color: '#F59E0B', name: 'Champion' },
  { id: '5', icon: 'heart', color: '#EF4444', name: 'Lover' },
  { id: '6', icon: 'thunderstorm', color: '#06B6D4', name: 'Storm' },
];

interface AvatarSelectorProps {
  selectedAvatar: string;
  onSelectAvatar: (avatarId: string) => void;
}

export const AvatarSelector: React.FC<AvatarSelectorProps> = ({
  selectedAvatar,
  onSelectAvatar,
}) => {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.text }]}>Choose Your Avatar</Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        Select an avatar that represents you
      </Text>
      
      <View style={styles.avatarGrid}>
        {avatarOptions.map((avatar) => (
          <TouchableOpacity
            key={avatar.id}
            style={[
              styles.avatarCard,
              {
                backgroundColor: colors.surface,
                borderColor: selectedAvatar === avatar.id ? avatar.color : 'transparent',
                borderWidth: selectedAvatar === avatar.id ? 3 : 1,
                shadowColor: selectedAvatar === avatar.id ? avatar.color : colors.text,
                shadowOffset: { width: 0, height: selectedAvatar === avatar.id ? 4 : 2 },
                shadowOpacity: selectedAvatar === avatar.id ? 0.3 : 0.05,
                shadowRadius: selectedAvatar === avatar.id ? 12 : 8,
                elevation: selectedAvatar === avatar.id ? 4 : 2,
              },
            ]}
            onPress={() => onSelectAvatar(avatar.id)}
            activeOpacity={0.8}
          >
            <View style={[styles.avatarCircle, { backgroundColor: avatar.color + '15' }]}>
              <Ionicons name={avatar.icon as any} size={32} color={avatar.color} />
            </View>
            <Text style={[styles.avatarName, { color: colors.text }]}>{avatar.name}</Text>
            {selectedAvatar === avatar.id && (
              <View style={[styles.selectedBadge, { backgroundColor: avatar.color }]}>
                <Ionicons name="checkmark" size={16} color="white" />
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export { avatarOptions };

const styles = StyleSheet.create({
  container: {
    marginVertical: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 21,
    marginBottom: 20,
  },
  avatarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  avatarCard: {
    width: '48%',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 8,
    position: 'relative',
  },
  avatarCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  avatarName: {
    fontSize: 14,
    fontWeight: '600',
  },
  selectedBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
