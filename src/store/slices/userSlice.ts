import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserProfile } from '../../types';

const initialState: UserProfile = {
  id: 'user_1',
  username: 'RBX Player',
  avatarEmoji: '🎮',
  createdAt: new Date().toISOString(),
  totalCoinsEarned: 0,
  currentBalance: 0,
  withdrawnAmount: 0,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateUsername(state, action: PayloadAction<string>) {
      state.username = action.payload;
    },
    updateAvatar(state, action: PayloadAction<string>) {
      state.avatarEmoji = action.payload;
    },
    addCoins(state, action: PayloadAction<number>) {
      state.currentBalance += action.payload;
      state.totalCoinsEarned += action.payload;
    },
    withdrawCoins(state, action: PayloadAction<number>) {
      const coinsToWithdraw = action.payload;
      if (state.currentBalance >= coinsToWithdraw) {
        state.currentBalance -= coinsToWithdraw;
        state.withdrawnAmount += coinsToWithdraw / 1000; // Convert to dollars
      }
    },
    resetUser() {
      return initialState;
    },
  },
});

export const { updateUsername, updateAvatar, addCoins, withdrawCoins, resetUser } = userSlice.actions;
export default userSlice.reducer;
