import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
  Alert,
  Dimensions,
} from 'react-native';
import Svg, { G, Path, Text as SvgText } from 'react-native-svg';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../hooks/ThemeContext';
import { useAppSelector, useAppDispatch } from '../../hooks/useStore';
import { completeTask, claimReward } from '../../store/slices/taskSlice';
import { addCoins } from '../../store/slices/userSlice';
import { addTransaction } from '../../store/slices/transactionSlice';
import { SpinSegment } from '../../types';
import { Typography, Spacing, BorderRadius } from '../../constants/theme';

const SCREEN_WIDTH = Dimensions.get('window').width;
const WHEEL_SIZE = SCREEN_WIDTH * 0.75;

const SEGMENTS: SpinSegment[] = [
  { label: '10', value: 10, color: '#FF6B6B' },
  { label: '20', value: 20, color: '#1CC29F' },
  { label: '50', value: 50, color: '#FFD700' },
  { label: '30', value: 30, color: '#3B82F6' },
  { label: '75', value: 75, color: '#9B59B6' },
  { label: '100', value: 100, color: '#FF6B35' },
  { label: '15', value: 15, color: '#10B981' },
  { label: '40', value: 40, color: '#E91E63' },
];

export default function SpinWheelScreen() {
  const { theme } = useTheme();
  const c = theme.colors;
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const spinTask = useAppSelector(state => state.tasks.tasks.find(t => t.id === 'spin_wheel'));
  const user = useAppSelector(state => state.user);

  const [isSpinning, setIsSpinning] = useState(false);
  const [hasSpun, setHasSpun] = useState(false);
  const [wonAmount, setWonAmount] = useState(0);
  const spinValue = useRef(new Animated.Value(0)).current;
  const currentAngle = useRef(0);

  const handleSpin = useCallback(() => {
    if (isSpinning || spinTask?.claimed) return;

    setIsSpinning(true);
    const segmentIndex = Math.floor(Math.random() * SEGMENTS.length);
    const won = SEGMENTS[segmentIndex].value;
    setWonAmount(won);

    // Calculate target angle: multiple full rotations + landing on segment
    const segmentAngle = 360 / SEGMENTS.length;
    const targetSegmentAngle = segmentIndex * segmentAngle + segmentAngle / 2;
    const fullRotations = 5 + Math.floor(Math.random() * 3); // 5-7 full rotations
    const totalAngle = fullRotations * 360 + (360 - targetSegmentAngle);

    const startAngle = currentAngle.current;
    spinValue.setValue(0);

    Animated.timing(spinValue, {
      toValue: 1,
      duration: 4000,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start(() => {
      currentAngle.current = (startAngle + totalAngle) % 360;
      setIsSpinning(false);
      setHasSpun(true);
      dispatch(completeTask('spin_wheel'));
    });

    spinValue.addListener(({ value }) => {
      // No-op, just for tracking
    });

    // Store rotation for interpolation
    (spinValue as any)._totalAngle = totalAngle;
    (spinValue as any)._startAngle = startAngle;
  }, [isSpinning, spinTask?.claimed, dispatch, spinValue]);

  const handleClaim = () => {
    dispatch(addCoins(wonAmount));
    dispatch(claimReward('spin_wheel'));
    dispatch(
      addTransaction({
        type: 'spin_wheel',
        amount: wonAmount,
        description: `Spin wheel reward`,
        balanceAfter: user.currentBalance + wonAmount,
      }),
    );
    Alert.alert('🎉 You Won!', `${wonAmount} RBX coins added to your balance!`, [
      { text: 'Amazing!', onPress: () => navigation.goBack() },
    ]);
  };

  const rotation = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: [
      `${currentAngle.current}deg`,
      `${currentAngle.current + (5 + Math.floor(Math.random() * 3)) * 360 + 360}deg`,
    ],
  });

  const styles = createStyles(c);

  // Build wheel segments
  const renderWheel = () => {
    const radius = WHEEL_SIZE / 2;
    const center = radius;
    const segmentAngle = (2 * Math.PI) / SEGMENTS.length;

    return (
      <Svg width={WHEEL_SIZE} height={WHEEL_SIZE} viewBox={`0 0 ${WHEEL_SIZE} ${WHEEL_SIZE}`}>
        <G>
          {SEGMENTS.map((seg, i) => {
            const startAngle = i * segmentAngle - Math.PI / 2;
            const endAngle = (i + 1) * segmentAngle - Math.PI / 2;
            const x1 = center + radius * Math.cos(startAngle);
            const y1 = center + radius * Math.sin(startAngle);
            const x2 = center + radius * Math.cos(endAngle);
            const y2 = center + radius * Math.sin(endAngle);
            const largeArc = segmentAngle > Math.PI ? 1 : 0;

            const midAngle = startAngle + segmentAngle / 2;
            const textRadius = radius * 0.65;
            const tx = center + textRadius * Math.cos(midAngle);
            const ty = center + textRadius * Math.sin(midAngle);

            return (
              <G key={i}>
                <Path
                  d={`M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`}
                  fill={seg.color}
                  stroke={c.background}
                  strokeWidth={2}
                />
                <SvgText
                  x={tx}
                  y={ty}
                  fill="#FFFFFF"
                  fontSize={16}
                  fontWeight="bold"
                  textAnchor="middle"
                  alignmentBaseline="middle">
                  {seg.label}
                </SvgText>
              </G>
            );
          })}
        </G>
      </Svg>
    );
  };

  return (
    <View style={styles.container}>
      {/* Wheel */}
      <View style={styles.wheelWrapper}>
        {/* Pointer */}
        <View style={styles.pointer}>
          <Icon name="menu-down" size={40} color={c.accentOrange} />
        </View>
        <Animated.View
          style={[
            styles.wheelContainer,
            {
              transform: [{ rotate: rotation }],
            },
          ]}>
          {renderWheel()}
        </Animated.View>
      </View>

      {/* Result */}
      {hasSpun && !spinTask?.claimed && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>🎉 You won</Text>
          <Text style={styles.resultAmount}>{wonAmount} RBX</Text>
          <TouchableOpacity style={styles.claimButton} onPress={handleClaim} activeOpacity={0.8}>
            <Icon name="gift" size={20} color="#1A1A2E" />
            <Text style={styles.claimButtonText}>Claim Reward</Text>
          </TouchableOpacity>
        </View>
      )}

      {spinTask?.claimed && (
        <View style={styles.resultContainer}>
          <Icon name="check-circle" size={40} color={c.success} />
          <Text style={styles.claimedText}>Already spun today!</Text>
          <Text style={styles.claimedSubtext}>Come back tomorrow for another spin</Text>
        </View>
      )}

      {/* Spin Button */}
      {!hasSpun && !spinTask?.claimed && (
        <TouchableOpacity
          style={[styles.spinButton, isSpinning && styles.spinButtonDisabled]}
          onPress={handleSpin}
          disabled={isSpinning}
          activeOpacity={0.8}>
          <Icon name="rotate-right" size={22} color="#FFFFFF" />
          <Text style={styles.spinButtonText}>
            {isSpinning ? 'Spinning...' : 'SPIN'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const createStyles = (c: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: c.background,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: Spacing.xl,
    },
    wheelWrapper: {
      alignItems: 'center',
      position: 'relative',
    },
    pointer: {
      position: 'absolute',
      top: -10,
      zIndex: 10,
      alignItems: 'center',
    },
    wheelContainer: {
      width: WHEEL_SIZE,
      height: WHEEL_SIZE,
      borderRadius: WHEEL_SIZE / 2,
      overflow: 'hidden',
      elevation: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 12,
      borderWidth: 4,
      borderColor: c.accentGold,
    },
    resultContainer: {
      alignItems: 'center',
      marginTop: Spacing.xxxl,
      backgroundColor: c.card,
      padding: Spacing.xl,
      borderRadius: BorderRadius.xl,
      width: '100%',
      borderWidth: 1,
      borderColor: c.border,
    },
    resultText: {
      ...Typography.h3,
      color: c.textPrimary,
    },
    resultAmount: {
      ...Typography.coinLarge,
      color: c.accentGold,
      marginVertical: Spacing.sm,
    },
    claimButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: c.accentGold,
      paddingVertical: Spacing.md,
      paddingHorizontal: Spacing.xxxl,
      borderRadius: BorderRadius.lg,
      gap: 8,
      marginTop: Spacing.md,
    },
    claimButtonText: {
      ...Typography.button,
      color: '#1A1A2E',
    },
    claimedText: {
      ...Typography.h3,
      color: c.success,
      marginTop: Spacing.md,
    },
    claimedSubtext: {
      ...Typography.body,
      color: c.textSecondary,
      marginTop: Spacing.xs,
    },
    spinButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: c.primary,
      paddingVertical: Spacing.lg,
      paddingHorizontal: Spacing.xxxl * 2,
      borderRadius: BorderRadius.full,
      gap: 10,
      marginTop: Spacing.xxxl,
      elevation: 4,
      shadowColor: c.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
    },
    spinButtonDisabled: {
      opacity: 0.6,
    },
    spinButtonText: {
      ...Typography.button,
      color: '#FFFFFF',
      fontSize: 18,
    },
  });
