import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Transaction, TransactionState, TransactionType } from '../../types';

const initialState: TransactionState = {
  transactions: [],
};

const transactionSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    addTransaction(
      state,
      action: PayloadAction<{
        type: TransactionType;
        amount: number;
        description: string;
        balanceAfter: number;
      }>,
    ) {
      const newTransaction: Transaction = {
        id: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: action.payload.type,
        amount: action.payload.amount,
        description: action.payload.description,
        timestamp: new Date().toISOString(),
        balanceAfter: action.payload.balanceAfter,
      };
      state.transactions.unshift(newTransaction);
    },
    clearHistory(state) {
      state.transactions = [];
    },
  },
});

export const { addTransaction, clearHistory } = transactionSlice.actions;
export default transactionSlice.reducer;
