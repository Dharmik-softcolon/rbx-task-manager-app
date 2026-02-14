import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Dimensions,
  TouchableOpacity,
  FlatList,
  Animated,
  Image,
  ViewToken,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../hooks/ThemeContext';
import { useAppDispatch } from '../../hooks/useStore';
import { completeOnboarding } from '../../store/slices/userSlice';
import { Typography, Spacing, BorderRadius } from '../../constants/theme';

const { width } = Dimensions.get('window');

const SLIDES = [
  {
    id: '1',
    title: 'Earn Real Rewards',
    description: 'Complete simple daily tasks to earn RBX coins. Watch videos, spin the wheel, and more!',
    icon: 'star-shooting',
    color: '#1CC29F',
  },
  {
    id: '2',
    title: 'Level Up & Multiply',
    description: 'Increase your rank to unlock multiplier bonuses. Maintain streaks for massive rewards!',
    icon: 'trophy-award',
    color: '#FFD700',
  },
  {
    id: '3',
    title: 'Cash Out Instantly',
    description: 'Convert your RBX coins to real USD. 1,000 RBX = $1.00. Fast and secure withdrawals.',
    icon: 'cash-fast',
    color: '#FF6B35',
  },
];

export default function OnboardingScreen() {
  const { theme } = useTheme();
  const c = theme.colors;
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef<FlatList>(null);

  const handleNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      slidesRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      handleFinish();
    }
  };

  const handleFinish = () => {
    dispatch(completeOnboarding());
    navigation.reset({
      index: 0,
      routes: [{ name: 'MainTabs' as any }],
    });
  };

  const renderItem = ({ item }: { item: typeof SLIDES[0] }) => {
    return (
      <View style={[styles.slide, { width }]}>
        <View style={[styles.iconContainer, { backgroundColor: item.color + '15' }]}>
          {item.id === '1' ? (
            <Image 
              source={require('../../assets/images/app_icon.jpg')} 
              style={{ width: 140, height: 140, borderRadius: 30 }} 
            />
          ) : (
            <Icon name={item.icon} size={100} color={item.color} />
          )}
        </View>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    );
  };

  const styles = createStyles(c);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={c.background} />
      
      {/* Skip Button */}
      <TouchableOpacity style={styles.skipButton} onPress={handleFinish}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      <FlatList
        ref={slidesRef}
        data={SLIDES}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        onViewableItemsChanged={useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
          if (viewableItems[0]) {
            setCurrentIndex(viewableItems[0].index || 0);
          }
        }).current}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
      />

      {/* Pagination & Next Button */}
      <View style={styles.footer}>
        <View style={styles.pagination}>
          {SLIDES.map((_, i) => {
            const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
            const dotWidth = scrollX.interpolate({
              inputRange,
              outputRange: [10, 20, 10],
              extrapolate: 'clamp',
            });
            const opacity = scrollX.interpolate({
              inputRange,
              outputRange: [0.3, 1, 0.3],
              extrapolate: 'clamp',
            });
            return (
              <Animated.View
                key={i}
                style={[
                  styles.dot,
                  { width: dotWidth, opacity, backgroundColor: c.primary },
                ]}
              />
            );
          })}
        </View>

        <TouchableOpacity 
          style={[styles.nextButton, { backgroundColor: c.primary }]} 
          onPress={handleNext}
          activeOpacity={0.8}
        >
          <Text style={styles.nextButtonText}>
            {currentIndex === SLIDES.length - 1 ? 'Get Started' : 'Next'}
          </Text>
          {currentIndex !== SLIDES.length - 1 && (
            <Icon name="arrow-right" size={20} color="#FFFFFF" />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const createStyles = (c: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: c.background,
    },
    slide: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: Spacing.xxxl,
    },
    iconContainer: {
      width: 200,
      height: 200,
      borderRadius: 100,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: Spacing.xxxl,
    },
    title: {
      ...Typography.h1,
      color: c.textPrimary,
      textAlign: 'center',
      marginBottom: Spacing.md,
    },
    description: {
      ...Typography.body,
      color: c.textSecondary,
      textAlign: 'center',
      lineHeight: 24,
      fontSize: 16,
    },
    skipButton: {
      position: 'absolute',
      top: Spacing.xxxl * 1.5,
      right: Spacing.xl,
      zIndex: 10,
    },
    skipText: {
      ...Typography.bodyMedium,
      color: c.textTertiary,
    },
    footer: {
      paddingHorizontal: Spacing.xl,
      paddingBottom: Spacing.xxxl,
      marginBottom: Spacing.lg,
    },
    pagination: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginBottom: Spacing.xl,
      gap: 6,
    },
    dot: {
      height: 10,
      borderRadius: 5,
    },
    nextButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: Spacing.lg,
      borderRadius: BorderRadius.lg,
      gap: 10,
    },
    nextButtonText: {
      ...Typography.button,
      color: '#FFFFFF',
      fontSize: 18,
    },
  });
