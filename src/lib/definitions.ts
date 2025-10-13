
import { Timestamp } from 'firebase/firestore';

export type Goal = {
  id: string;
  name: string;
  targetAmount: number;
  savedAmount: number;
  startDate: Timestamp | string;
  endDate?: Timestamp | string | null;
  status: 'active' | 'completed' | 'paused';
};

export type LiteracyArticle = {
  id: string;
  title: string;
  category: string;
  content: string;
  imageUrl: string;
  imageHint: string;
  bookmarked: boolean;
  feedback?: 'clear' | 'unclear';
};

export type SavingEntry = {
  id: string;
  date: string; // YYYY-MM-DD
  amount: number;
  createdAt: Timestamp | string;
};

export type FamilyMember = {
  id: string;
  name: string;
  role: 'parent' | 'child';
  avatarUrl: string;
  avatarHint: string;
};

export type Committee = {
  id: string;
  name: string;
  owner: string;
  members: number;
  totalPot: number;
  myContribution: number;
  nextPayout: string;
};

export type BudgetItem = {
  name: string;
  category: string;
  price: number;
};

export type Notification = {
    id: string;
    type: 'Goal Reached' | 'Committee Payout' | 'Budget Alert' | 'New Article';
    message: string;
    timestamp: string;
    read: boolean;
};
