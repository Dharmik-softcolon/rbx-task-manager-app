import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
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
import AnimatedCounter from '../../components/common/AnimatedCounter';
import CoinIcon from '../../components/common/CoinIcon';

export default function DailyRewardScreen() {
  const { theme } = useTheme();
  const c = theme.colors;
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();
  const dailyState = useAppSelector(state => state.dailyReward);
  const user = useAppSelector(state => state.user);
  const [justClaimed, setJustClaimed] = useState(false);

  useEffect(() => {
    dispatch(checkAndAdvanceDay());
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
    Alert.alert('Reward Claimed!', `You received ${rewardAmount} RBX coins!`);
  };

  const styles = createStyles(c);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.header}>
        <View style={{ marginTop: 40 }}>
        </View>
        <Text style={styles.title}>Daily Rewards</Text>
        <Text style={styles.subtitle}>
          Login every day to claim bigger rewards. Miss a day and your progress may reset!
        </Text>
      </View>

      <View style={styles.grid}>
        {DAILY_REWARD_VALUES.map((amount, index) => {
          const dayNum = index + 1;
          const isCurrent = dailyState.currentDay === dayNum;
          const isClaimed = dailyState.claimedDays.includes(dayNum);
          const isLocked = dayNum > dailyState.currentDay;

          return (
            <View
              key={dayNum}
              style={[
                styles.dayCard,
                isCurrent && styles.dayCardCurrent,
                isClaimed && styles.dayCardClaimed,
                dayNum === 7 && styles.dayCardLarge,
              ]}>
              <Text style={[styles.dayText, isCurrent && { color: c.textInverse }]}>
                Day {dayNum}
              </Text>
              
              <View style={styles.coinContainer}>
                {isClaimed ? (
                  <Icon name="check-circle" size={32} color={c.success} />
                ) : (
                  <>
                    <CoinIcon size={dayNum === 7 ? 32 : 24} style={{ marginBottom: 4 }} />
                    <Text style={[styles.amountText, isCurrent && { color: c.textInverse }]}>
                      {amount}
                    </Text>
                  </>
                )}
              </View>

              {isLocked && (
                <View style={styles.lockOverlay}>
                  <Icon name="lock" size={20} color={c.textTertiary} />
                </View>
              )}
            </View>
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
        <Text style={styles.claimButtonText}>
          {isClaimedToday || justClaimed ? 'Come Back Tomorrow' : 'Claim Reward'}
        </Text>
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
      marginBottom: Spacing.xxxl,
      marginTop: Spacing.lg,
    },
    headerIconBg: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: c.accentGold + '15',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: Spacing.lg,
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
      paddingHorizontal: Spacing.lg,
    },
    grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      gap: Spacing.md,
      marginBottom: Spacing.xxxl,
    },
    dayCard: {
      width: '30%',
      aspectRatio: 1,
      backgroundColor: c.card,
      borderRadius: BorderRadius.lg,
      padding: Spacing.sm,
      alignItems: 'center',
      justifyContent: 'space-between',
      borderWidth: 1,
      borderColor: c.border,
      elevation: 2,
    },
    dayCardLarge: {
      width: '100%',
      aspectRatio: 2.5,
      flexDirection: 'row',
      paddingHorizontal: Spacing.xl,
    },
    dayCardCurrent: {
      backgroundColor: c.primary,
      borderColor: c.primary,
    },
    dayCardClaimed: {
      backgroundColor: c.success + '10',
      borderColor: c.success,
    },
    dayText: {
      ...Typography.small,
      color: c.textSecondary,
      fontWeight: '700',
    },
    coinContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 6,
    },
    coinEmoji: {
      fontSize: 24,
      marginBottom: 4,
    },
    amountText: {
      ...Typography.subtitle,
      color: c.accentGold,
      fontWeight: '800',
    },
    lockOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.05)',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: BorderRadius.lg,
    },
    claimButton: {
      backgroundColor: c.accentGold,
      paddingVertical: Spacing.lg,
      borderRadius: BorderRadius.lg,
      alignItems: 'center',
      elevation: 4,
    },
    claimButtonDisabled: {
      backgroundColor: c.shimmer,
      elevation: 0,
    },
    claimButtonText: {
      ...Typography.button,
      color: '#1A1A2E',
    },
  });
