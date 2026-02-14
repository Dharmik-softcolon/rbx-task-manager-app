import React from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar } from 'react-native';
import { useTheme } from '../../hooks/ThemeContext';
import { Typography, Spacing } from '../../constants/theme';

export default function PrivacyPolicyScreen() {
  const { theme } = useTheme();
  const c = theme.colors;
  const styles = createStyles(c);

  return (
    <View style={styles.container}>
      <StatusBar barStyle={theme.dark ? 'light-content' : 'dark-content'} backgroundColor={c.background} />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Privacy Policy</Text>
        <Text style={styles.date}>Last updated: {new Date().toLocaleDateString()}</Text>

        <Section title="1. Introduction">
          Welcome to RBX Task Master. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our application and tell you about your privacy rights and how the law protects you.
        </Section>

        <Section title="2. Data We Collect">
          We may collect, use, store and transfer different kinds of personal data about you which we have grouped together follows:
          {'\n'}• Identity Data: username, unique device identifiers.
          {'\n'}• Usage Data: information about how you use our app, tasks completed, and rewards earned.
          {'\n'}• Device Data: device model, operating system version, and unique device identifiers.
        </Section>

        <Section title="3. How We Use Your Data">
          We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
          {'\n'}• To manage your account and provide you with the services.
          {'\n'}• To improve our application and user experience.
          {'\n'}• To facilitate reward redemption.
          {'\n'}• To prevent fraud and abuse.
        </Section>

        <Section title="4. Data Security">
          We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed.
        </Section>

        <Section title="5. Contact Us">
          If you have any questions about this privacy policy or our privacy practices, please contact us at support@rbxtaskmaster.com.
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: Spacing.xl,
  },
  title: {
    ...Typography.h1,
    marginBottom: Spacing.sm,
  },
  date: {
    ...Typography.caption,
    marginBottom: Spacing.xxl,
    opacity: 0.7,
  },
  sectionTitle: {
    ...Typography.h3,
    marginBottom: Spacing.sm,
  },
  sectionText: {
    ...Typography.body,
    lineHeight: 22,
  },
});

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
    sectionTitle: {
      ...Typography.h3,
      color: c.textPrimary,
      marginBottom: Spacing.sm,
    },
    sectionText: {
      ...Typography.body,
      color: c.textSecondary,
      lineHeight: 22,
    },
  });
