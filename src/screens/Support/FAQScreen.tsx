import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, LayoutAnimation, Platform, UIManager, StatusBar } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../../hooks/ThemeContext';
import { Typography, Spacing, BorderRadius } from '../../constants/theme';
import { FAQS, FAQItem } from '../../constants/faq';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function FAQScreen() {
  const { theme } = useTheme();
  const c = theme.colors;
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedId(expandedId === id ? null : id);
  };

  const styles = createStyles(c);

  return (
    <View style={styles.container}>
      <StatusBar barStyle={theme.dark ? 'light-content' : 'dark-content'} backgroundColor={c.background} />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.headerTitle}>Help Center</Text>
        <Text style={styles.headerSubtitle}>Common questions & answers</Text>

        <View style={styles.list}>
          {FAQS.map((item) => (
            <FAQCard
              key={item.id}
              item={item}
              expanded={expandedId === item.id}
              onPress={() => toggleExpand(item.id)}
              themeColors={c}
              styles={styles}
            />
          ))}
        </View>
        
        <View style={styles.contactContainer}>
          <Text style={styles.contactTitle}>Still have questions?</Text>
          <TouchableOpacity style={styles.contactButton}>
            <Icon name="email-outline" size={20} color="#FFFFFF" />
            <Text style={styles.contactButtonText}>Contact Support</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const FAQCard = ({ item, expanded, onPress, themeColors, styles }: { item: FAQItem; expanded: boolean; onPress: () => void; themeColors: any; styles: any }) => {
  return (
    <TouchableOpacity
      style={[styles.card, expanded && styles.cardExpanded]}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.question}>{item.question}</Text>
        <Icon
          name={expanded ? 'chevron-up' : 'chevron-down'}
          size={24}
          color={themeColors.textTertiary}
        />
      </View>
      {expanded && (
        <View style={styles.answerContainer}>
          <Text style={styles.answer}>{item.answer}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const createStyles = (c: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: c.background,
    },
    content: {
      padding: Spacing.xl,
      paddingBottom: 40,
    },
    headerTitle: {
      ...Typography.h1,
      color: c.textPrimary,
      marginBottom: 4,
    },
    headerSubtitle: {
      ...Typography.body,
      color: c.textSecondary,
      marginBottom: Spacing.xxl,
    },
    list: {
      gap: Spacing.md,
    },
    card: {
      backgroundColor: c.card,
      borderRadius: BorderRadius.lg,
      padding: Spacing.lg,
      borderWidth: 1,
      borderColor: c.border,
    },
    cardExpanded: {
      borderColor: c.primary,
      backgroundColor: c.cardElevated,
    },
    cardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    question: {
      ...Typography.subtitle,
      color: c.textPrimary,
      flex: 1,
      marginRight: Spacing.md,
    },
    answerContainer: {
      marginTop: Spacing.md,
      paddingTop: Spacing.md,
      borderTopWidth: 1,
      borderTopColor: c.divider,
    },
    answer: {
      ...Typography.body,
      color: c.textSecondary,
      lineHeight: 22,
    },
    contactContainer: {
      marginTop: Spacing.xxxl,
      alignItems: 'center',
      backgroundColor: c.card,
      padding: Spacing.xl,
      borderRadius: BorderRadius.xl,
      borderWidth: 1,
      borderColor: c.border,
    },
    contactTitle: {
      ...Typography.h3,
      color: c.textPrimary,
      marginBottom: Spacing.lg,
    },
    contactButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: c.primary,
      paddingHorizontal: Spacing.xl,
      paddingVertical: Spacing.md,
      borderRadius: BorderRadius.full,
      gap: 8,
    },
    contactButtonText: {
      ...Typography.button,
      color: '#FFFFFF',
    },
  });
