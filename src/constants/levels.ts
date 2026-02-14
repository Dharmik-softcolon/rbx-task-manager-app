import { RankId, RankInfo } from '../types';

export const RANKS: RankInfo[] = [
  { id: 'rookie', name: 'Rookie', emoji: '🌱', requiredCoins: 0, multiplier: 1.0, color: '#6B7280' },
  { id: 'bronze', name: 'Bronze', emoji: '🥉', requiredCoins: 500, multiplier: 1.1, color: '#CD7F32' },
  { id: 'silver', name: 'Silver', emoji: '🥈', requiredCoins: 2000, multiplier: 1.25, color: '#C0C0C0' },
  { id: 'gold', name: 'Gold', emoji: '🥇', requiredCoins: 5000, multiplier: 1.5, color: '#FFD700' },
  { id: 'platinum', name: 'Platinum', emoji: '💎', requiredCoins: 15000, multiplier: 1.75, color: '#7DD3FC' },
  { id: 'diamond', name: 'Diamond', emoji: '👑', requiredCoins: 50000, multiplier: 2.0, color: '#A78BFA' },
];

export const DAILY_REWARD_VALUES = [10, 20, 30, 40, 50, 75, 100];

export function getUserRank(totalCoinsEarned: number): RankInfo {
  let rank = RANKS[0];
  for (const r of RANKS) {
    if (totalCoinsEarned >= r.requiredCoins) {
      rank = r;
    }
  }
  return rank;
}

export function getNextRank(totalCoinsEarned: number): RankInfo | null {
  for (const r of RANKS) {
    if (totalCoinsEarned < r.requiredCoins) {
      return r;
    }
  }
  return null;
}

export function getRankProgress(totalCoinsEarned: number): number {
  const current = getUserRank(totalCoinsEarned);
  const next = getNextRank(totalCoinsEarned);
  if (!next) return 100;
  const range = next.requiredCoins - current.requiredCoins;
  const progress = totalCoinsEarned - current.requiredCoins;
  return Math.min(100, (progress / range) * 100);
}

export function getStreakMultiplier(totalCoinsEarned: number): number {
  return getUserRank(totalCoinsEarned).multiplier;
}

export function generateReferralCode(userId: string): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = 'RBX-';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}
