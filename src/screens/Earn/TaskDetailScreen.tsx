import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import Share from 'react-native-share';
import { useTheme } from '../../hooks/ThemeContext';
import { useAppSelector, useAppDispatch } from '../../hooks/useStore';
import { completeTask, claimTaskReward } from '../../store/slices/taskSlice';
import { addCoins } from '../../store/slices/userSlice';
import { addTransaction } from '../../store/slices/transactionSlice';
import { RootStackParamList, TaskType } from '../../types';
import { Typography, Spacing, BorderRadius } from '../../constants/theme';

type TaskDetailRoute = RouteProp<RootStackParamList, 'TaskDetail'>;

export default function TaskDetailScreen() {
  const { theme } = useTheme();
  const c = theme.colors;
  const route = useRoute<TaskDetailRoute>();
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();
  const { taskId } = route.params;
  const task = useAppSelector(state => state.tasks.tasks.find(t => t.id === taskId));
  const user = useAppSelector(state => state.user);

  const [isPerforming, setIsPerforming] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [taskDone, setTaskDone] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  useEffect(() => {
    if (task?.completed) {
      setTaskDone(true);
    }
  }, [task?.completed]);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (isPerforming && countdown > 0) {
      timer = setTimeout(() => setCountdown(prev => prev - 1), 1000);
    } else if (isPerforming && countdown === 0) {
      setIsPerforming(false);
      setTaskDone(true);
      dispatch(completeTask(taskId));
    }
    return () => clearTimeout(timer);
  }, [isPerforming, countdown, dispatch, taskId]);

  if (!task) {
    return (
      <View style={[styles_base.center, { backgroundColor: c.background }]}>
        <Text style={{ color: c.textPrimary }}>Task not found</Text>
      </View>
    );
  }

  const handleStartTask = () => {
    if (taskId === 'watch_video') {
      setIsPerforming(true);
      setCountdown(10); // 10 second simulated video
    } else if (taskId === 'daily_checkin') {
      setTaskDone(true);
      dispatch(completeTask(taskId));
    } else if (taskId === 'share_app') {
      Share.open({
        title: 'RBX Task Master',
        message: 'Earn RBX coins by completing daily tasks! Download RBX Task Master now! 🪙',
      })
        .then(() => {
          setTaskDone(true);
          dispatch(completeTask(taskId));
        })
        .catch(() => {
          // User cancelled share — still count it
          setTaskDone(true);
          dispatch(completeTask(taskId));
        });
    }
  };

  const handleClaim = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 1.2, duration: 150, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
    ]).start();

    dispatch(addCoins(task.reward));
    dispatch(claimTaskReward(taskId));
    dispatch(
      addTransaction({
        type: taskId,
        amount: task.reward,
        description: `${task.title} reward`,
        balanceAfter: user.currentBalance + task.reward,
      }),
    );

    Alert.alert(
      '🎉 Reward Claimed!',
      `You earned ${task.reward} RBX coins!`,
      [{ text: 'Awesome!', onPress: () => navigation.goBack() }],
    );
  };

  const getTaskColor = () => {
    if (taskId === 'watch_video') return '#FF6B6B';
    if (taskId === 'daily_checkin') return c.primary;
    return '#3B82F6';
  };

  const taskColor = getTaskColor();
  const styles = createStyles(c, taskColor);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      {/* Task Icon */}
      <View style={styles.iconContainer}>
        <Icon name={task.icon} size={48} color={taskColor} />
      </View>

      <Text style={styles.title}>{task.title}</Text>
      <Text style={styles.description}>{task.description}</Text>

      {/* Reward Preview */}
      <View style={styles.rewardPreview}>
        <Text style={styles.rewardEmoji}>🪙</Text>
        <Text style={styles.rewardAmount}>{task.reward}</Text>
        <Text style={styles.rewardLabel}>RBX Coins</Text>
      </View>

      {/* Video countdown */}
      {isPerforming && taskId === 'watch_video' && (
        <View style={styles.videoContainer}>
          <Icon name="play-circle" size={64} color={taskColor} />
          <Text style={styles.countdownText}>
            Video playing... {countdown}s remaining
          </Text>
          <View style={styles.videoProgressBg}>
            <View
              style={[
                styles.videoProgressFill,
                { width: `${((10 - countdown) / 10) * 100}%` },
              ]}
            />
          </View>
        </View>
      )}

      {/* Action Button */}
      <View style={styles.bottomActions}>
        {task.claimed ? (
          <View style={styles.completedBanner}>
            <Icon name="check-circle" size={24} color={c.success} />
            <Text style={styles.completedText}>Reward Already Claimed</Text>
          </View>
        ) : taskDone ? (
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: c.accentGold }]}
              onPress={handleClaim}
              activeOpacity={0.8}>
              <Icon name="gift" size={22} color="#1A1A2E" />
              <Text style={[styles.actionButtonText, { color: '#1A1A2E' }]}>
                Claim {task.reward} RBX
              </Text>
            </TouchableOpacity>
          </Animated.View>
        ) : (
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: taskColor }]}
            onPress={handleStartTask}
            disabled={isPerforming}
            activeOpacity={0.8}>
            <Icon
              name={taskId === 'watch_video' ? 'play' : taskId === 'daily_checkin' ? 'check' : 'share'}
              size={22}
              color="#FFFFFF"
            />
            <Text style={styles.actionButtonText}>
              {taskId === 'watch_video'
                ? 'Watch Video'
                : taskId === 'daily_checkin'
                ? 'Check In Now'
                : 'Share App'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </Animated.View>
  );
}

