
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Circle, Trophy } from 'lucide-react';
import { useLanguage } from '@/context/language-context';
import { cn } from '@/lib/utils';
import { Badge } from '../ui/badge';

const challenges = [
    { id: 1, title: "Save for a Week", description: "Save money every day for 7 days in a row.", points: 20, completed: true },
    { id: 2, title: "No-Spend Day", description: "Go a full day without spending any money on non-essentials.", points: 15, completed: true },
    { id: 3, title: "Goal Starter", description: "Create your very first savings goal.", points: 10, completed: false },
    { id: 4, title: "Budget Boss", description: "Help your parents categorize a grocery receipt.", points: 25, completed: false },
];

const badges = [
    { name: "Savings Starter", icon: <Trophy className="w-8 h-8 text-yellow-500" />, earned: true },
    { name: "Frugal Frog", icon: <Trophy className="w-8 h-8 text-gray-400" />, earned: true },
    { name: "Goal Getter", icon: <Trophy className="w-8 h-8 text-gray-400" />, earned: false },
    { name: "Budget Buddy", icon: <Trophy className="w-8 h-8 text-gray-400" />, earned: false },
];

export function FamilyChallenges() {
    const { t } = useLanguage();

    const totalPoints = challenges.reduce((sum, challenge) => challenge.completed ? sum + challenge.points : sum, 0);

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Kids' Corner: Learning Mode</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>Saving Challenges</CardTitle>
                        <CardDescription>Complete challenges to earn points and unlock badges!</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {challenges.map(challenge => (
                            <div key={challenge.id} className={cn("flex items-center gap-4 p-4 rounded-lg border", challenge.completed ? "bg-primary/10 border-primary/20" : "bg-secondary/50")}>
                                {challenge.completed ? <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0" /> : <Circle className="h-6 w-6 text-muted-foreground flex-shrink-0" />}
                                <div className="flex-grow">
                                    <p className="font-semibold">{challenge.title}</p>
                                    <p className="text-sm text-muted-foreground">{challenge.description}</p>
                                </div>
                                <Badge variant={challenge.completed ? "default" : "secondary"}>{challenge.points} PTS</Badge>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>My Badges</CardTitle>
                        <CardDescription>Your collection of achievements.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="text-center p-4 bg-secondary rounded-lg">
                            <p className="text-sm font-medium text-muted-foreground">Total Points</p>
                            <p className="text-4xl font-bold text-primary">{totalPoints}</p>
                        </div>
                        <div className="grid grid-cols-3 gap-4 pt-4">
                            {badges.map(badge => (
                                <div key={badge.name} className={cn("flex flex-col items-center justify-center text-center gap-1 p-2 rounded-lg", !badge.earned && "opacity-40")}>
                                    {badge.icon}
                                    <p className="text-xs font-medium">{badge.name}</p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

            </div>
        </div>
    );
}


    