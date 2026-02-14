import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../../hooks/ThemeContext';
import { useAppSelector } from '../../hooks/useStore';
import { Transaction, TransactionType } from '../../types';
import { Typography, Spacing, BorderRadius } from '../../constants/theme';
import CoinIcon from '../../components/common/CoinIcon';

const FILTER_OPTIONS: { label: string; value: TransactionType | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Video', value: 'watch_video' },
  { label: 'Check-in', value: 'daily_checkin' },
  { label: 'Spin', value: 'spin_wheel' },
  { label: 'Share', value: 'share_app' },
];

export default function HistoryScreen() {
  const { theme } = useTheme();
  const c = theme.colors;
  const transactions = useAppSelector(state => state.transactions.transactions);
  const [filter, setFilter] = useState<TransactionType | 'all'>('all');

  const filteredTransactions = useMemo(() => {
    if (filter === 'all') return transactions;
    return transactions.filter(t => t.type === filter);
  }, [transactions, filter]);

  // Calculate earnings by day for a simple bar chart
  const last7DaysData = useMemo(() => {
    const days: { date: string; shortDate: string; amount: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const shortDate = d.toLocaleDateString('en', { weekday: 'short' });
      const dayTotal = transactions
        .filter(t => t.timestamp.startsWith(dateStr) && t.amount > 0)
        .reduce((sum, t) => sum + t.amount, 0);
      days.push({ date: dateStr, shortDate, amount: dayTotal });
    }
    return days;
  }, [transactions]);

  const maxDayAmount = Math.max(...last7DaysData.map(d => d.amount), 1);

  const totalEarned = transactions
    .filter(t => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);

  const styles = createStyles(c);

  const getTransactionIcon = (type: TransactionType) => {
    switch (type) {
      case 'watch_video': return 'play-circle';
      case 'daily_checkin': return 'calendar-check';
      case 'spin_wheel': return 'tire';
      case 'share_app': return 'share-variant';
      case 'withdrawal': return 'bank-transfer-out';
      default: return 'coin';
    }
  };

  const getTransactionColor = (type: TransactionType) => {
    switch (type) {
      case 'watch_video': return '#FF6B6B';
      case 'daily_checkin': return c.primary;
      case 'spin_wheel': return '#9B59B6';
      case 'share_app': return '#3B82F6';
      case 'withdrawal': return c.error;
      default: return c.textSecondary;
    }
  };

  const renderTransaction = ({ item }: { item: Transaction }) => {
    const txColor = getTransactionColor(item.type);
    const date = new Date(item.timestamp);
    const timeStr = date.toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' });
    const dateStr = date.toLocaleDateString('en', { month: 'short', day: 'numeric' });

    return (
      <View style={styles.txCard}>
        <View style={[styles.txIcon, { backgroundColor: txColor + '18' }]}>
          <Icon name={getTransactionIcon(item.type)} size={22} color={txColor} />
        </View>
        <View style={styles.txContent}>
          <Text style={styles.txDescription}>{item.description}</Text>
          <Text style={styles.txTime}>{dateStr} • {timeStr}</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={[styles.txAmount, { color: item.amount > 0 ? c.success : c.error }]}>
            {item.amount > 0 ? '+' : ''}{item.amount}
          </Text>
          <CoinIcon size={14} style={{ marginLeft: 4 }} />
        </View>
      </View>
    );
  };

  const ListHeader = () => (
    <>
      {/* Chart Section */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Earnings & History</Text>
        <Text style={styles.headerSubtitle}>Track your RBX coin activity</Text>
      </View>

      {/* 7-Day Chart */}
      <View style={styles.chartCard}>
        <View style={styles.chartHeader}>
          <Text style={styles.chartTitle}>Last 7 Days</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.chartTotal}>Total: {totalEarned}</Text>
            <CoinIcon size={14} style={{ marginLeft: 4 }} />
          </View>
        </View>
        <View style={styles.chartContainer}>
          {last7DaysData.map((day, i) => (
            <View key={i} style={styles.barColumn}>
              <Text style={styles.barValue}>
                {day.amount > 0 ? day.amount : ''}
              </Text>
              <View style={styles.barBg}>
                <View
                  style={[
                    styles.barFill,
                    {
                      height: `${(day.amount / maxDayAmount) * 100}%`,
                      backgroundColor:
                        day.date === new Date().toISOString().split('T')[0]
                          ? c.primary
                          : c.primary + '60',
                    },
                  ]}
                />
              </View>
              <Text
                style={[
                  styles.barLabel,
                  day.date === new Date().toISOString().split('T')[0] && {
                    color: c.primary,
                    fontWeight: '700',
                  },
                ]}>
                {day.shortDate}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Filters */}
      <View style={styles.filterRow}>
        {FILTER_OPTIONS.map(opt => (
          <TouchableOpacity
            key={opt.value}
            style={[
              styles.filterChip,
              filter === opt.value && styles.filterChipActive,
            ]}
            onPress={() => setFilter(opt.value)}
            activeOpacity={0.7}>
            <Text
              style={[
                styles.filterChipText,
                filter === opt.value && styles.filterChipTextActive,
              ]}>
              {opt.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.listTitle}>
        {filter === 'all' ? 'All Transactions' : `${FILTER_OPTIONS.find(o => o.value === filter)?.label} Transactions`}
        {' '}({filteredTransactions.length})
      </Text>
    </>
  );

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle={theme.dark ? 'light-content' : 'dark-content'}
        backgroundColor={c.background}
      />
      <FlatList
        data={filteredTransactions}
        keyExtractor={item => item.id}
        renderItem={renderTransaction}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="history" size={48} color={c.textTertiary} />
            <Text style={styles.emptyText}>No transactions yet</Text>
            <Text style={styles.emptySubtext}>Complete tasks to start earning RBX coins!</Text>
          </View>
        }
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
    listContent: {
      paddingBottom: 30,
    },
    header: {
      paddingHorizontal: Spacing.xl,
      paddingTop: Spacing.xxxl + 16,
      paddingBottom: Spacing.lg,
    },
    headerTitle: {
      ...Typography.h1,
      color: c.textPrimary,
    },
    headerSubtitle: {
      ...Typography.body,
      color: c.textSecondary,
      marginTop: 4,
    },
    chartCard: {
      marginHorizontal: Spacing.xl,
      backgroundColor: c.card,
      padding: Spacing.lg,
      borderRadius: BorderRadius.lg,
      marginBottom: Spacing.lg,
      borderWidth: 1,
      borderColor: c.border,
    },
    chartHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: Spacing.lg,
    },
    chartTitle: {
      ...Typography.subtitle,
      color: c.textPrimary,
    },
    chartTotal: {
      ...Typography.bodyMedium,
      color: c.primary,
    },
    chartContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      height: 120,
    },
    barColumn: {
      flex: 1,
      alignItems: 'center',
    },
    barValue: {
      ...Typography.small,
      color: c.textSecondary,
      marginBottom: 4,
      height: 14,
    },
    barBg: {
      width: 24,
      height: 80,
      backgroundColor: c.shimmer,
      borderRadius: BorderRadius.sm,
      justifyContent: 'flex-end',
      overflow: 'hidden',
    },
    barFill: {
      width: '100%',
      borderRadius: BorderRadius.sm,
      minHeight: 2,
    },
    barLabel: {
      ...Typography.small,
      color: c.textTertiary,
      marginTop: 6,
    },
    filterRow: {
      flexDirection: 'row',
      paddingHorizontal: Spacing.xl,
      marginBottom: Spacing.lg,
      gap: Spacing.sm,
    },
    filterChip: {
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.sm,
      borderRadius: BorderRadius.full,
      backgroundColor: c.card,
      borderWidth: 1,
      borderColor: c.border,
    },
    filterChipActive: {
      backgroundColor: c.primary,
      borderColor: c.primary,
    },
    filterChipText: {
      ...Typography.small,
      color: c.textSecondary,
    },
    filterChipTextActive: {
      color: '#FFFFFF',
    },
    listTitle: {
      ...Typography.subtitle,
      color: c.textPrimary,
      paddingHorizontal: Spacing.xl,
      marginBottom: Spacing.md,
    },
    txCard: {
      flexDirection: 'row',
      alignItems: 'center',
      marginHorizontal: Spacing.xl,
      backgroundColor: c.card,
      padding: Spacing.lg,
      borderRadius: BorderRadius.lg,
      marginBottom: Spacing.sm,
      borderWidth: 1,
      borderColor: c.border,
    },
    txIcon: {
      width: 42,
      height: 42,
      borderRadius: BorderRadius.md,
      justifyContent: 'center',
      alignItems: 'center',
    },
    txContent: {
      flex: 1,
      marginLeft: Spacing.md,
    },
    txDescription: {
      ...Typography.bodyMedium,
      color: c.textPrimary,
    },
    txTime: {
      ...Typography.caption,
      color: c.textTertiary,
      marginTop: 2,
    },
    txAmount: {
      ...Typography.subtitle,
    },
    emptyContainer: {
      alignItems: 'center',
      paddingVertical: Spacing.xxxl * 2,
    },
    emptyText: {
      ...Typography.h3,
      color: c.textSecondary,
      marginTop: Spacing.lg,
    },
    emptySubtext: {
      ...Typography.body,
      color: c.textTertiary,
      marginTop: Spacing.xs,
    },
  });
