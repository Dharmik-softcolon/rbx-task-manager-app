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
import { launchImageLibrary } from 'react-native-image-picker';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../hooks/ThemeContext';
import { useAppSelector, useAppDispatch } from '../../hooks/useStore';
import { updateUsername, updateProfileImage } from '../../store/slices/userSlice';
import { Typography, Spacing, BorderRadius } from '../../constants/theme';
import ProfileAvatar from '../../components/common/ProfileAvatar';

export default function EditProfileScreen() {
  const { theme } = useTheme();
  const c = theme.colors;
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.user);

  const [username, setUsername] = useState(user.username);
  const [profileImage, setProfileImage] = useState(user.profileImage);

  const handlePickImage = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 0.8,
    });

    if (result.assets && result.assets.length > 0) {
      setProfileImage(result.assets[0].uri || null);
    }
  };

  const handleSave = () => {
    if (!username.trim()) {
      Alert.alert('Error', 'Username cannot be empty');
      return;
    }
    dispatch(updateUsername(username.trim()));
    dispatch(updateProfileImage(profileImage));
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
          <ProfileAvatar 
            uri={profileImage} 
            name={username} 
            size={96} 
          />
        </View>
        <TouchableOpacity 
          style={styles.changePhotoButton} 
          onPress={handlePickImage}
          activeOpacity={0.7}
        >
          <Icon name="camera" size={20} color={c.primary} />
          <Text style={styles.changePhotoText}>Change Photo</Text>
        </TouchableOpacity>
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
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: c.card,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: c.border,
      overflow: 'hidden',
    },
    changePhotoButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginTop: Spacing.md,
      paddingVertical: Spacing.xs,
      paddingHorizontal: Spacing.md,
    },
    changePhotoText: {
      ...Typography.bodyMedium,
      color: c.primary,
      fontWeight: '600',
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
