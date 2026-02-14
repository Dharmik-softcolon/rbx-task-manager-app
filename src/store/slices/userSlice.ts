import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserProfile } from '../../types';
import { generateReferralCode } from '../../constants/levels';

const initialState: UserProfile = {
  id: 'user_1',
  username: 'RBX Player',
  profileImage: null,
  createdAt: new Date().toISOString(),
  totalCoinsEarned: 0,
  currentBalance: 0,
  withdrawnAmount: 0,
  hasCompletedOnboarding: false,
  referralCode: generateReferralCode('user_1'),
  referralCount: 0,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateUsername(state, action: PayloadAction<string>) {
      state.username = action.payload;
    },
    updateProfileImage(state, action: PayloadAction<string | null>) {
      state.profileImage = action.payload;
    },
    addCoins(state, action: PayloadAction<number>) {
      state.currentBalance += action.payload;
      state.totalCoinsEarned += action.payload;
    },
    withdrawCoins(state, action: PayloadAction<number>) {
      const coinsToWithdraw = action.payload;
      if (state.currentBalance >= coinsToWithdraw) {
        state.currentBalance -= coinsToWithdraw;
        state.withdrawnAmount += coinsToWithdraw / 1000;
      }
    },
    completeOnboarding(state) {
      state.hasCompletedOnboarding = true;
    },
    addReferral(state) {
      state.referralCount += 1;
    },
    resetUser() {
      return { ...initialState, referralCode: generateReferralCode('user_1') };
    },
  },
});

export const {
  updateUsername,
  updateProfileImage,
  addCoins,
  withdrawCoins,
  completeOnboarding,
  addReferral,
  resetUser,
} = userSlice.actions;
export default userSlice.reducer;
