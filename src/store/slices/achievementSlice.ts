import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AchievementState, Achievement, AchievementId } from '../../types';

const createDefaultAchievements = (): Achievement[] => [
  // Milestones
  { id: 'first_coin', title: 'First Earnings', description: 'Earn your first RBX coin', icon: 'star-shooting', reward: 10, unlocked: false, unlockedAt: null, category: 'milestone' },
  { id: 'first_task', title: 'Task Beginner', description: 'Complete your first task', icon: 'clipboard-check', reward: 15, unlocked: false, unlockedAt: null, category: 'milestone' },
  { id: 'all_daily', title: 'Overachiever', description: 'Complete all daily tasks in one day', icon: 'trophy', reward: 50, unlocked: false, unlockedAt: null, category: 'milestone' },
  { id: 'first_spin', title: 'Lucky Spinner', description: 'Spin the wheel for the first time', icon: 'tire', reward: 10, unlocked: false, unlockedAt: null, category: 'milestone' },
  { id: 'first_share', title: 'Social Butterfly', description: 'Share the app with friends', icon: 'share-variant', reward: 10, unlocked: false, unlockedAt: null, category: 'milestone' },
  { id: 'first_withdraw', title: 'Cash Out', description: 'Make your first withdrawal', icon: 'bank-transfer-out', reward: 25, unlocked: false, unlockedAt: null, category: 'milestone' },
  // Coin Milestones
  { id: 'coins_100', title: 'Coin Collector', description: 'Earn 100 total RBX coins', icon: 'numeric-1-circle', reward: 20, unlocked: false, unlockedAt: null, category: 'milestone' },
  { id: 'coins_500', title: 'Coin Hoarder', description: 'Earn 500 total RBX coins', icon: 'numeric-5-circle', reward: 50, unlocked: false, unlockedAt: null, category: 'milestone' },
  { id: 'coins_1000', title: 'Coin Master', description: 'Earn 1,000 total RBX coins', icon: 'cash-multiple', reward: 100, unlocked: false, unlockedAt: null, category: 'milestone' },
  { id: 'coins_5000', title: 'Coin Legend', description: 'Earn 5,000 total RBX coins', icon: 'diamond-stone', reward: 200, unlocked: false, unlockedAt: null, category: 'milestone' },
  { id: 'coins_10000', title: 'Coin God', description: 'Earn 10,000 total RBX coins', icon: 'crown', reward: 500, unlocked: false, unlockedAt: null, category: 'milestone' },
  // Streaks
  { id: 'streak_3', title: 'Three-peat', description: 'Maintain a 3-day check-in streak', icon: 'fire', reward: 30, unlocked: false, unlockedAt: null, category: 'streak' },
  { id: 'streak_7', title: 'Week Warrior', description: 'Maintain a 7-day check-in streak', icon: 'fire', reward: 75, unlocked: false, unlockedAt: null, category: 'streak' },
  { id: 'streak_14', title: 'Fortnight Fighter', description: 'Maintain a 14-day check-in streak', icon: 'fire', reward: 150, unlocked: false, unlockedAt: null, category: 'streak' },
  { id: 'streak_30', title: 'Monthly Master', description: 'Maintain a 30-day check-in streak', icon: 'fire', reward: 500, unlocked: false, unlockedAt: null, category: 'streak' },
  // Ranks
  { id: 'rank_bronze', title: 'Bronze Rank', description: 'Reach Bronze rank', icon: 'medal', reward: 50, unlocked: false, unlockedAt: null, category: 'rank' },
  { id: 'rank_silver', title: 'Silver Rank', description: 'Reach Silver rank', icon: 'medal', reward: 100, unlocked: false, unlockedAt: null, category: 'rank' },
  { id: 'rank_gold', title: 'Gold Rank', description: 'Reach Gold rank', icon: 'medal', reward: 200, unlocked: false, unlockedAt: null, category: 'rank' },
  { id: 'rank_platinum', title: 'Platinum Rank', description: 'Reach Platinum rank', icon: 'medal', reward: 500, unlocked: false, unlockedAt: null, category: 'rank' },
  { id: 'rank_diamond', title: 'Diamond Rank', description: 'Reach Diamond rank', icon: 'medal', reward: 1000, unlocked: false, unlockedAt: null, category: 'rank' },
];

const initialState: AchievementState = {
  achievements: createDefaultAchievements(),
  totalAchievementCoins: 0,
};

const achievementSlice = createSlice({
  name: 'achievements',
  initialState,
  reducers: {
    unlockAchievement(state, action: PayloadAction<AchievementId>) {
      const achievement = state.achievements.find(a => a.id === action.payload);
      if (achievement && !achievement.unlocked) {
        achievement.unlocked = true;
        achievement.unlockedAt = new Date().toISOString();
        state.totalAchievementCoins += achievement.reward;
      }
    },
    checkAchievements(
      state,
      action: PayloadAction<{
        totalCoins: number;
        streak: number;
        tasksCompleted: number;
        totalTasks: number;
        hasSpun: boolean;
        hasShared: boolean;
        hasWithdrawn: boolean;
      }>,
    ) {
      const { totalCoins, streak, tasksCompleted, totalTasks, hasSpun, hasShared, hasWithdrawn } = action.payload;
      const unlock = (id: AchievementId) => {
        const a = state.achievements.find(x => x.id === id);
        if (a && !a.unlocked) {
          a.unlocked = true;
          a.unlockedAt = new Date().toISOString();
          state.totalAchievementCoins += a.reward;
        }
      };

      if (totalCoins > 0) unlock('first_coin');
      if (tasksCompleted > 0) unlock('first_task');
      if (tasksCompleted >= totalTasks && totalTasks > 0) unlock('all_daily');
      if (hasSpun) unlock('first_spin');
      if (hasShared) unlock('first_share');
      if (hasWithdrawn) unlock('first_withdraw');

      if (totalCoins >= 100) unlock('coins_100');
      if (totalCoins >= 500) unlock('coins_500');
      if (totalCoins >= 1000) unlock('coins_1000');
      if (totalCoins >= 5000) unlock('coins_5000');
      if (totalCoins >= 10000) unlock('coins_10000');

      if (streak >= 3) unlock('streak_3');
      if (streak >= 7) unlock('streak_7');
      if (streak >= 14) unlock('streak_14');
      if (streak >= 30) unlock('streak_30');

      if (totalCoins >= 500) unlock('rank_bronze');
      if (totalCoins >= 2000) unlock('rank_silver');
      if (totalCoins >= 5000) unlock('rank_gold');
      if (totalCoins >= 15000) unlock('rank_platinum');
      if (totalCoins >= 50000) unlock('rank_diamond');
    },
  },
});

export const { unlockAchievement, checkAchievements } = achievementSlice.actions;
export default achievementSlice.reducer;
