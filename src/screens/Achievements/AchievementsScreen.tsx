import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../../hooks/ThemeContext';
import { useAppSelector, useAppDispatch } from '../../hooks/useStore';
import { checkAchievements, unlockAchievement } from '../../store/slices/achievementSlice';
import { Achievement } from '../../types';
import { Typography, Spacing, BorderRadius } from '../../constants/theme';
import AnimatedCounter from '../../components/common/AnimatedCounter';

export default function AchievementsScreen() {
  const { theme } = useTheme();
  const c = theme.colors;
  const dispatch = useAppDispatch();
  const { achievements, totalAchievementCoins } = useAppSelector(state => state.achievements);
  const user = useAppSelector(state => state.user);
  const tasks = useAppSelector(state => state.tasks);

  useEffect(() => {
    // Run an achievement check on mount
    dispatch(checkAchievements({
      totalCoins: user.totalCoinsEarned,
      streak: tasks.longestStreak,
      tasksCompleted: 0, // Simplified for this check
      totalTasks: 4,
      hasSpun: false,
      hasShared: false,
      hasWithdrawn: user.withdrawnAmount > 0,
    }));
  }, [dispatch, user, tasks]);

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const progressPercent = (unlockedCount / achievements.length) * 100;

  const renderItem = ({ item }: { item: Achievement }) => {
    return (
      <View style={[styles.card, item.unlocked && styles.cardUnlocked]}>
        <View style={[styles.iconBox, { backgroundColor: item.unlocked ? c.accentGold : c.shimmer }]}>
          <Icon 
            name={item.icon} 
            size={24} 
            color={item.unlocked ? '#1A1A2E' : c.textTertiary} 
          />
        </View>
        <View style={styles.cardContent}>
          <Text style={[styles.cardTitle, !item.unlocked && { color: c.textSecondary }]}>
            {item.title}
          </Text>
          <Text style={styles.cardDesc}>{item.description}</Text>
        </View>
        <View style={styles.rewardBadge}>
          <Text style={styles.rewardText}>+{item.reward}</Text>
          {item.unlocked && <Icon name="check-circle" size={14} color={c.success} style={{ marginLeft: 4 }} />}
        </View>
      </View>
    );
  };

  const styles = createStyles(c);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.statsRow}>
          <View>
            <Text style={styles.headerTitle}>Achievements</Text>
            <Text style={styles.headerSubtitle}>{unlockedCount}/{achievements.length} Unlocked</Text>
          </View>
          <View style={styles.totalBadge}>
            <Text style={styles.totalBadgeLabel}>Total Bonus</Text>
            <AnimatedCounter 
              value={totalAchievementCoins} 
              style={styles.totalBadgeValue} 
              prefix="+" 
              suffix=" RBX" 
            />
          </View>
        </View>
        <View style={styles.progressBg}>
          <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
        </View>
      </View>

      <FlatList
        data={achievements}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const createStyles = (c: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: c.background,
    },
    header: {
      padding: Spacing.xl,
      backgroundColor: c.card,
      borderBottomWidth: 1,
      borderBottomColor: c.border,
    },
    statsRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: Spacing.lg,
    },
    headerTitle: {
      ...Typography.h2,
      color: c.textPrimary,
    },
    headerSubtitle: {
      ...Typography.body,
      color: c.textSecondary,
    },
    totalBadge: {
      alignItems: 'flex-end',
    },
    totalBadgeLabel: {
      ...Typography.small,
      color: c.textTertiary,
    },
    totalBadgeValue: {
      ...Typography.h3,
      color: c.accentGold,
    },
    progressBg: {
      height: 6,
      backgroundColor: c.shimmer,
      borderRadius: BorderRadius.full,
      overflow: 'hidden',
    },
    progressFill: {
      height: '100%',
      backgroundColor: c.success,
      borderRadius: BorderRadius.full,
    },
    listContent: {
      padding: Spacing.xl,
      paddingBottom: 40,
    },
    card: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: c.card,
      marginBottom: Spacing.md,
      padding: Spacing.md,
      borderRadius: BorderRadius.lg,
      borderWidth: 1,
      borderColor: c.border,
      opacity: 0.8,
    },
    cardUnlocked: {
      backgroundColor: c.card,
      borderColor: c.accentGold,
      opacity: 1,
      elevation: 2,
    },
    iconBox: {
      width: 48,
      height: 48,
      borderRadius: BorderRadius.md,
      justifyContent: 'center',
      alignItems: 'center',
    },
    cardContent: {
      flex: 1,
      marginLeft: Spacing.md,
    },
    cardTitle: {
      ...Typography.subtitle,
      color: c.textPrimary,
    },
    cardDesc: {
      ...Typography.caption,
      color: c.textSecondary,
    },
    rewardBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: c.primary + '15',
      paddingHorizontal: Spacing.sm,
      paddingVertical: 4,
      borderRadius: BorderRadius.full,
    },
    rewardText: {
      ...Typography.small,
      color: c.primary,
      fontWeight: '700',
    },
  });
