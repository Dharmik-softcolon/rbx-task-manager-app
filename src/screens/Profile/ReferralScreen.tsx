import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Share,
  Alert,
  Clipboard
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../../hooks/ThemeContext';
import { useAppSelector } from '../../hooks/useStore';
import { Typography, Spacing, BorderRadius } from '../../constants/theme';

export default function ReferralScreen() {
  const { theme } = useTheme();
  const c = theme.colors;
  const user = useAppSelector(state => state.user);

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Join RBX Task Master and earn real rewards! Use my code ${user.referralCode} to get a 200 RBX bonus! 🚀💰`,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleCopy = () => {
    Clipboard.setString(user.referralCode);
    Alert.alert('Copied', 'Referral code copied to clipboard!');
  };

  const styles = createStyles(c);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.hero}>
        <Icon name="account-group" size={80} color={c.primary} />
        <Text style={styles.heroTitle}>Invite Friends</Text>
        <Text style={styles.heroSubtitle}>
          Earn 200 RBX for every friend who joins using your code!
        </Text>
      </View>

      <View style={styles.codeCard}>
        <Text style={styles.codeLabel}>Your Referral Code</Text>
        <View style={styles.codeBox}>
          <Text style={styles.codeText}>{user.referralCode}</Text>
          <TouchableOpacity onPress={handleCopy} style={styles.copyButton}>
            <Icon name="content-copy" size={20} color={c.primary} />
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity 
        style={styles.shareButton}
        onPress={handleShare}
        activeOpacity={0.8}
      >
        <Icon name="share-variant" size={20} color="#FFFFFF" />
        <Text style={styles.shareButtonText}>Share Code</Text>
      </TouchableOpacity>

      <View style={styles.statsCard}>
        <Text style={styles.statsTitle}>Your Referrals</Text>
        <View style={styles.statRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{user.referralCount}</Text>
            <Text style={styles.statLabel}>Friends Invited</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: c.accentGold }]}>
              {user.referralCount * 200}
            </Text>
            <Text style={styles.statLabel}>RBX Earned</Text>
          </View>
        </View>
      </View>

      <View style={styles.stepsCard}>
        <Text style={styles.stepsTitle}>How it works</Text>
        {[
          { icon: 'share', text: 'Share your unique code with friends' },
          { icon: 'account-plus', text: 'Friend enters code during signup' },
          { icon: 'gift', text: 'You both get 200 RBX instantly!' },
        ].map((step, i) => (
          <View key={i} style={styles.stepRow}>
            <View style={styles.stepIcon}>
              <Icon name={step.icon} size={18} color={c.textInverse} />
            </View>
            <Text style={styles.stepText}>{step.text}</Text>
          </View>
        ))}
      </View>
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
    hero: {
      alignItems: 'center',
      marginBottom: Spacing.xxxl,
      marginTop: Spacing.lg,
    },
    heroTitle: {
      ...Typography.h1,
      color: c.textPrimary,
      marginTop: Spacing.md,
    },
    heroSubtitle: {
      ...Typography.body,
      color: c.textSecondary,
      textAlign: 'center',
      marginTop: Spacing.sm,
      paddingHorizontal: Spacing.xl,
    },
    codeCard: {
      backgroundColor: c.card,
      padding: Spacing.lg,
      borderRadius: BorderRadius.lg,
      borderWidth: 1,
      borderColor: c.border,
      marginBottom: Spacing.lg,
    },
    codeLabel: {
      ...Typography.caption,
      color: c.textTertiary,
      textTransform: 'uppercase',
      letterSpacing: 1,
      marginBottom: Spacing.sm,
    },
    codeBox: {
      backgroundColor: c.inputBackground,
      borderRadius: BorderRadius.md,
      padding: Spacing.md,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderStyle: 'dashed',
      borderWidth: 1,
      borderColor: c.primary,
    },
    codeText: {
      ...Typography.h2,
      color: c.textPrimary,
      letterSpacing: 2,
    },
    copyButton: {
      padding: Spacing.sm,
    },
    shareButton: {
      backgroundColor: c.primary,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: Spacing.lg,
      borderRadius: BorderRadius.lg,
      gap: 10,
      marginBottom: Spacing.xxxl,
    },
    shareButtonText: {
      ...Typography.button,
      color: '#FFFFFF',
    },
    statsCard: {
      backgroundColor: c.card,
      padding: Spacing.lg,
      borderRadius: BorderRadius.lg,
      marginBottom: Spacing.lg,
      borderWidth: 1,
      borderColor: c.border,
    },
    statsTitle: {
      ...Typography.subtitle,
      color: c.textPrimary,
      marginBottom: Spacing.lg,
    },
    statRow: {
      flexDirection: 'row',
      justifyContent: 'space-around',
    },
    statItem: {
      alignItems: 'center',
    },
    statValue: {
      ...Typography.h2,
      color: c.textPrimary,
    },
    statLabel: {
      ...Typography.caption,
      color: c.textSecondary,
      marginTop: 2,
    },
    statDivider: {
      width: 1,
      backgroundColor: c.border,
    },
    stepsCard: {
      padding: Spacing.lg,
    },
    stepsTitle: {
      ...Typography.subtitle,
      color: c.textPrimary,
      marginBottom: Spacing.lg,
    },
    stepRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: Spacing.lg,
    },
    stepIcon: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: c.primary,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: Spacing.md,
    },
    stepText: {
      ...Typography.body,
      color: c.textSecondary,
      flex: 1,
    },
  });
