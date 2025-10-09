
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { goalsData } from '@/lib/data';
import type { Goal } from '@/lib/definitions';
import { PlusCircle, CheckCircle2, PauseCircle, Star } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useLanguage } from '@/context/language-context';

function GoalCard({ goal }: { goal: Goal }) {
  const { t } = useLanguage();
  const progress = (goal.savedAmount / goal.targetAmount) * 100;
  
  const getStatusChip = () => {
    switch(goal.status) {
      case 'active': return <div className="flex items-center gap-1 text-sm text-green-600"><Star className="w-4 h-4 fill-current" /> {t('goals.tabActive')}</div>;
      case 'completed': return <div className="flex items-center gap-1 text-sm text-blue-600"><CheckCircle2 className="w-4 h-4" /> {t('goals.tabCompleted')}</div>;
      case 'paused': return <div className="flex items-center gap-1 text-sm text-gray-500"><PauseCircle className="w-4 h-4" /> Paused</div>; // Assuming no translation for paused
      default: return null;
    }
  }

  return (
    <Card className="flex flex-col">
      <CardHeader className="flex flex-row items-start gap-4 space-y-0">
        <div className="flex-shrink-0">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <goal.icon className="w-6 h-6 text-primary" />
            </div>
        </div>
        <div className="flex-1">
          <CardTitle>{goal.name}</CardTitle>
          <CardDescription>{t('goals.goalTarget').replace('{amount}', goal.targetAmount.toLocaleString())}</CardDescription>
        </div>
        <div>
          {getStatusChip()}
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="text-2xl font-bold">PKR {goal.savedAmount.toLocaleString()}</div>
        <p className="text-xs text-muted-foreground">
          {t('goals.goalProgress').replace('{progress}', Math.round(progress).toString())}
        </p>
      </CardContent>
      <CardFooter>
        <Progress value={progress} className="h-2" />
      </CardFooter>
    </Card>
  );
}

export function GoalsList() {
    const [goals, setGoals] = useState<Goal[]>(goalsData);
    const { t } = useLanguage();

    const activeGoals = goals.filter(g => g.status === 'active');
    const completedGoals = goals.filter(g => g.status === 'completed');
    const allGoals = goals;

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">{t('goals.title')}</h1>
                    <p className="text-muted-foreground">{t('goals.description')}</p>
                </div>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
                            <PlusCircle className="me-2 h-4 w-4" /> {t('goals.addNew')}
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{t('goals.createTitle')}</DialogTitle>
                            <DialogDescription>
                                {t('goals.createDescription')}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name">{t('goals.goalName')}</Label>
                                <Input id="name" placeholder={t('goals.goalNamePlaceholder')} />
                            </div>
                             <div className="grid gap-2">
                                <Label htmlFor="target">{t('goals.targetAmount')}</Label>
                                <Input id="target" type="number" placeholder={t('goals.targetAmountPlaceholder')} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="end-date">{t('goals.targetDate')}</Label>
                                <Input id="end-date" type="date" />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="submit">{t('goals.createButton')}</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
            
            <Tabs defaultValue="active">
                <TabsList>
                    <TabsTrigger value="active">{t('goals.tabActive')} ({activeGoals.length})</TabsTrigger>
                    <TabsTrigger value="completed">{t('goals.tabCompleted')} ({completedGoals.length})</TabsTrigger>
                    <TabsTrigger value="all">{t('goals.tabAll')} ({allGoals.length})</TabsTrigger>
                </TabsList>
                <TabsContent value="active" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
                    {activeGoals.map(goal => <GoalCard key={goal.id} goal={goal} />)}
                </TabsContent>
                <TabsContent value="completed" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
                    {completedGoals.map(goal => <GoalCard key={goal.id} goal={goal} />)}
                </TabsContent>
                <TabsContent value="all" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
                    {allGoals.map(goal => <GoalCard key={goal.id} goal={goal} />)}
                </TabsContent>
            </Tabs>
        </div>
    )
}
