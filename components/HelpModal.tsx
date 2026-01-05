import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';

const { width } = Dimensions.get('window');

interface HelpModalProps {
  visible: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ visible, onClose }) => {
  const { colors } = useTheme();

  const handleOption = (title: string, content: string) => {
    onClose();
    setTimeout(() => {
      alert(`${title}\n\n${content}`);
    }, 300);
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity 
        style={styles.overlay} 
        activeOpacity={1} 
        onPress={onClose}
      >
        <TouchableOpacity 
          activeOpacity={1}
          style={[styles.modalContainer, { backgroundColor: colors.background }]}
          onPress={(e) => e.stopPropagation()}
        >
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Help & Support</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={colors.icon} />
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>
            <TouchableOpacity
              style={[styles.optionButton, { backgroundColor: colors.surface }]}
              onPress={() => handleOption('Report a Bug', 'Please email us at: faranh31@gmail.com\n\nDescribe the bug and steps to reproduce it. Include screenshots if possible.')}
            >
              <Ionicons name="bug-outline" size={24} color={colors.primary} />
              <View style={styles.optionText}>
                <Text style={[styles.optionTitle, { color: colors.text }]}>Report a Bug</Text>
                <Text style={[styles.optionDescription, { color: colors.textSecondary }]}>
                  Found an issue? Let us know
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.icon} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.optionButton, { backgroundColor: colors.surface }]}
              onPress={() => handleOption('Flag Content', 'Please email us at: faranh31@gmail.com\n\nProvide details about the content you want to flag and the reason.')}
            >
              <Ionicons name="flag-outline" size={24} color={colors.primary} />
              <View style={styles.optionText}>
                <Text style={[styles.optionTitle, { color: colors.text }]}>Flag Content</Text>
                <Text style={[styles.optionDescription, { color: colors.textSecondary }]}>
                  Report inappropriate content
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.icon} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.optionButton, { backgroundColor: colors.surface }]}
              onPress={() => handleOption('Contact Support', 'Email us at: faranh31@gmail.com\n\nWe\'ll respond within 24 hours. For urgent issues, please mark as urgent in the subject line.')}
            >
              <Ionicons name="mail-outline" size={24} color={colors.primary} />
              <View style={styles.optionText}>
                <Text style={[styles.optionTitle, { color: colors.text }]}>Contact Support</Text>
                <Text style={[styles.optionDescription, { color: colors.textSecondary }]}>
                  Get help from our team
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.icon} />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: width - 32,
    maxWidth: 400,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  closeButton: {
    padding: 4,
  },
  modalContent: {
    gap: 12,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  optionText: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  optionDescription: {
    fontSize: 14,
  },
});
