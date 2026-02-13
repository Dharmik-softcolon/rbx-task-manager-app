import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TasksState, DailyTask, TaskType } from '../../types';

const createDefaultTasks = (): DailyTask[] => [
  {
    id: 'watch_video',
    title: 'Watch Video',
    description: 'Watch a short video to earn RBX coins',
    icon: 'play-circle',
    reward: 50,
    rewardLabel: '+50 RBX',
    completed: false,
    claimed: false,
    lastCompletedDate: null,
  },
  {
    id: 'daily_checkin',
    title: 'Daily Check-in',
    description: 'Check in daily to build your streak and earn bonus coins',
    icon: 'calendar-check',
    reward: 30,
    rewardLabel: '+30 RBX',
    completed: false,
    claimed: false,
    lastCompletedDate: null,
  },
  {
    id: 'spin_wheel',
    title: 'Spin the Wheel',
    description: 'Spin the lucky wheel to win random RBX coins',
    icon: 'tire',
    reward: 10, // minimum, actual reward determined by wheel
    rewardLabel: '+10-100 RBX',
    completed: false,
    claimed: false,
    lastCompletedDate: null,
  },
  {
    id: 'share_app',
    title: 'Share App',
    description: 'Share RBX Task Master with your friends',
    icon: 'share-variant',
    reward: 20,
    rewardLabel: '+20 RBX',
    completed: false,
    claimed: false,
    lastCompletedDate: null,
  },
];

const getTodayString = () => new Date().toISOString().split('T')[0];

const initialState: TasksState = {
  tasks: createDefaultTasks(),
  lastResetDate: getTodayString(),
  checkinStreak: 0,
  longestStreak: 0,
};

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    checkAndResetDailyTasks(state) {
      const today = getTodayString();
      if (state.lastResetDate !== today) {
        state.tasks = createDefaultTasks();
        state.lastResetDate = today;
      }
    },
    completeTask(state, action: PayloadAction<TaskType>) {
      const task = state.tasks.find(t => t.id === action.payload);
      if (task && !task.completed) {
        task.completed = true;
        task.lastCompletedDate = new Date().toISOString();

        if (action.payload === 'daily_checkin') {
          state.checkinStreak += 1;
          if (state.checkinStreak > state.longestStreak) {
            state.longestStreak = state.checkinStreak;
          }
        }
      }
    },
    claimTaskReward(state, action: PayloadAction<TaskType>) {
      const task = state.tasks.find(t => t.id === action.payload);
      if (task && task.completed && !task.claimed) {
        task.claimed = true;
      }
    },
    setSpinReward(state, action: PayloadAction<number>) {
      const spinTask = state.tasks.find(t => t.id === 'spin_wheel');
      if (spinTask) {
        spinTask.reward = action.payload;
        spinTask.rewardLabel = `+${action.payload} RBX`;
      }
    },
    resetStreak(state) {
      state.checkinStreak = 0;
    },
  },
});

export const {
  checkAndResetDailyTasks,
  completeTask,
  claimTaskReward,
  setSpinReward,
  resetStreak,
} = taskSlice.actions;
export default taskSlice.reducer;
