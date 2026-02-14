import React from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar } from 'react-native';
import { useTheme } from '../../hooks/ThemeContext';
import { Typography, Spacing } from '../../constants/theme';

export default function TermsScreen() {
  const { theme } = useTheme();
  const c = theme.colors;
  const styles = createStyles(c);

  return (
    <View style={styles.container}>
      <StatusBar barStyle={theme.dark ? 'light-content' : 'dark-content'} backgroundColor={c.background} />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Terms of Service</Text>
        <Text style={styles.date}>Last updated: {new Date().toLocaleDateString()}</Text>

        <Section title="1. Acceptance of Terms">
          By accessing or using RBX Task Master, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this app.
        </Section>

        <Section title="2. Use License">
          Permission is granted to temporarily download one copy of the materials (information or software) on RBX Task Master for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.
        </Section>

        <Section title="3. User Conduct">
          You agree not to modify, copy, distribute, transmit, display, perform, reproduce, publish, license, create derivative works from, transfer, or sell any information, software, products or services obtained from RBX Task Master.
        </Section>
        
        <Section title="4. Simulated Rewards">
          This application offers simulated rewards and currency ("Coins") for entertainment purposes. These rewards have no real-world monetary value unless explicitly stated in our redemption terms. We reserve the right to modify or discontinue the reward system at any time.
        </Section>

        <Section title="5. Disclaimer">
          The materials on RBX Task Master are provided on an 'as is' basis. We make no warranties, expressed or implied, and hereby disclaim and negate all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
        </Section>

        <Section title="6. Limitations">
          In no event shall RBX Task Master or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on RBX Task Master.
        </Section>
        
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => {
  const { theme } = useTheme();
  const c = theme.colors;
  return (
    <View style={{ marginBottom: Spacing.xl }}>
      <Text style={[styles.sectionTitle, { color: c.textPrimary }]}>{title}</Text>
      <Text style={[styles.sectionText, { color: c.textSecondary }]}>{children}</Text>
    </View>
  );
};

// Static styles for typography structure
const styles = StyleSheet.create({
  sectionTitle: {
    ...Typography.h3,
    marginBottom: Spacing.sm,
  },
  sectionText: {
    ...Typography.body,
    lineHeight: 22,
  },
});

// Dynamic styles for theme-aware containers
const createStyles = (c: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: c.background,
    },
    content: {
      padding: Spacing.xl,
    },
    title: {
      ...Typography.h1,
      color: c.textPrimary,
      marginBottom: Spacing.sm,
    },
    date: {
      ...Typography.caption,
      color: c.textTertiary,
      marginBottom: Spacing.xxl,
    },
  });
