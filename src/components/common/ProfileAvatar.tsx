import React from 'react';
import { View, Text, Image, StyleSheet, ViewStyle, TextStyle, ImageStyle } from 'react-native';
import { Typography } from '../../constants/theme';
import { useTheme } from '../../hooks/ThemeContext';

interface ProfileAvatarProps {
  uri?: string | null;
  name?: string;
  size?: number;
  style?: ViewStyle;
  textStyle?: TextStyle;
  imageStyle?: ImageStyle;
}

const ProfileAvatar: React.FC<ProfileAvatarProps> = ({
  uri,
  name = 'User',
  size = 56,
  style,
  textStyle,
  imageStyle,
}) => {
  const { theme } = useTheme();
  const c = theme.colors;

  const getInitials = (name: string) => {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const containerStyle: ViewStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
    backgroundColor: c.primary + '18',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    ...style,
  };

  if (uri) {
    return (
      <View style={containerStyle}>
        <Image
          source={{ uri }}
          style={[
            {
              width: '100%',
              height: '100%',
            },
            imageStyle,
          ]}
        />
      </View>
    );
  }

  return (
    <View style={containerStyle}>
      <Text
        style={[
          {
            fontSize: size * 0.4,
            fontWeight: '600',
            color: c.primary,
          },
          textStyle,
        ]}>
        {getInitials(name)}
      </Text>
    </View>
  );
};

export default ProfileAvatar;
