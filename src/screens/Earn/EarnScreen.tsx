import React, { useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTheme } from '../../hooks/ThemeContext';
import { useAppSelector, useAppDispatch } from '../../hooks/useStore';
import { checkAndResetDailyTasks } from '../../store/slices/taskSlice';
import { RootStackParamList, DailyTask, TaskType } from '../../types';
import { Typography, Spacing, BorderRadius } from '../../constants/theme';

type NavProp = StackNavigationProp<RootStackParamList>;

export default function EarnScreen() {
  const { theme } = useTheme();
  const c = theme.colors;
  const navigation = useNavigation<NavProp>();
  const dispatch = useAppDispatch();
  const tasks = useAppSelector(state => state.tasks);
  const user = useAppSelector(state => state.user);

  useEffect(() => {
    dispatch(checkAndResetDailyTasks());
  }, [dispatch]);

  const completedCount = tasks.tasks.filter(t => t.claimed).length;

  const handleTaskPress = (task: DailyTask) => {
    if (task.id === 'spin_wheel') {
      navigation.navigate('SpinWheel');
    } else {
      navigation.navigate('TaskDetail', { taskId: task.id });
    }
  };

  const styles = createStyles(c);

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle={theme.dark ? 'light-content' : 'dark-content'}
        backgroundColor={c.background}
      />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Daily Tasks</Text>
          <Text style={styles.headerSubtitle}>
            Complete tasks to earn RBX coins
          </Text>
        </View>

        {/* Summary Card */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryLeft}>
            <Text style={styles.summaryLabel}>Today's Progress</Text>
            <Text style={styles.summaryValue}>
              {completedCount}/{tasks.tasks.length} Tasks Done
            </Text>
          </View>
          <View style={styles.summaryRight}>
            <View style={styles.miniProgressBg}>
              <View
                style={[
                  styles.miniProgressFill,
                  {
                    width: `${(completedCount / tasks.tasks.length) * 100}%`,
                  },
                ]}
              />
            </View>
            <Text style={styles.summaryPercent}>
              {Math.round((completedCount / tasks.tasks.length) * 100)}%
            </Text>
          </View>
        </View>

        {/* Task List */}
        <View style={styles.tasksSection}>
          {tasks.tasks.map((task, index) => (
            <TaskCard
              key={task.id}
              task={task}
              index={index}
              colors={c}
              onPress={() => handleTaskPress(task)}
            />
          ))}
        </View>

        {/* Bonus Info */}
        <View style={styles.bonusCard}>
          <Icon name="information" size={20} color={c.info} />
          <Text style={styles.bonusText}>
            Tasks reset daily at midnight. Complete all 4 tasks to maximize your earnings!
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

function TaskCard({
  task,
  index,
  colors: c,
  onPress,
}: {
  task: DailyTask;
  index: number;
  colors: any;
  onPress: () => void;
}) {
  const fadeAnim = useMemo(() => new Animated.Value(0), []);
  const slideAnim = useMemo(() => new Animated.Value(40), []);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        delay: index * 100,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        delay: index * 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim, index]);

  const getTaskColor = () => {
    if (task.id === 'watch_video') return '#FF6B6B';
    if (task.id === 'daily_checkin') return c.primary;
    if (task.id === 'spin_wheel') return '#9B59B6';
    return '#3B82F6';
  };

  const taskColor = getTaskColor();

  const cardStyles = StyleSheet.create({
    card: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: c.card,
      padding: Spacing.lg,
      borderRadius: BorderRadius.lg,
      marginBottom: Spacing.md,
      borderWidth: 1,
      borderColor: task.claimed ? c.success + '40' : c.border,
      opacity: task.claimed ? 0.7 : 1,
    },
    iconContainer: {
      width: 48,
      height: 48,
      borderRadius: BorderRadius.md,
      backgroundColor: taskColor + '18',
      justifyContent: 'center',
      alignItems: 'center',
    },
    content: {
      flex: 1,
      marginLeft: Spacing.md,
    },
    title: {
      ...Typography.subtitle,
      color: c.textPrimary,
    },
    description: {
      ...Typography.caption,
      color: c.textSecondary,
      marginTop: 2,
    },
    rewardBadge: {
      backgroundColor: c.accentGold + '20',
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.xs,
      borderRadius: BorderRadius.full,
    },
    rewardText: {
      ...Typography.small,
      color: c.coinGoldDark,
      fontWeight: '700',
    },
    claimedBadge: {
      backgroundColor: c.success + '20',
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.xs,
      borderRadius: BorderRadius.full,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    claimedText: {
      ...Typography.small,
      color: c.success,
      fontWeight: '700',
    },
    chevron: {
      marginLeft: Spacing.sm,
    },
  });

  return (
    <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
      <TouchableOpacity
        style={cardStyles.card}
        onPress={onPress}
        disabled={task.claimed}
        activeOpacity={0.7}>
        <View style={cardStyles.iconContainer}>
          <Icon name={task.icon} size={24} color={taskColor} />
        </View>
        <View style={cardStyles.content}>
          <Text style={cardStyles.title}>{task.title}</Text>
          <Text style={cardStyles.description}>{task.description}</Text>
        </View>
        {task.claimed ? (
          <View style={cardStyles.claimedBadge}>
            <Icon name="check" size={12} color={c.success} />
            <Text style={cardStyles.claimedText}>Done</Text>
          </View>
        ) : (
          <>
            <View style={cardStyles.rewardBadge}>
              <Text style={cardStyles.rewardText}>{task.rewardLabel}</Text>
            </View>
            <Icon
              name="chevron-right"
              size={20}
              color={c.textTertiary}
              style={cardStyles.chevron}
            />
          </>
        )}
      </TouchableOpacity>
    </Animated.View>
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
    headerSubtitle: {
      ...Typography.body,
      color: c.textSecondary,
      marginTop: 4,
    },
    summaryCard: {
      flexDirection: 'row',
      alignItems: 'center',
      marginHorizontal: Spacing.xl,
      backgroundColor: c.primary,
      padding: Spacing.lg,
      borderRadius: BorderRadius.lg,
      marginBottom: Spacing.xl,
    },
    summaryLeft: {
      flex: 1,
    },
    summaryLabel: {
      ...Typography.caption,
      color: 'rgba(255,255,255,0.8)',
    },
    summaryValue: {
      ...Typography.subtitle,
      color: '#FFFFFF',
      marginTop: 2,
    },
    summaryRight: {
      alignItems: 'flex-end',
    },
    miniProgressBg: {
      width: 80,
      height: 6,
      backgroundColor: 'rgba(255,255,255,0.3)',
      borderRadius: BorderRadius.full,
      overflow: 'hidden',
    },
    miniProgressFill: {
      height: '100%',
      backgroundColor: '#FFFFFF',
      borderRadius: BorderRadius.full,
    },
    summaryPercent: {
      ...Typography.small,
      color: 'rgba(255,255,255,0.9)',
      marginTop: 4,
    },
    tasksSection: {
      paddingHorizontal: Spacing.xl,
    },
    bonusCard: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginHorizontal: Spacing.xl,
      marginTop: Spacing.sm,
      backgroundColor: c.info + '12',
      padding: Spacing.lg,
      borderRadius: BorderRadius.lg,
      gap: 10,
      borderWidth: 1,
      borderColor: c.info + '30',
    },
    bonusText: {
      ...Typography.caption,
      color: c.textSecondary,
      flex: 1,
      lineHeight: 18,
    },
  });
