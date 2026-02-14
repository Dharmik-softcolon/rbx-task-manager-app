import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DailyRewardState } from '../../types';

const initialState: DailyRewardState = {
  lastClaimDate: null,
  currentDay: 1,
  claimedDays: [],
  cycleStartDate: null,
};

const getTodayString = () => new Date().toISOString().split('T')[0];

const dailyRewardSlice = createSlice({
  name: 'dailyReward',
  initialState,
  reducers: {
    claimDailyReward(state) {
      const today = getTodayString();
      if (state.lastClaimDate === today) return; // Already claimed

      if (!state.cycleStartDate || state.currentDay > 7) {
        // Start new cycle
        state.currentDay = 1;
        state.claimedDays = [1];
        state.cycleStartDate = today;
      } else {
        state.claimedDays.push(state.currentDay);
      }

      state.lastClaimDate = today;
    },
    advanceDay(state) {
      if (state.currentDay < 7) {
        state.currentDay += 1;
      }
    },
    resetCycle(state) {
      state.currentDay = 1;
      state.claimedDays = [];
      state.cycleStartDate = null;
      state.lastClaimDate = null;
    },
    checkAndAdvanceDay(state) {
      const today = getTodayString();
      if (state.lastClaimDate && state.lastClaimDate !== today) {
        // New day: advance to next day if not already at 7
        if (state.currentDay < 7) {
          state.currentDay += 1;
        } else {
          // Reset cycle
          state.currentDay = 1;
          state.claimedDays = [];
          state.cycleStartDate = null;
        }
      }
    },
  },
});

export const { claimDailyReward, advanceDay, resetCycle, checkAndAdvanceDay } = dailyRewardSlice.actions;
export default dailyRewardSlice.reducer;
