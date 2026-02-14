import React from 'react';
import { Image, ImageStyle, StyleProp, StyleSheet, View } from 'react-native';

interface CoinIconProps {
  size?: number;
  style?: StyleProp<ImageStyle>;
}

export default function CoinIcon({ size = 24, style }: CoinIconProps) {
  // Graceful fallback if image is missing
  const [error, setError] = React.useState(false);

  if (error) {
    return (
      <View style={[styles.fallback, { width: size, height: size, borderRadius: size / 2 }, style]} />
    );
  }

  return (
    <Image
      source={require('../../assets/images/coin_logo.png')}
      style={[{ width: size, height: size, resizeMode: 'contain' }, style]}
      onError={() => setError(true)}
    />
  );
}

const styles = StyleSheet.create({
  fallback: {
    backgroundColor: '#FFD700', // Gold fallback
  },
});
