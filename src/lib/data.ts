import type { Goal, DailySaving, FamilyMember, Committee, LiteracyArticle, BudgetItem } from './definitions';
import { Target, Car, Home, GraduationCap, PiggyBank, Briefcase, HeartHandshake, Users, Wallet, BookOpen, SettingsIcon } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export const user = {
  name: 'Ayesha Khan',
  email: 'ayesha.khan@example.com',
  avatarUrl: PlaceHolderImages.find(p => p.id === 'user-avatar')?.imageUrl || '',
  avatarHint: PlaceHolderImages.find(p => p.id === 'user-avatar')?.imageHint || '',
};

export const navLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: PiggyBank },
    { href: '/dashboard/savings', label: 'Daily Savings', icon: Briefcase },
    { href: '/dashboard/goals', label: 'Goals', icon: Target },
    { href: '/dashboard/committees', label: 'Committees', icon: Users },
    { href: '/dashboard/budget', label: 'Budget Manager', icon: Wallet },
    { href: '/dashboard/learn', label: 'Literacy Hub', icon: BookOpen },
    { href: '/dashboard/family', label: 'Family Mode', icon: HeartHandshake },
    { href: '/dashboard/settings', label: 'Settings', icon: SettingsIcon },
];

export const dailySavingData: DailySaving = {
  dailyAmount: 500,
  currentBalance: 75000,
  startDate: '2024-01-01',
  isActive: true,
};

export const goalsData: Goal[] = [
  {
    id: '1',
    name: 'Buy a new car',
    targetAmount: 2500000,
    savedAmount: 1875000,
    startDate: '2023-01-15',
    endDate: '2025-01-15',
    status: 'active',
    icon: Car,
  },
  {
    id: '2',
    name: 'House Down Payment',
    targetAmount: 5000000,
    savedAmount: 2000000,
    startDate: '2022-06-01',
    status: 'active',
    icon: Home,
  },
  {
    id: '3',
    name: 'University Education',
    targetAmount: 1500000,
    savedAmount: 1500000,
    startDate: '2020-09-01',
    endDate: '2024-05-30',
    status: 'completed',
    icon: GraduationCap,
  },
];

export const committeesData: Committee[] = [
    { id: 'c1', name: 'Neighborhood Savings', owner: 'Ali Baksh', members: 12, totalPot: 600000, myContribution: 50000, nextPayout: '2024-08-15' },
    { id: 'c2', name: 'Office ROSCA', owner: 'Fatima Jilani', members: 10, totalPot: 1000000, myContribution: 100000, nextPayout: '2024-11-01' },
];

export const familyData: FamilyMember[] = [
    { id: 'f1', name: 'Ahmed Khan', role: 'parent', avatarUrl: PlaceHolderImages.find(p => p.id === 'user-avatar')?.imageUrl || '', avatarHint: 'man portrait' },
    { id: 'f2', name: 'Sana Khan', role: 'parent', avatarUrl: PlaceHolderImages.find(p => p.id === 'user-avatar-2')?.imageUrl || '', avatarHint: 'woman portrait' },
    { id: 'f3', name: 'Omar Khan', role: 'child', avatarUrl: PlaceHolderImages.find(p => p.id === 'child-avatar-1')?.imageUrl || '', avatarHint: 'child portrait' },
];

export const literacyArticlesData: LiteracyArticle[] = [
    { id: 'l1', title: 'The Power of Compounding', category: 'Investing', content: '...', imageUrl: PlaceHolderImages.find(p => p.id === 'literacy-1')?.imageUrl || '', imageHint: 'finance book', bookmarked: true },
    { id: 'l2', title: 'Understanding Your Credit Score', category: 'Credit', content: '...', imageUrl: PlaceHolderImages.find(p => p.id === 'literacy-2')?.imageUrl || '', imageHint: 'finance chart', bookmarked: false },
    { id: 'l3', title: 'How to Create a Monthly Budget', category: 'Budgeting', content: '...', imageUrl: PlaceHolderImages.find(p => p.id === 'literacy-3')?.imageUrl || '', imageHint: 'piggy bank', bookmarked: false },
    { id: 'l4', title: 'Basics of Stock Market Investing', category: 'Investing', content: '...', imageUrl: PlaceHolderImages.find(p => p.id === 'literacy-4')?.imageUrl || '', imageHint: 'financial planning', bookmarked: true },
];

export const budgetItemsData: BudgetItem[] = [
    { name: 'Milk', category: 'Groceries', price: 210 },
    { name: 'Bread', category: 'Groceries', price: 150 },
    { name: 'Petrol', category: 'Transport', price: 3000 },
    { name: 'Phone Bill', category: 'Utilities', price: 1200 },
    { name: 'Movie Tickets', category: 'Entertainment', price: 2500 },
];
