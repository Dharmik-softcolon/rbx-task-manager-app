export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'general' | 'payments' | 'tasks';
}

export const FAQS: FAQItem[] = [
  {
    id: '1',
    question: 'How do I earn RBX?',
    answer: 'You can earn RBX by completing daily tasks, watching videos, spinning the wheel, and inviting friends. Each task has a specific reward amount displayed on the card.',
    category: 'general',
  },
  {
    id: '2',
    question: 'When do I get my rewards?',
    answer: 'Most rewards are credited instantly to your account balance. Some tasks may take up to 24 hours to verify completion.',
    category: 'general',
  },
  {
    id: '3',
    question: 'How much are my coins worth?',
    answer: 'The current exchange rate is 1,000 Coins = $1.00 USD. This rate is subject to change based on market conditions.',
    category: 'payments',
  },
  {
    id: '4',
    question: 'How do I withdraw my earnings?',
    answer: 'Go to the Profile tab and tap "Withdraw Funds". You can choose from available payout methods once you meet the minimum withdrawal threshold of $5.00.',
    category: 'payments',
  },
  {
    id: '5',
    question: 'Why did my task fail?',
    answer: 'Tasks may fail if you do not complete all required steps, use ad-blockers, or have already completed the offer on another device. Ensure you follow instructions carefully.',
    category: 'tasks',
  },
  {
    id: '6',
    question: 'Can I refer unlimited friends?',
    answer: 'Yes! There is no limit to how many friends you can invite. You earn 200 RBX for every friend who signs up using your unique referral code.',
    category: 'general',
  },
  {
    id: '7',
    question: 'Is this app free to use?',
    answer: 'Absolutely. RBX Task Master is completely free to use. We never ask for payment to join or complete tasks.',
    category: 'general',
  },
];
