import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Animated,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../hooks/ThemeContext';
import { useAppSelector, useAppDispatch } from '../../hooks/useStore';
import { checkAndResetDailyTasks } from '../../store/slices/taskSlice';
import { checkAndAdvanceDay } from '../../store/slices/dailyRewardSlice';
import { checkAchievements } from '../../store/slices/achievementSlice';
import { Typography, Spacing, BorderRadius } from '../../constants/theme';
import { getUserRank, getRankProgress, getNextRank } from '../../constants/levels';
import AnimatedCounter from '../../components/common/AnimatedCounter';
import CoinIcon from '../../components/common/CoinIcon';
import ProfileAvatar from '../../components/common/ProfileAvatar';

export default function HomeScreen() {
  const { theme } = useTheme();
  const c = theme.colors;
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();
  
  const user = useAppSelector(state => state.user);
  const { tasks, checkinStreak, longestStreak } = useAppSelector(state => state.tasks);
  const { lastClaimDate } = useAppSelector(state => state.dailyReward);

  const [refreshing, setRefreshing] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  // Derived state
  const completedTasks = tasks.filter(t => t.completed && t.category === 'daily').length;
  const totalDailyTasks = tasks.filter(t => t.category === 'daily').length;
  const progress = totalDailyTasks > 0 ? completedTasks / totalDailyTasks : 0;
  
  const currentRank = getUserRank(user.totalCoinsEarned);
  const nextRank = getNextRank(user.totalCoinsEarned);
  const rankProgress = getRankProgress(user.totalCoinsEarned);

  const today = new Date().toISOString().split('T')[0];
  const dailyRewardClaimed = lastClaimDate === today;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  const handleRefresh = () => {
    setRefreshing(true);
    dispatch(checkAndResetDailyTasks());
    dispatch(checkAndAdvanceDay());
    // Also re-check achievements
    dispatch(checkAchievements({
      totalCoins: user.totalCoinsEarned,
      streak: longestStreak,
      tasksCompleted: completedTasks,
      totalTasks: totalDailyTasks,
      hasSpun: false,
      hasShared: false,
      hasWithdrawn: user.withdrawnAmount > 0,
    }));
    setTimeout(() => setRefreshing(false), 1000);
  };

  const QuickStat = ({ icon, label, value, color }: any) => (
    <View style={[styles.statItem, { backgroundColor: c.card, borderColor: c.border }]}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );

  const styles = createStyles(c);

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle={theme.dark ? 'light-content' : 'dark-content'}
        backgroundColor={c.background}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={c.primary}
          />
        }
      >
        {/* Header */}
        <Animated.View
          style={[
            styles.header,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          <View>
            <Text style={styles.greeting}>Welcome back,</Text>
            <Text style={styles.username}>{user.username}</Text>
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate('Profile' as any)}
          >
            <ProfileAvatar 
              uri={user.profileImage} 
              name={user.username} 
              size={44} 
            />
          </TouchableOpacity>
        </Animated.View>

        {/* Balance Card */}
        <Animated.View
          style={[
            styles.balanceCard,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          <View style={styles.balanceHeader}>
            <Text style={styles.balanceLabel}>Total Balance</Text>
            <Icon name="wallet" size={20} color="rgba(255,255,255,0.8)" />
          </View>
          <View style={styles.balanceRow}>
            <CoinIcon size={32} style={{ marginTop: 5 }} />
            <AnimatedCounter
              value={user.currentBalance}
              style={styles.balanceAmount}
            />
          </View>
          <Text style={styles.usdValue}>
            ≈ ${(user.currentBalance / 1000).toFixed(2)} USD
          </Text>

          <TouchableOpacity
            style={[
              styles.withdrawButton,
              { backgroundColor: 'rgba(255,255,255,0.2)' },
            ]}
            onPress={() => navigation.navigate('Profile' as any)}
          >
            <Text style={styles.withdrawText}>Withdraw Funds</Text>
            <Icon name="arrow-right" size={16} color="#FFFFFF" />
          </TouchableOpacity>
        </Animated.View>

        {/* Level Progress */}
        <View style={styles.section}>
          <View style={styles.rankHeader}>
            <View style={styles.rankInfo}>
              <Text style={styles.rankLabel}>Current Rank</Text>
              <View style={styles.rankBadge}>
                <Text style={styles.rankName}>
                  {currentRank.name}
                </Text>
              </View>
            </View>
            <View
              style={[
                styles.multiplierBadge,
                { backgroundColor: c.accentOrange },
              ]}
            >
              <Icon name="lightning-bolt" size={14} color="#FFFFFF" />
              <Text style={styles.multiplierText}>
                {currentRank.multiplier}x Multiplier
              </Text>
            </View>
          </View>

          <View style={[styles.progressBarBg, { backgroundColor: c.shimmer }]}>
            <View
              style={[
                styles.progressBarFill,
                {
                  width: `${rankProgress}%`,
                  backgroundColor: currentRank.color,
                },
              ]}
            />
          </View>

          {nextRank && (
            <Text style={styles.nextRankText}>
              {nextRank.requiredCoins - user.totalCoinsEarned} coins to{' '}
              {nextRank.name}
            </Text>
          )}
        </View>

        {/* Quick Actions Grid */}
        <View style={styles.statsGrid}>
          <QuickStat
            // icon="fire"
            label="Day Streak"
            value={checkinStreak}
            color="#FF6B35"
          />
          <QuickStat
            // icon="trophy"
            label="Rank Bonus"
            value={`${currentRank.multiplier}x`}
            color="#FFD700"
          />
          <QuickStat
            // icon="history"
            label="Total Earned"
            value={(user.totalCoinsEarned / 1000).toFixed(1) + 'k'}
            color="#3B82F6"
          />
        </View>

        {/* Daily Bonus Banner */}
        {!dailyRewardClaimed && (
          <TouchableOpacity
            style={[
              styles.actionBanner,
              {
                backgroundColor: c.accentGold + '15',
                borderColor: c.accentGold,
              },
            ]}
            onPress={() => navigation.navigate('Rewards' as any)}
            activeOpacity={0.8}
          >
            <View style={[styles.iconBox, { backgroundColor: c.accentGold }]}>
              <Icon name="gift" size={24} color="#1A1A2E" />
            </View>
            <View style={styles.bannerContent}>
              <Text style={styles.bannerTitle}>Daily Reward Available!</Text>
              <Text style={styles.bannerSubtitle}>
                Claim your daily login bonus now
              </Text>
            </View>
            <Icon name="chevron-right" size={24} color={c.textSecondary} />
          </TouchableOpacity>
        )}

        {/* Task Progress */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Today's Progress</Text>
            <Text style={styles.sectionSubtitle}>
              {completedTasks}/{totalDailyTasks} Tasks
            </Text>
          </View>

          <View
            style={[
              styles.progressCard,
              { backgroundColor: c.card, borderColor: c.border },
            ]}
          >
            {/*<View style={styles.progressCircle}>*/}
            {/*  <Icon name="chart-donut" size={32} color={c.primary} />*/}
            {/*  <Text style={[styles.progressPercent, { color: c.primary }]}>*/}
            {/*    {Math.round(progress * 100)}%*/}
            {/*  </Text>*/}
            {/*</View>*/}
            <View style={styles.progressInfo}>
              <Text style={styles.progressText}>
                {progress === 1
                  ? 'All tasks completed!'
                  : 'Keep going! Complete tasks to earn more.'}
              </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('Earn' as any)}
              >
                <Text style={[styles.linkText, { color: c.primary }]}>
                  Go to Tasks
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Achievements Shortcuts */}
        <View style={styles.section}>
          <TouchableOpacity
            style={[
              styles.menuItem,
              { backgroundColor: c.card, borderColor: c.border },
            ]}
            onPress={() => navigation.navigate('Achievements' as any)}
          >
            {/*<View style={[styles.menuIcon, { backgroundColor: '#8B5CF615' }]}>*/}
            {/*  <Icon name="medal" size={22} color="#8B5CF6" />*/}
            {/*</View>*/}
            <Text style={styles.menuText}>Achievements</Text>
            <Icon name="chevron-right" size={20} color={c.textTertiary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.actionBanner,
              {
                backgroundColor: '#EC4899' + '15',
                borderColor: '#EC4899',
                marginTop: Spacing.md,
              },
            ]}
            onPress={() => navigation.navigate('Referral' as any)}
            activeOpacity={0.8}
          >
            {/*<View style={[styles.iconBox, { backgroundColor: '#EC4899' }]}>*/}
            {/*  <Icon name="account-multiple-plus" size={24} color="#FFFFFF" />*/}
            {/*</View>*/}
            <View style={styles.bannerContent}>
              <Text style={styles.bannerTitle}>Invite Friends</Text>
              <Text style={styles.bannerSubtitle}>
                Earn 200 RBX for every referral
              </Text>
            </View>
            <View
              style={[styles.menuBadge, { backgroundColor: c.success + '20' }]}
            >
              <Text style={[styles.menuBadgeText, { color: c.success }]}>
                +200 RBX
              </Text>
            </View>
            <Icon name="chevron-right" size={24} color={c.textSecondary} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
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
      paddingTop: Spacing.xxxl,
      paddingBottom: 40,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: Spacing.xl,
    },
    greeting: {
      ...Typography.body,
      color: c.textSecondary,
    },
    username: {
      ...Typography.h2,
      color: c.textPrimary,
    },
    balanceCard: {
      backgroundColor: c.primary,
      borderRadius: BorderRadius.xl,
      padding: Spacing.lg,
      marginBottom: Spacing.xl,
      shadowColor: c.primary,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.3,
      shadowRadius: 12,
      elevation: 8,
    },
    balanceHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: Spacing.xs,
    },
    balanceLabel: {
      ...Typography.caption,
      color: 'rgba(255,255,255,0.8)',
      textTransform: 'uppercase',
      letterSpacing: 1,
    },
    balanceRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 4,
    },
    currencySymbol: {
      fontSize: 32,
      color: '#FFFFFF',
      marginRight: 8,
    },
    balanceAmount: {
      fontSize: 36,
      fontWeight: '800',
      color: '#FFFFFF',
    },
    usdValue: {
      ...Typography.bodyMedium,
      color: 'rgba(255,255,255,0.9)',
      marginBottom: Spacing.lg,
    },
    withdrawButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.sm,
      borderRadius: BorderRadius.lg,
    },
    withdrawText: {
      ...Typography.button,
      color: '#FFFFFF',
      fontSize: 14,
    },
    statsGrid: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: Spacing.lg,
      gap: Spacing.sm,
    },
    statItem: {
      flex: 1,
      padding: Spacing.md,
      borderRadius: BorderRadius.lg,
      alignItems: 'center',
      borderWidth: 1,
    },
    statValue: {
      ...Typography.h3,
      color: c.textPrimary,
      marginTop: 4,
    },
    statLabel: {
      ...Typography.small,
      color: c.textSecondary,
      marginTop: 2,
    },
    section: {
      marginBottom: Spacing.xl,
    },
    rankHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      marginBottom: Spacing.sm,
    },
    rankInfo: {
      flex: 1,
    },
    rankLabel: {
      ...Typography.caption,
      color: c.textSecondary,
      marginBottom: 2,
    },
    rankName: {
      ...Typography.subtitle,
      color: c.textPrimary,
      fontWeight: '700',
    },
    rankBadge: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    multiplierBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: BorderRadius.full,
      gap: 4,
    },
    multiplierText: {
      ...Typography.tiny,
      color: '#FFFFFF',
      fontWeight: '700',
    },
    progressBarBg: {
      height: 8,
      borderRadius: BorderRadius.full,
      overflow: 'hidden',
      marginBottom: 6,
    },
    progressBarFill: {
      height: '100%',
      borderRadius: BorderRadius.full,
    },
    nextRankText: {
      ...Typography.small,
      color: c.textTertiary,
      textAlign: 'right',
    },
    actionBanner: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: Spacing.md,
      borderRadius: BorderRadius.lg,
      borderWidth: 1,
      marginBottom: Spacing.xl,
    },
    iconBox: {
      width: 40,
      height: 40,
      borderRadius: BorderRadius.md,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: Spacing.md,
    },
    bannerContent: {
      flex: 1,
    },
    bannerTitle: {
      ...Typography.subtitle,
      color: c.textPrimary,
    },
    bannerSubtitle: {
      ...Typography.small,
      color: c.textSecondary,
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: Spacing.md,
    },
    sectionTitle: {
      ...Typography.h3,
      color: c.textPrimary,
    },
    sectionSubtitle: {
      ...Typography.caption,
      color: c.textTertiary,
    },
    progressCard: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: Spacing.lg,
      borderRadius: BorderRadius.lg,
      borderWidth: 1,
    },
    progressCircle: {
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: Spacing.lg,
    },
    progressPercent: {
      position: 'absolute',
      fontSize: 10,
      fontWeight: '700',
    },
    progressInfo: {
      flex: 1,
    },
    progressText: {
      ...Typography.bodyMedium,
      color: c.textSecondary,
      marginBottom: 4,
    },
    linkText: {
      ...Typography.button,
      fontSize: 14,
    },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: Spacing.md,
      borderRadius: BorderRadius.lg,
      marginBottom: Spacing.sm,
      borderWidth: 1,
    },
    menuIcon: {
      width: 36,
      height: 36,
      borderRadius: 18,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: Spacing.md,
    },
    menuText: {
      ...Typography.bodyMedium,
      color: c.textPrimary,
      flex: 1,
      fontWeight: '600',
    },
    menuBadge: {
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 4,
      marginRight: 8,
    },
    menuBadgeText: {
      ...Typography.tiny,
      fontWeight: '700',
    },
  });
