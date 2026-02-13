import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../hooks/ThemeContext';
import { useAppSelector, useAppDispatch } from '../../hooks/useStore';
import { updateUsername, updateAvatar } from '../../store/slices/userSlice';
import { Typography, Spacing, BorderRadius } from '../../constants/theme';

const EMOJI_OPTIONS = [
  '🎮', '🕹️', '👾', '🎯', '🏆', '⭐', '💎', '🔥',
  '🚀', '🎲', '🎪', '🦊', '🐱', '🐶', '🦁', '🐼',
  '😎', '🤖', '👻', '🎃', '💀', '🦄', '🐉', '🌟',
];

export default function EditProfileScreen() {
  const { theme } = useTheme();
  const c = theme.colors;
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.user);

  const [username, setUsername] = useState(user.username);
  const [selectedEmoji, setSelectedEmoji] = useState(user.avatarEmoji);

  const handleSave = () => {
    if (!username.trim()) {
      Alert.alert('Error', 'Username cannot be empty');
      return;
    }
    dispatch(updateUsername(username.trim()));
    dispatch(updateAvatar(selectedEmoji));
    Alert.alert('Saved!', 'Your profile has been updated.', [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  const styles = createStyles(c);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* Avatar Section */}
      <View style={styles.avatarSection}>
        <View style={styles.currentAvatar}>
          <Text style={styles.currentAvatarEmoji}>{selectedEmoji}</Text>
        </View>
        <Text style={styles.avatarLabel}>Choose your avatar</Text>
      </View>

      {/* Emoji Grid */}
      <View style={styles.emojiGrid}>
        {EMOJI_OPTIONS.map((emoji, i) => (
          <TouchableOpacity
            key={i}
            style={[
              styles.emojiOption,
              selectedEmoji === emoji && styles.emojiOptionSelected,
            ]}
            onPress={() => setSelectedEmoji(emoji)}
            activeOpacity={0.7}>
            <Text style={styles.emojiText}>{emoji}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Username */}
      <Text style={styles.inputLabel}>Username</Text>
      <View style={styles.inputContainer}>
        <Icon name="account" size={20} color={c.textTertiary} />
        <TextInput
          style={styles.input}
          value={username}
          onChangeText={setUsername}
          placeholder="Enter your username"
          placeholderTextColor={c.textTertiary}
          maxLength={20}
        />
      </View>
      <Text style={styles.charCount}>{username.length}/20</Text>

      {/* Save Button */}
      <TouchableOpacity style={styles.saveButton} onPress={handleSave} activeOpacity={0.8}>
        <Icon name="content-save" size={20} color="#FFFFFF" />
        <Text style={styles.saveButtonText}>Save Changes</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const createStyles = (c: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: c.background,
    },
    scrollContent: {
      padding: Spacing.xl,
      paddingBottom: 40,
    },
    avatarSection: {
      alignItems: 'center',
      marginBottom: Spacing.xl,
    },
    currentAvatar: {
      width: 96,
      height: 96,
      borderRadius: 48,
      backgroundColor: c.primary + '18',
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 3,
      borderColor: c.primary,
    },
    currentAvatarEmoji: {
      fontSize: 48,
    },
    avatarLabel: {
      ...Typography.bodyMedium,
      color: c.textSecondary,
      marginTop: Spacing.md,
    },
    emojiGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      gap: Spacing.sm,
      marginBottom: Spacing.xxl,
      backgroundColor: c.card,
      padding: Spacing.lg,
      borderRadius: BorderRadius.lg,
      borderWidth: 1,
      borderColor: c.border,
    },
    emojiOption: {
      width: 48,
      height: 48,
      borderRadius: BorderRadius.md,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: c.inputBackground,
    },
    emojiOptionSelected: {
      backgroundColor: c.primary + '30',
      borderWidth: 2,
      borderColor: c.primary,
    },
    emojiText: {
      fontSize: 24,
    },
    inputLabel: {
      ...Typography.subtitle,
      color: c.textPrimary,
      marginBottom: Spacing.sm,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: c.card,
      borderRadius: BorderRadius.lg,
      paddingHorizontal: Spacing.lg,
      borderWidth: 1,
      borderColor: c.border,
      gap: Spacing.md,
    },
    input: {
      flex: 1,
      ...Typography.body,
      color: c.textPrimary,
      paddingVertical: Spacing.lg,
    },
    charCount: {
      ...Typography.caption,
      color: c.textTertiary,
      textAlign: 'right',
      marginTop: Spacing.xs,
    },
    saveButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: c.primary,
      paddingVertical: Spacing.lg,
      borderRadius: BorderRadius.lg,
      gap: 10,
      marginTop: Spacing.xxxl,
    },
    saveButtonText: {
      ...Typography.button,
      color: '#FFFFFF',
    },
  });
