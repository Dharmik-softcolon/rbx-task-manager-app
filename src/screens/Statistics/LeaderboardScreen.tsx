import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../../hooks/ThemeContext';
import { useAppSelector } from '../../hooks/useStore';
import { LeaderboardEntry } from '../../types';
import { Typography, Spacing, BorderRadius } from '../../constants/theme';
import AnimatedCounter from '../../components/common/AnimatedCounter';

const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  { id: '2', username: 'CryptoKing', avatarEmoji: '👑', totalCoins: 58420, rank: 'diamond', isCurrentUser: false },
  { id: '3', username: 'RBX_Hunter', avatarEmoji: '🚀', totalCoins: 42100, rank: 'platinum', isCurrentUser: false },
  { id: '4', username: 'MoneyMaker', avatarEmoji: '💸', totalCoins: 28900, rank: 'platinum', isCurrentUser: false },
  { id: '5', username: 'TaskMaster', avatarEmoji: '🎯', totalCoins: 15600, rank: 'gold', isCurrentUser: false },
  { id: '6', username: 'LuckySpinner', avatarEmoji: '🎲', totalCoins: 12400, rank: 'gold', isCurrentUser: false },
  { id: '7', username: 'CoinCollector', avatarEmoji: '💰', totalCoins: 8900, rank: 'gold', isCurrentUser: false },
  { id: '8', username: 'EarlyBird', avatarEmoji: '🦅', totalCoins: 5200, rank: 'silver', isCurrentUser: false },
  { id: '9', username: 'GamerGirl', avatarEmoji: '👾', totalCoins: 3100, rank: 'silver', isCurrentUser: false },
] as LeaderboardEntry[];

export default function LeaderboardScreen() {
  const { theme } = useTheme();
  const c = theme.colors;
  const user = useAppSelector(state => state.user);
  
  // Inject current user into leaderboard and sort
  const allUsers: LeaderboardEntry[] = [
    ...MOCK_LEADERBOARD,
    {
      id: user.id,
      username: user.username,
      avatarEmoji: user.avatarEmoji,
      totalCoins: user.totalCoinsEarned,
      rank: 'rookie' as const, // Calculated dynamically in real app
      isCurrentUser: true,
    }
  ].sort((a, b) => b.totalCoins - a.totalCoins);

  const currentUserRank = allUsers.findIndex(u => u.isCurrentUser) + 1;

  const renderItem = ({ item, index }: { item: LeaderboardEntry; index: number }) => {
    const isTop3 = index < 3;
    const rankColor = index === 0 ? '#FFD700' : index === 1 ? '#C0C0C0' : index === 2 ? '#CD7F32' : c.textTertiary;
    
    return (
      <View style={[styles.item, item.isCurrentUser && styles.itemHighlight]}>
        <View style={styles.rankCol}>
          {isTop3 ? (
            <Icon name="medal" size={24} color={rankColor} />
          ) : (
            <Text style={styles.rankText}>{index + 1}</Text>
          )}
        </View>
        <Text style={styles.avatar}>{item.avatarEmoji}</Text>
        <View style={styles.infoCol}>
          <Text style={[styles.username, item.isCurrentUser && { color: c.primary, fontWeight: '700' }]}>
            {item.username}
          </Text>
        </View>
        <View style={styles.scoreCol}>
          <AnimatedCounter 
            value={item.totalCoins} 
            style={[styles.score, isTop3 ? { color: rankColor, fontWeight: '700' } : undefined]}
            suffix=" RBX"
          />
        </View>
      </View>
    );
  };

  const styles = createStyles(c);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Global Leaderboard</Text>
        <Text style={styles.headerSubtitle}>Top earners this week</Text>
      </View>

      <View style={styles.currentUserBar}>
        <View>
          <Text style={styles.currentUserLabel}>Your Rank</Text>
          <Text style={styles.currentUserRank}>#{currentUserRank}</Text>
        </View>
        <View style={styles.divider} />
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={styles.currentUserLabel}>Your Earnings</Text>
          <Text style={styles.currentUserScore}>{user.totalCoinsEarned.toLocaleString()} RBX</Text>
        </View>
      </View>

      <FlatList
        data={allUsers}
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
      backgroundColor: c.primary,
      paddingBottom: Spacing.xxxl * 1.5,
      paddingTop: Spacing.xxl,
    },
    headerTitle: {
      ...Typography.h1,
      color: '#FFFFFF',
      textAlign: 'center',
    },
    headerSubtitle: {
      ...Typography.body,
      color: 'rgba(255,255,255,0.8)',
      textAlign: 'center',
      marginTop: 4,
    },
    currentUserBar: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: c.card,
      marginHorizontal: Spacing.lg,
      marginTop: -Spacing.xxl,
      padding: Spacing.lg,
      borderRadius: BorderRadius.lg,
      elevation: 6,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      marginBottom: Spacing.md,
    },
    currentUserLabel: {
      ...Typography.caption,
      color: c.textSecondary,
      textTransform: 'uppercase',
    },
    currentUserRank: {
      ...Typography.h2,
      color: c.textPrimary,
    },
    currentUserScore: {
      ...Typography.h3,
      color: c.accentGold,
    },
    divider: {
      width: 1,
      height: 40,
      backgroundColor: c.border,
    },
    listContent: {
      paddingHorizontal: Spacing.lg,
      paddingBottom: 40,
    },
    item: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: c.card,
      marginBottom: Spacing.sm,
      padding: Spacing.md,
      borderRadius: BorderRadius.lg,
      borderWidth: 1,
      borderColor: c.border,
    },
    itemHighlight: {
      borderColor: c.primary,
      backgroundColor: c.primary + '05',
    },
    rankCol: {
      width: 40,
      alignItems: 'center',
    },
    rankText: {
      ...Typography.h3,
      color: c.textTertiary,
    },
    avatar: {
      fontSize: 24,
      marginHorizontal: Spacing.sm,
    },
    infoCol: {
      flex: 1,
      marginLeft: Spacing.xs,
    },
    username: {
      ...Typography.bodyMedium,
      color: c.textPrimary,
    },
    scoreCol: {
      alignItems: 'flex-end',
    },
    score: {
      ...Typography.subtitle,
      color: c.textSecondary,
    },
  });
