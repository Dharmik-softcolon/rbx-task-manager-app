// ============ User ============
export interface UserProfile {
  id: string;
  username: string;
  avatarEmoji: string;
  createdAt: string;
  totalCoinsEarned: number;
  currentBalance: number;
  withdrawnAmount: number;
}

// ============ Tasks ============
export type TaskType = 'watch_video' | 'daily_checkin' | 'spin_wheel' | 'share_app';

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
}

export interface TasksState {
  tasks: DailyTask[];
  lastResetDate: string;
  checkinStreak: number;
  longestStreak: number;
}

// ============ Transactions ============
export type TransactionType = 'watch_video' | 'daily_checkin' | 'spin_wheel' | 'share_app' | 'withdrawal';

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

// ============ Navigation ============
export type RootStackParamList = {
  MainTabs: undefined;
  TaskDetail: { taskId: TaskType };
  SpinWheel: undefined;
  EditProfile: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Earn: undefined;
  History: undefined;
  Profile: undefined;
};

// ============ Theme ============
export type ThemeMode = 'light' | 'dark' | 'system';
