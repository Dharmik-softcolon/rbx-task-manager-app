import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DailyTask } from '../../types';

interface TasksState {
  tasks: DailyTask[];
  checkinStreak: number;
  longestStreak: number;
  lastResetDate: string | null;
}

const generateInitialTasks = (): DailyTask[] => [
  {
    id: 'daily_checkin',
    title: 'Daily Check-in',
    description: 'Log in every day to boost your streak',
    reward: 50,
    rewardLabel: '50 Coins',
    completed: false,
    claimed: false,
    lastCompletedDate: null,
    icon: 'calendar-check',
    category: 'daily',
  },
  {
    id: 'watch_video_1',
    title: 'Watch Ad Video',
    description: 'Watch a short video to earn rewards',
    reward: 20,
    rewardLabel: '20 Coins',
    completed: false,
    claimed: false,
    lastCompletedDate: null,
    icon: 'play-circle',
    category: 'daily',
    videoUrl: 'https://example.com/video1.mp4',
  },
  {
    id: 'spin_wheel',
    title: 'Spin the Wheel',
    description: 'Get lucky with free spins',
    reward: 0, 
    rewardLabel: 'Win up to 1000',
    completed: false, 
    claimed: false,
    lastCompletedDate: null,
    icon: 'ferris-wheel',
    category: 'daily',
  },
  {
    id: 'complete_survey_1',
    title: 'Premium Survey - Tech',
    description: 'Complete a quick 2-min survey about technology',
    reward: 150,
    rewardLabel: '150 Coins',
    completed: false,
    claimed: false,
    lastCompletedDate: null,
    icon: 'file-document-edit',
    category: 'bonus',
  },
  {
    id: 'install_app_clash',
    title: 'Install: Clash of Clans',
    description: 'Install and reach level 5',
    reward: 500,
    rewardLabel: '500 Coins',
    completed: false,
    claimed: false,
    lastCompletedDate: null,
    icon: 'gamepad-variant',
    category: 'bonus',
  },
  {
    id: 'install_app_tiktok',
    title: 'Install: TikTok',
    description: 'Download and open for 30 seconds',
    reward: 300,
    rewardLabel: '300 Coins',
    completed: false,
    claimed: false,
    lastCompletedDate: null,
    icon: 'download',
    category: 'bonus',
  },
  {
    id: 'install_app_uber',
    title: 'Install: Uber',
    description: 'Register a new account',
    reward: 400,
    rewardLabel: '400 Coins',
    completed: false,
    claimed: false,
    lastCompletedDate: null,
    icon: 'car',
    category: 'bonus',
  },
  {
    id: 'share_app',
    title: 'Share with Friends',
    description: 'Share app link on social media',
    reward: 100,
    rewardLabel: '100 Coins',
    completed: false,
    claimed: false,
    lastCompletedDate: null,
    icon: 'share-variant',
    category: 'bonus',
  },
  {
    id: 'rate_app',
    title: 'Rate Us 5 Stars',
    description: 'Leave a positive review on Play Store',
    reward: 150,
    rewardLabel: '150 Coins',
    completed: false,
    claimed: false,
    lastCompletedDate: null,
    icon: 'star',
    category: 'bonus',
  },
  {
    id: 'follow_social_ig',
    title: 'Follow Instagram',
    description: 'Follow our official page @rbxtask',
    reward: 75,
    rewardLabel: '75 Coins',
    completed: false,
    claimed: false,
    lastCompletedDate: null,
    icon: 'instagram',
    category: 'bonus',
  },
  {
    id: 'follow_social_yt',
    title: 'Subscribe YouTube',
    description: 'Subscribe to our YouTube channel',
    reward: 75,
    rewardLabel: '75 Coins',
    completed: false,
    claimed: false,
    lastCompletedDate: null,
    icon: 'youtube',
    category: 'bonus',
  },
];

const initialState: TasksState = {
  tasks: generateInitialTasks(),
  checkinStreak: 0,
  longestStreak: 0,
  lastResetDate: null,
};

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    checkAndResetDailyTasks(state) {
      const today = new Date().toISOString().split('T')[0];
      if (state.lastResetDate !== today) {
        state.tasks.forEach(task => {
          if (task.category === 'daily') {
            task.completed = false;
            task.claimed = false;
          }
        });
        state.lastResetDate = today;
      }
    },
    completeTask(state, action: PayloadAction<string>) {
      const task = state.tasks.find(t => t.id === action.payload);
      if (task) {
        task.completed = true;
        task.lastCompletedDate = new Date().toISOString();
      }
    },
    claimReward(state, action: PayloadAction<string>) {
      const task = state.tasks.find(t => t.id === action.payload);
      if (task) {
        task.claimed = true;
        if (task.id === 'daily_checkin') {
          state.checkinStreak += 1;
          if (state.checkinStreak > state.longestStreak) {
            state.longestStreak = state.checkinStreak;
          }
        }
      }
    },
  },
});

export const { checkAndResetDailyTasks, completeTask, claimReward } = taskSlice.actions;
export default taskSlice.reducer;
