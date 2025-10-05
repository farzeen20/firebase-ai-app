export type Goal = {
  id: string;
  name: string;
  targetAmount: number;
  savedAmount: number;
  startDate: string;
  endDate?: string;
  status: 'active' | 'completed' | 'paused';
  icon: React.ComponentType<{ className?: string }>;
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

export type DailySaving = {
  dailyAmount: number;
  currentBalance: number;
  startDate: string;
  isActive: boolean;
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
