import React, { useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  Animated,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../../hooks/ThemeContext';
import { useAppSelector, useAppDispatch } from '../../hooks/useStore';
import { checkAndResetDailyTasks } from '../../store/slices/taskSlice';
import { Typography, Spacing, BorderRadius } from '../../constants/theme';

export default function HomeScreen() {
  const { theme } = useTheme();
  const c = theme.colors;
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.user);
  const tasks = useAppSelector(state => state.tasks);
  const transactions = useAppSelector(state => state.transactions);

  const fadeAnim = useMemo(() => new Animated.Value(0), []);
  const slideAnim = useMemo(() => new Animated.Value(30), []);

  useEffect(() => {
    dispatch(checkAndResetDailyTasks());
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
  }, [dispatch, fadeAnim, slideAnim]);

  const completedTasks = tasks.tasks.filter(t => t.claimed).length;
  const totalTasks = tasks.tasks.length;
  const progressPercent = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  const dollarValue = (user.currentBalance / 1000).toFixed(2);
  const todayEarnings = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return transactions.transactions
      .filter(t => t.timestamp.startsWith(today) && t.amount > 0)
      .reduce((sum, t) => sum + t.amount, 0);
  }, [transactions.transactions]);

  const styles = createStyles(c);

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle={theme.dark ? 'light-content' : 'dark-content'}
        backgroundColor={c.background}
      />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>Welcome back,</Text>
              <Text style={styles.username}>{user.username} {user.avatarEmoji}</Text>
            </View>
            <View style={styles.streakBadge}>
              <Icon name="fire" size={18} color={c.accentOrange} />
              <Text style={styles.streakText}>{tasks.checkinStreak}</Text>
            </View>
          </View>

          {/* Balance Card */}
          <View style={styles.balanceCard}>
            <View style={styles.balanceGradient}>
              <Text style={styles.balanceLabel}>Your RBX Balance</Text>
              <View style={styles.balanceRow}>
                <Text style={styles.coinIcon}>🪙</Text>
                <Text style={styles.balanceAmount}>
                  {user.currentBalance.toLocaleString()}
                </Text>
                <Text style={styles.balanceCurrency}>RBX</Text>
              </View>
              <View style={styles.dollarRow}>
                <Icon name="approximately-equal" size={16} color="rgba(255,255,255,0.8)" />
                <Text style={styles.dollarValue}>${dollarValue} USD</Text>
              </View>
              <View style={styles.balanceDivider} />
              <View style={styles.balanceStats}>
                <View style={styles.balanceStat}>
                  <Text style={styles.balanceStatLabel}>Total Earned</Text>
                  <Text style={styles.balanceStatValue}>
                    {user.totalCoinsEarned.toLocaleString()}
                  </Text>
                </View>
                <View style={styles.balanceStatDivider} />
                <View style={styles.balanceStat}>
                  <Text style={styles.balanceStatLabel}>Withdrawn</Text>
                  <Text style={styles.balanceStatValue}>
                    ${user.withdrawnAmount.toFixed(2)}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Conversion Info */}
          <View style={styles.conversionCard}>
            <Icon name="swap-horizontal" size={20} color={c.primary} />
            <Text style={styles.conversionText}>
              1,000 RBX = $1.00 USD
            </Text>
            <View style={styles.conversionBadge}>
              <Text style={styles.conversionBadgeText}>
                {Math.floor(user.currentBalance / 1000)} withdrawable
              </Text>
            </View>
          </View>

          {/* Daily Progress */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Today's Progress</Text>
            <Text style={styles.sectionSubtitle}>
              {completedTasks}/{totalTasks} tasks
            </Text>
          </View>
          <View style={styles.progressCard}>
            <View style={styles.progressBarBg}>
              <View
                style={[
                  styles.progressBarFill,
                  { width: `${progressPercent}%` },
                ]}
              />
            </View>
            <View style={styles.progressDetails}>
              <View style={styles.progressItem}>
                <Icon name="check-circle" size={18} color={c.success} />
                <Text style={styles.progressItemText}>
                  {completedTasks} Completed
                </Text>
              </View>
              <View style={styles.progressItem}>
                <Icon name="clock-outline" size={18} color={c.warning} />
                <Text style={styles.progressItemText}>
                  {totalTasks - completedTasks} Remaining
                </Text>
              </View>
            </View>
            <View style={styles.todayEarningsRow}>
              <Text style={styles.todayEarningsLabel}>Today's Earnings</Text>
              <Text style={styles.todayEarningsValue}>+{todayEarnings} RBX</Text>
            </View>
          </View>

          {/* Quick Stats */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Quick Stats</Text>
          </View>
          <View style={styles.statsGrid}>
            <View style={[styles.statCard, { borderLeftColor: c.primary }]}>
              <Icon name="calendar-check" size={24} color={c.primary} />
              <Text style={styles.statValue}>{tasks.checkinStreak}</Text>
              <Text style={styles.statLabel}>Day Streak</Text>
            </View>
            <View style={[styles.statCard, { borderLeftColor: c.accentOrange }]}>
              <Icon name="trophy" size={24} color={c.accentOrange} />
              <Text style={styles.statValue}>{tasks.longestStreak}</Text>
              <Text style={styles.statLabel}>Best Streak</Text>
            </View>
            <View style={[styles.statCard, { borderLeftColor: c.accentGold }]}>
              <Icon name="history" size={24} color={c.accentGold} />
              <Text style={styles.statValue}>
                {transactions.transactions.length}
              </Text>
              <Text style={styles.statLabel}>Transactions</Text>
            </View>
          </View>
        </Animated.View>
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
      paddingBottom: 30,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: Spacing.xl,
      paddingTop: Spacing.xxxl + 16,
      paddingBottom: Spacing.lg,
    },
    greeting: {
      ...Typography.body,
      color: c.textSecondary,
    },
    username: {
      ...Typography.h2,
      color: c.textPrimary,
      marginTop: 2,
    },
    streakBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: c.cardElevated,
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.sm,
      borderRadius: BorderRadius.full,
      gap: 4,
    },
    streakText: {
      ...Typography.subtitle,
      color: c.accentOrange,
    },
    balanceCard: {
      marginHorizontal: Spacing.xl,
      borderRadius: BorderRadius.xl,
      overflow: 'hidden',
      marginBottom: Spacing.lg,
    },
    balanceGradient: {
      backgroundColor: c.primary,
      padding: Spacing.xl,
      borderRadius: BorderRadius.xl,
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
      marginTop: Spacing.sm,
      gap: 8,
    },
    coinIcon: {
      fontSize: 32,
    },
    balanceAmount: {
      ...Typography.coinLarge,
      color: '#FFFFFF',
    },
    balanceCurrency: {
      ...Typography.subtitle,
      color: 'rgba(255,255,255,0.7)',
      marginTop: 8,
    },
    dollarRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 4,
      gap: 4,
    },
    dollarValue: {
      ...Typography.body,
      color: 'rgba(255,255,255,0.8)',
    },
    balanceDivider: {
      height: 1,
      backgroundColor: 'rgba(255,255,255,0.2)',
      marginVertical: Spacing.lg,
    },
    balanceStats: {
      flexDirection: 'row',
      justifyContent: 'space-around',
    },
    balanceStat: {
      alignItems: 'center',
    },
    balanceStatLabel: {
      ...Typography.caption,
      color: 'rgba(255,255,255,0.7)',
    },
    balanceStatValue: {
      ...Typography.subtitle,
      color: '#FFFFFF',
      marginTop: 2,
    },
    balanceStatDivider: {
      width: 1,
      backgroundColor: 'rgba(255,255,255,0.2)',
    },
    conversionCard: {
      flexDirection: 'row',
      alignItems: 'center',
      marginHorizontal: Spacing.xl,
      backgroundColor: c.card,
      padding: Spacing.lg,
      borderRadius: BorderRadius.lg,
      marginBottom: Spacing.xl,
      gap: 10,
      borderWidth: 1,
      borderColor: c.border,
    },
    conversionText: {
      ...Typography.bodyMedium,
      color: c.textPrimary,
      flex: 1,
    },
    conversionBadge: {
      backgroundColor: c.primaryLight,
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.xs,
      borderRadius: BorderRadius.full,
    },
    conversionBadgeText: {
      ...Typography.small,
      color: c.primaryDark,
      fontWeight: '600',
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: Spacing.xl,
      marginBottom: Spacing.md,
    },
    sectionTitle: {
      ...Typography.h3,
      color: c.textPrimary,
    },
    sectionSubtitle: {
      ...Typography.bodyMedium,
      color: c.primary,
    },
    progressCard: {
      marginHorizontal: Spacing.xl,
      backgroundColor: c.card,
      padding: Spacing.lg,
      borderRadius: BorderRadius.lg,
      marginBottom: Spacing.xl,
      borderWidth: 1,
      borderColor: c.border,
    },
    progressBarBg: {
      height: 8,
      backgroundColor: c.shimmer,
      borderRadius: BorderRadius.full,
      overflow: 'hidden',
    },
    progressBarFill: {
      height: '100%',
      backgroundColor: c.primary,
      borderRadius: BorderRadius.full,
    },
    progressDetails: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: Spacing.md,
    },
    progressItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    progressItemText: {
      ...Typography.bodyMedium,
      color: c.textSecondary,
    },
    todayEarningsRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: Spacing.md,
      paddingTop: Spacing.md,
      borderTopWidth: 1,
      borderTopColor: c.borderLight,
    },
    todayEarningsLabel: {
      ...Typography.body,
      color: c.textSecondary,
    },
    todayEarningsValue: {
      ...Typography.subtitle,
      color: c.success,
    },
    statsGrid: {
      flexDirection: 'row',
      paddingHorizontal: Spacing.xl,
      gap: Spacing.md,
    },
    statCard: {
      flex: 1,
      backgroundColor: c.card,
      padding: Spacing.lg,
      borderRadius: BorderRadius.lg,
      alignItems: 'center',
      borderLeftWidth: 3,
      borderWidth: 1,
      borderColor: c.border,
      gap: 4,
    },
    statValue: {
      ...Typography.h3,
      color: c.textPrimary,
    },
    statLabel: {
      ...Typography.caption,
      color: c.textSecondary,
    },
  });
