import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Animated,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../hooks/ThemeContext';
import { useAppSelector, useAppDispatch } from '../../hooks/useStore';
import { claimDailyReward, checkAndAdvanceDay } from '../../store/slices/dailyRewardSlice';
import { addCoins } from '../../store/slices/userSlice';
import { addTransaction } from '../../store/slices/transactionSlice';
import { DAILY_REWARD_VALUES } from '../../constants/levels';
import { Typography, Spacing, BorderRadius } from '../../constants/theme';
import CoinIcon from '../../components/common/CoinIcon';

const { width } = Dimensions.get('window');

export default function DailyRewardScreen() {
  const { theme } = useTheme();
  const c = theme.colors;
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();
  const dailyState = useAppSelector(state => state.dailyReward);
  const user = useAppSelector(state => state.user);
  const [justClaimed, setJustClaimed] = useState(false);

  // Animations
  const cardAnims = useRef(DAILY_REWARD_VALUES.map(() => new Animated.Value(0))).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const headerFade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    dispatch(checkAndAdvanceDay());
    
    // Header fade-in
    Animated.timing(headerFade, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();

    // Staggered card entrance
    Animated.stagger(100, 
      cardAnims.map(anim => 
        Animated.spring(anim, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        })
      )
    ).start();

    // Pulse animation for today's card
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [dispatch]);

  const today = new Date().toISOString().split('T')[0];
  const isClaimedToday = dailyState.lastClaimDate === today;

  const handleClaim = () => {
    if (isClaimedToday) return;

    const rewardAmount = DAILY_REWARD_VALUES[dailyState.currentDay - 1];
    dispatch(addCoins(rewardAmount));
    dispatch(claimDailyReward());
    dispatch(
      addTransaction({
        type: 'daily_reward',
        amount: rewardAmount,
        description: `Day ${dailyState.currentDay} Daily Login`,
        balanceAfter: user.currentBalance + rewardAmount,
      })
    );
    setJustClaimed(true);
    Alert.alert('Success!', `Day ${dailyState.currentDay} reward of ${rewardAmount} RBX has been claimed!`);
  };

  const styles = createStyles(c);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <Animated.View style={[styles.header, { opacity: headerFade }]}>
        <View style={styles.streakContainer}>
          <Icon name="fire" size={40} color={c.accentOrange} />
          <Text style={styles.streakCount}>{dailyState.currentDay}</Text>
        </View>
        <Text style={styles.title}>Daily Reward</Text>
        <Text style={styles.subtitle}>
          Earn rewards daily. Collect them all to unlock the Day 7 Grand Prize!
        </Text>
      </Animated.View>

      <View style={styles.grid}>
        {DAILY_REWARD_VALUES.map((amount, index) => {
          const dayNum = index + 1;
          const isCurrent = dailyState.currentDay === dayNum;
          const isClaimed = dailyState.claimedDays.includes(dayNum);
          const isLocked = dayNum > dailyState.currentDay;
          const isLastDay = dayNum === 7;

          const animatedStyle = {
            opacity: cardAnims[index],
            transform: [
              { scale: isCurrent ? pulseAnim : cardAnims[index] },
              { translateY: cardAnims[index].interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0]
                }) 
              }
            ],
          };

          return (
            <Animated.View
              key={dayNum}
              style={[
                styles.dayCardWrapper,
                isLastDay && styles.lastDayCardWrapper,
                animatedStyle
              ]}>
              <View
                style={[
                  styles.dayCard,
                  isCurrent && styles.dayCardCurrent,
                  isClaimed && styles.dayCardClaimed,
                  isLastDay && styles.dayCardLarge,
                ]}>
                <Text style={[styles.dayText, isCurrent && styles.textInverse]}>
                  Day {dayNum}
                </Text>
                
                <View style={styles.coinContainer}>
                  {isClaimed ? (
                    <Icon name="check-decagram" size={36} color={c.success} />
                  ) : (
                    <>
                      <CoinIcon size={isLastDay ? 40 : 28} style={{ marginBottom: 4 }} />
                      <Text style={[styles.amountText, isCurrent && styles.textInverse]}>
                        {amount}
                      </Text>
                    </>
                  )}
                </View>

                {isLocked && !isClaimed && (
                  <View style={styles.lockOverlay}>
                    <Icon name="lock" size={18} color={c.textTertiary} />
                  </View>
                )}
              </View>
            </Animated.View>
          );
        })}
      </View>

      <TouchableOpacity
        style={[
          styles.claimButton,
          (isClaimedToday || justClaimed) && styles.claimButtonDisabled,
        ]}
        onPress={handleClaim}
        disabled={isClaimedToday || justClaimed}
        activeOpacity={0.8}>
        {isClaimedToday || justClaimed ? (
          <View style={styles.claimedButtonContent}>
            <Icon name="clock-outline" size={20} color={c.textTertiary} />
            <Text style={styles.claimButtonTextDisabled}>Come Back Tomorrow</Text>
          </View>
        ) : (
          <Text style={styles.claimButtonText}>Claim Today's Reward</Text>
        )}
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
    header: {
      alignItems: 'center',
      marginBottom: Spacing.xxl,
      marginTop: Spacing.lg,
    },
    streakContainer: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: c.card,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: Spacing.md,
      borderWidth: 1,
      borderColor: c.border,
      shadowColor: c.accentOrange,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 10,
      elevation: 5,
    },
    streakCount: {
      position: 'absolute',
      ...Typography.h2,
      color: c.textPrimary,
      marginTop: 8,
    },
    title: {
      ...Typography.h1,
      color: c.textPrimary,
      textAlign: 'center',
    },
    subtitle: {
      ...Typography.body,
      color: c.textSecondary,
      textAlign: 'center',
      marginTop: Spacing.sm,
      paddingHorizontal: Spacing.md,
    },
    grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      marginBottom: Spacing.xxl,
    },
    dayCardWrapper: {
      width: (width - Spacing.xl * 2 - Spacing.md * 2) / 3,
      aspectRatio: 1,
      marginBottom: Spacing.md,
    },
    lastDayCardWrapper: {
      width: '100%',
      aspectRatio: 3,
    },
    dayCard: {
      flex: 1,
      backgroundColor: c.card,
      borderRadius: BorderRadius.xl,
      padding: Spacing.sm,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: c.border,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    dayCardLarge: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: Spacing.xxl,
    },
    dayCardCurrent: {
      backgroundColor: c.primary,
      borderColor: c.primary,
      borderWidth: 2,
      shadowColor: c.primary,
      shadowOpacity: 0.4,
      shadowRadius: 15,
      elevation: 10,
    },
    dayCardClaimed: {
      backgroundColor: c.success + '05',
      borderColor: c.success + '40',
      elevation: 0,
    },
    dayText: {
      ...Typography.caption,
      color: c.textSecondary,
      fontWeight: '700',
      marginBottom: 4,
      textTransform: 'uppercase',
    },
    coinContainer: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    amountText: {
      ...Typography.subtitle,
      color: c.accentGold,
      fontWeight: '800',
      fontSize: 16,
    },
    textInverse: {
      color: '#FFFFFF',
    },
    lockOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.02)',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: BorderRadius.xl,
    },
    claimButton: {
      backgroundColor: c.primary,
      paddingVertical: Spacing.lg,
      borderRadius: BorderRadius.xl,
      alignItems: 'center',
      shadowColor: c.primary,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.3,
      shadowRadius: 15,
      elevation: 8,
    },
    claimButtonDisabled: {
      backgroundColor: c.shimmer,
      elevation: 0,
      shadowOpacity: 0,
    },
    claimButtonText: {
      ...Typography.button,
      color: '#FFFFFF',
      fontSize: 18,
    },
    claimedButtonContent: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    claimButtonTextDisabled: {
      ...Typography.button,
      color: c.textTertiary,
      fontSize: 16,
    },
  });
