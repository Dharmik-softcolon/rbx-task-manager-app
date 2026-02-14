// ============ User ============
export interface UserProfile {
  id: string;
  username: string;
  profileImage: string | null;
  createdAt: string;
  totalCoinsEarned: number;
  currentBalance: number;
  withdrawnAmount: number;
  hasCompletedOnboarding: boolean;
  referralCode: string;
  referralCount: number;
}

// ============ Tasks ============
export type TaskType =
  | 'watch_video'
  | 'watch_video_1'
  | 'daily_checkin'
  | 'spin_wheel'
  | 'share_app'
  | 'follow_social'
  | 'rate_app'
  | 'bonus_video'
  | 'complete_survey_1'
  | 'install_app_clash'
  | 'install_app_tiktok'
  | 'install_app_uber'
  | 'follow_social_ig'
  | 'follow_social_yt';

export interface DailyTask {
  id: TaskType;
  title: string;
  description: string;
  icon: string;
  reward: number;
  rewardLabel: string;
  completed: boolean;
  claimed: boolean;
  lastCompletedDate: string | null;
  category: 'daily' | 'bonus';
  videoUrl?: string;
}

export interface TasksState {
  tasks: DailyTask[];
  lastResetDate: string;
  checkinStreak: number;
  longestStreak: number;
}

// ============ Transactions ============
export type TransactionType =
  | 'watch_video'
  | 'daily_checkin'
  | 'spin_wheel'
  | 'share_app'
  | 'follow_social'
  | 'rate_app'
  | 'bonus_video'
  | 'watch_video_1'
  | 'install_app_clash'
  | 'install_app_tiktok'
  | 'install_app_uber'
  | 'complete_survey_1'
  | 'follow_social_ig'
  | 'follow_social_yt'
  | 'daily_reward'
  | 'referral_bonus'
  | 'achievement_bonus'
  | 'streak_bonus'
  | 'withdrawal';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  description: string;
  timestamp: string;
  balanceAfter: number;
}

export interface TransactionState {
  transactions: Transaction[];
}

// ============ Spin Wheel ============
export interface SpinSegment {
  label: string;
  value: number;
  color: string;
}

// ============ Daily Progress ============
export interface DailyEarning {
  date: string;
  amount: number;
}

// ============ Achievements ============
export type AchievementId =
  | 'first_coin'
  | 'first_task'
  | 'streak_3'
  | 'streak_7'
  | 'streak_14'
  | 'streak_30'
  | 'coins_100'
  | 'coins_500'
  | 'coins_1000'
  | 'coins_5000'
  | 'coins_10000'
  | 'all_daily'
  | 'first_spin'
  | 'first_share'
  | 'first_withdraw'
  | 'rank_bronze'
  | 'rank_silver'
  | 'rank_gold'
  | 'rank_platinum'
  | 'rank_diamond';

export interface Achievement {
  id: AchievementId;
  title: string;
  description: string;
  icon: string;
  reward: number;
  unlocked: boolean;
  unlockedAt: string | null;
  category: 'milestone' | 'streak' | 'rank';
}

export interface AchievementState {
  achievements: Achievement[];
  totalAchievementCoins: number;
}

// ============ Daily Reward Calendar ============
export interface DailyRewardState {
  lastClaimDate: string | null;
  currentDay: number; // 1-7
  claimedDays: number[];
  cycleStartDate: string | null;
}

// ============ Levels / Ranks ============
export type RankId = 'rookie' | 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';

export interface RankInfo {
  id: RankId;
  name: string;
  requiredCoins: number;
  multiplier: number;
  color: string;
}

// ============ Navigation ============
export type RootStackParamList = {
  Onboarding: undefined;
  MainTabs: undefined;
  TaskDetail: { taskId: TaskType };
  SpinWheel: undefined;
  EditProfile: undefined;
  Achievements: undefined;
  Referral: undefined;
  DailyReward: undefined;
  Leaderboard: undefined;
  PrivacyPolicy: undefined;
  Terms: undefined;
  FAQ: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Earn: undefined;
  Rewards: undefined;
  Leaderboard: undefined;
  Profile: undefined;
};

// ============ Theme ============
export type ThemeMode = 'light' | 'dark' | 'system';

// ============ Leaderboard ============
export interface LeaderboardEntry {
  id: string;
  username: string;
  profileImage: string | null;
  totalCoins: number;
  rank: RankId;
  isCurrentUser: boolean;
}
