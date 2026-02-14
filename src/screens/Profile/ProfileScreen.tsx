import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Switch,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTheme } from '../../hooks/ThemeContext';
import { useAppSelector, useAppDispatch } from '../../hooks/useStore';
import { withdrawCoins } from '../../store/slices/userSlice';
import { addTransaction } from '../../store/slices/transactionSlice';
import { RootStackParamList } from '../../types';
import { Typography, Spacing, BorderRadius } from '../../constants/theme';
import CoinIcon from '../../components/common/CoinIcon';

type NavProp = StackNavigationProp<RootStackParamList>;

export default function ProfileScreen() {
  const { theme, isDark, toggleTheme } = useTheme();
  const c = theme.colors;
  const navigation = useNavigation<NavProp>();
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.user);
  const tasks = useAppSelector(state => state.tasks);

  const dollarBalance = (user.currentBalance / 1000).toFixed(2);
  const withdrawableDollars = Math.floor(user.currentBalance / 1000);
  const coinsNeededForNext = 1000 - (user.currentBalance % 1000);

  const handleWithdraw = () => {
    if (withdrawableDollars < 1) {
      Alert.alert(
        'Insufficient Balance',
        `You need at least 1,000 RBX to withdraw. You need ${coinsNeededForNext} more coins.`,
      );
      return;
    }
    Alert.alert(
      'Withdraw Funds',
      `Withdraw $${withdrawableDollars}.00 (${withdrawableDollars * 1000} RBX)?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Withdraw',
          onPress: () => {
            const coinsToWithdraw = withdrawableDollars * 1000;
            dispatch(withdrawCoins(coinsToWithdraw));
            dispatch(
              addTransaction({
                type: 'withdrawal',
                amount: -coinsToWithdraw,
                description: `Withdrawal of $${withdrawableDollars}.00`,
                balanceAfter: user.currentBalance - coinsToWithdraw,
              }),
            );
            Alert.alert('Success', `$${withdrawableDollars}.00 has been withdrawn!`);
          },
        },
      ],
    );
  };

  const styles = createStyles(c);

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle={theme.dark ? 'light-content' : 'dark-content'}
        backgroundColor={c.background}
      />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>

        {/* Profile Card */}
        <TouchableOpacity
          style={styles.profileCard}
          onPress={() => navigation.navigate('EditProfile')}
          activeOpacity={0.7}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarEmoji}>{user.avatarEmoji}</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{user.username}</Text>
            <Text style={styles.profileSince}>
              Member since {new Date(user.createdAt).toLocaleDateString('en', { month: 'short', year: 'numeric' })}
            </Text>
          </View>
          <Icon name="pencil" size={20} color={c.textTertiary} />
        </TouchableOpacity>

        {/* Balance Section */}
        <View style={styles.sectionLabel}>
          <Text style={styles.sectionTitle}>Wallet</Text>
        </View>
        <View style={styles.walletCard}>
          <View style={styles.walletRow}>
            <View style={styles.walletItem}>
              <Text style={styles.walletLabel}>RBX Balance</Text>
              <View style={[styles.walletValue, { flexDirection: 'row', alignItems: 'center' }]}>
                <CoinIcon size={20} style={{ marginRight: 6 }} />
                <Text style={styles.walletValue}>{user.currentBalance.toLocaleString()}</Text>
              </View>
            </View>
            <View style={styles.walletDivider} />
            <View style={styles.walletItem}>
              <Text style={styles.walletLabel}>Dollar Value</Text>
              <Text style={styles.walletValue}>${dollarBalance}</Text>
            </View>
          </View>
          <View style={styles.progressSection}>
            <View style={styles.progressLabelRow}>
              <Text style={styles.progressLabel}>
                Next withdrawal in {coinsNeededForNext} RBX
              </Text>
              <Text style={styles.progressPercent}>
                {Math.round(((1000 - coinsNeededForNext) / 1000) * 100)}%
              </Text>
            </View>
            <View style={styles.progressBg}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${((1000 - coinsNeededForNext) / 1000) * 100}%` },
                ]}
              />
            </View>
          </View>
          <TouchableOpacity
            style={[
              styles.withdrawButton,
              withdrawableDollars < 1 && styles.withdrawButtonDisabled,
            ]}
            onPress={handleWithdraw}
            activeOpacity={0.8}>
            <Icon name="bank-transfer-out" size={20} color={withdrawableDollars >= 1 ? '#FFFFFF' : c.textTertiary} />
            <Text style={[styles.withdrawText, withdrawableDollars < 1 && { color: c.textTertiary }]}>
              Withdraw ${withdrawableDollars}.00
            </Text>
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={styles.sectionLabel}>
          <Text style={styles.sectionTitle}>Statistics</Text>
        </View>
        <View style={styles.statsCard}>
          <View style={styles.statRow}>
            <Icon name="coin" size={22} color={c.accentGold} />
            <Text style={styles.statLabel}>Total Earned</Text>
            <Text style={styles.statValue}>{user.totalCoinsEarned.toLocaleString()} RBX</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statRow}>
            <Icon name="cash" size={22} color={c.success} />
            <Text style={styles.statLabel}>Total Withdrawn</Text>
            <Text style={styles.statValue}>${user.withdrawnAmount.toFixed(2)}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statRow}>
            <Icon name="fire" size={22} color={c.accentOrange} />
            <Text style={styles.statLabel}>Check-in Streak</Text>
            <Text style={styles.statValue}>{tasks.checkinStreak} days</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statRow}>
            <Icon name="trophy" size={22} color={c.primary} />
            <Text style={styles.statLabel}>Best Streak</Text>
            <Text style={styles.statValue}>{tasks.longestStreak} days</Text>
          </View>
        </View>

        {/* Settings */}
        <View style={styles.sectionLabel}>
          <Text style={styles.sectionTitle}>Settings</Text>
        </View>
        <View style={styles.settingsCard}>
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Icon name={isDark ? 'weather-night' : 'weather-sunny'} size={22} color={c.primary} />
              <Text style={styles.settingLabel}>Dark Mode</Text>
            </View>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: c.shimmer, true: c.primary + '60' }}
              thumbColor={isDark ? c.primary : '#f4f3f4'}
            />
          </View>

        </View>

        {/* Legal & Support */}
        <View style={styles.sectionLabel}>
          <Text style={styles.sectionTitle}>Support</Text>
        </View>
        <View style={styles.settingsCard}>
          <TouchableOpacity 
            style={[styles.settingRow, { paddingVertical: Spacing.sm }]}
            onPress={() => navigation.navigate('FAQ')}
          >
            <View style={styles.settingLeft}>
              <Icon name="help-circle-outline" size={22} color={c.info} />
              <Text style={styles.settingLabel}>Help & FAQ</Text>
            </View>
            <Icon name="chevron-right" size={20} color={c.textTertiary} />
          </TouchableOpacity>
          <View style={styles.statDivider} />
          <TouchableOpacity 
            style={[styles.settingRow, { paddingVertical: Spacing.sm }]}
            onPress={() => navigation.navigate('PrivacyPolicy')}
          >
            <View style={styles.settingLeft}>
              <Icon name="shield-check-outline" size={22} color={c.success} />
              <Text style={styles.settingLabel}>Privacy Policy</Text>
            </View>
            <Icon name="chevron-right" size={20} color={c.textTertiary} />
          </TouchableOpacity>
          <View style={styles.statDivider} />
          <TouchableOpacity 
            style={[styles.settingRow, { paddingVertical: Spacing.sm }]}
            onPress={() => navigation.navigate('Terms')}
          >
            <View style={styles.settingLeft}>
              <Icon name="file-document-outline" size={22} color={c.warning} />
              <Text style={styles.settingLabel}>Terms of Service</Text>
            </View>
            <Icon name="chevron-right" size={20} color={c.textTertiary} />
          </TouchableOpacity>
        </View>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appVersion}>RBX Task Master v1.0.0</Text>
          <Text style={styles.appCopyright}>1,000 RBX = $1.00 USD</Text>
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
    profileCard: {
      flexDirection: 'row',
      alignItems: 'center',
      marginHorizontal: Spacing.xl,
      backgroundColor: c.card,
      padding: Spacing.lg,
      borderRadius: BorderRadius.lg,
      borderWidth: 1,
      borderColor: c.border,
    },
    avatarContainer: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: c.primary + '18',
      justifyContent: 'center',
      alignItems: 'center',
    },
    avatarEmoji: {
      fontSize: 28,
    },
    profileInfo: {
      flex: 1,
      marginLeft: Spacing.lg,
    },
    profileName: {
      ...Typography.h3,
      color: c.textPrimary,
    },
    profileSince: {
      ...Typography.caption,
      color: c.textTertiary,
      marginTop: 2,
    },
    sectionLabel: {
      paddingHorizontal: Spacing.xl,
      marginTop: Spacing.xl,
      marginBottom: Spacing.md,
    },
    sectionTitle: {
      ...Typography.subtitle,
      color: c.textSecondary,
      textTransform: 'uppercase',
      letterSpacing: 1,
      fontSize: 12,
    },
    walletCard: {
      marginHorizontal: Spacing.xl,
      backgroundColor: c.card,
      padding: Spacing.lg,
      borderRadius: BorderRadius.lg,
      borderWidth: 1,
      borderColor: c.border,
    },
    walletRow: {
      flexDirection: 'row',
    },
    walletItem: {
      flex: 1,
      alignItems: 'center',
    },
    walletLabel: {
      ...Typography.caption,
      color: c.textTertiary,
    },
    walletValue: {
      ...Typography.h3,
      color: c.textPrimary,
      marginTop: 4,
    },
    walletDivider: {
      width: 1,
      backgroundColor: c.border,
    },
    progressSection: {
      marginTop: Spacing.lg,
      paddingTop: Spacing.lg,
      borderTopWidth: 1,
      borderTopColor: c.borderLight,
    },
    progressLabelRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: Spacing.sm,
    },
    progressLabel: {
      ...Typography.caption,
      color: c.textSecondary,
    },
    progressPercent: {
      ...Typography.caption,
      color: c.primary,
      fontWeight: '600',
    },
    progressBg: {
      height: 6,
      backgroundColor: c.shimmer,
      borderRadius: BorderRadius.full,
      overflow: 'hidden',
    },
    progressFill: {
      height: '100%',
      backgroundColor: c.primary,
      borderRadius: BorderRadius.full,
    },
    withdrawButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: c.primary,
      paddingVertical: Spacing.md,
      borderRadius: BorderRadius.lg,
      gap: 8,
      marginTop: Spacing.lg,
    },
    withdrawButtonDisabled: {
      backgroundColor: c.shimmer,
    },
    withdrawText: {
      ...Typography.button,
      color: '#FFFFFF',
    },
    statsCard: {
      marginHorizontal: Spacing.xl,
      backgroundColor: c.card,
      padding: Spacing.lg,
      borderRadius: BorderRadius.lg,
      borderWidth: 1,
      borderColor: c.border,
    },
    statRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: Spacing.md,
      gap: Spacing.md,
    },
    statLabel: {
      ...Typography.body,
      color: c.textSecondary,
      flex: 1,
    },
    statValue: {
      ...Typography.subtitle,
      color: c.textPrimary,
    },
    statDivider: {
      height: 1,
      backgroundColor: c.borderLight,
    },
    settingsCard: {
      marginHorizontal: Spacing.xl,
      backgroundColor: c.card,
      padding: Spacing.lg,
      borderRadius: BorderRadius.lg,
      borderWidth: 1,
      borderColor: c.border,
    },
    settingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    settingLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.md,
    },
    settingLabel: {
      ...Typography.body,
      color: c.textPrimary,
    },
    appInfo: {
      alignItems: 'center',
      marginTop: Spacing.xxxl,
    },
    appVersion: {
      ...Typography.caption,
      color: c.textTertiary,
    },
    appCopyright: {
      ...Typography.small,
      color: c.textTertiary,
      marginTop: 4,
    },
  });