const styles_base = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

const createStyles = (c: any, taskColor: string) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: c.background,
      alignItems: 'center',
      paddingHorizontal: Spacing.xl,
      paddingTop: Spacing.xxxl,
    },
    iconContainer: {
      width: 96,
      height: 96,
      borderRadius: 48,
      backgroundColor: taskColor + '18',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: Spacing.xl,
    },
    title: {
      ...Typography.h2,
      color: c.textPrimary,
      textAlign: 'center',
    },
    description: {
      ...Typography.body,
      color: c.textSecondary,
      textAlign: 'center',
      marginTop: Spacing.sm,
      lineHeight: 22,
      paddingHorizontal: Spacing.xl,
    },
    rewardPreview: {
      alignItems: 'center',
      marginTop: Spacing.xxxl,
      backgroundColor: c.card,
      paddingVertical: Spacing.xl,
      paddingHorizontal: Spacing.xxxl,
      borderRadius: BorderRadius.xl,
      borderWidth: 1,
      borderColor: c.accentGold + '40',
    },
    rewardEmoji: {
      fontSize: 40,
    },
    rewardAmount: {
      ...Typography.coinLarge,
      color: c.accentGold,
      marginTop: Spacing.sm,
    },
    rewardLabel: {
      ...Typography.caption,
      color: c.textSecondary,
      marginTop: 2,
    },
    videoContainer: {
      alignItems: 'center',
      marginTop: Spacing.xxxl,
      backgroundColor: c.card,
      padding: Spacing.xl,
      borderRadius: BorderRadius.lg,
      width: '100%',
      borderWidth: 1,
      borderColor: c.border,
    },
    countdownText: {
      ...Typography.bodyMedium,
      color: c.textPrimary,
      marginTop: Spacing.md,
      marginBottom: Spacing.md,
    },
    videoProgressBg: {
      width: '100%',
      height: 6,
      backgroundColor: c.shimmer,
      borderRadius: BorderRadius.full,
      overflow: 'hidden',
    },
    videoProgressFill: {
      height: '100%',
      backgroundColor: taskColor,
      borderRadius: BorderRadius.full,
    },
    bottomActions: {
      position: 'absolute',
      bottom: 40,
      left: Spacing.xl,
      right: Spacing.xl,
    },
    actionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: Spacing.lg,
      borderRadius: BorderRadius.lg,
      gap: 10,
    },
    actionButtonText: {
      ...Typography.button,
      color: '#FFFFFF',
    },
    completedBanner: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: c.success + '15',
      paddingVertical: Spacing.lg,
      borderRadius: BorderRadius.lg,
      gap: 8,
      borderWidth: 1,
      borderColor: c.success + '40',
    },
    completedText: {
      ...Typography.subtitle,
      color: c.success,
    },
  });
