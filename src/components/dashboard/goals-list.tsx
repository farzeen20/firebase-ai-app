
'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import type { Goal } from '@/lib/definitions';
import { PlusCircle, CheckCircle2, PauseCircle, Star, PiggyBank, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useLanguage } from '@/context/language-context';
import { useUser, useFirestore, useCollection, addDocumentNonBlocking, deleteDocumentNonBlocking, useMemoFirebase } from '@/firebase';
import { collection, doc, serverTimestamp } from 'firebase/firestore';

function GoalCard({ goal, onDelete }: { goal: Goal; onDelete: (id: string) => void; }) {
  const { t } = useLanguage();
  const progress = (goal.savedAmount / goal.targetAmount) * 100;
  
  const getStatusChip = () => {
    switch(goal.status) {
      case 'active': return <div className="flex items-center gap-1 text-sm text-green-600"><Star className="w-4 h-4 fill-current" /> {t('goals.tabActive')}</div>;
      case 'completed': return <div className="flex items-center gap-1 text-sm text-blue-600"><CheckCircle2 className="w-4 h-4" /> {t('goals.tabCompleted')}</div>;
      case 'paused': return <div className="flex items-center gap-1 text-sm text-gray-500"><PauseCircle className="w-4 h-4" /> Paused</div>;
      default: return null;
    }
  }

  return (
    <Card className="flex flex-col">
      <CardHeader className="flex-row items-start justify-between gap-4 space-y-0">
        <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <PiggyBank className="w-6 h-6 text-primary" />
                </div>
            </div>
            <div className="flex-1">
              <CardTitle>{goal.name}</CardTitle>
              <CardDescription>{t('goals.goalTarget').replace('{amount}', goal.targetAmount.toLocaleString())}</CardDescription>
            </div>
        </div>
        <div className="flex flex-col items-end gap-1 flex-shrink-0">
          {getStatusChip()}
          <Button variant="ghost" size="icon" className="h-6 w-6 self-end" onClick={() => onDelete(goal.id)}>
              <Trash2 className="h-4 w-4 text-destructive" />
              <span className="sr-only">Delete Goal</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-grow pt-2">
      </CardContent>
      <CardFooter className="items-center">
        <Progress value={progress} className="h-2 flex-1" />
        <span className="text-xs text-muted-foreground ml-2">{Math.round(progress)}%</span>
      </CardFooter>
    </Card>
  );
}

export function GoalsList() {
    const { t } = useLanguage();
    const { user } = useUser();
    const firestore = useFirestore();

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [newGoalName, setNewGoalName] = useState('');
    const [newGoalTarget, setNewGoalTarget] = useState('');
    const [newGoalDate, setNewGoalDate] = useState('');
    
    const goalsCollectionRef = useMemoFirebase(() => {
        if (!firestore || !user?.uid) return null;
        return collection(firestore, 'users', user.uid, 'goals');
    }, [firestore, user?.uid]);

    const { data: goals, isLoading } = useCollection<Goal>(goalsCollectionRef);

    const handleAddGoal = () => {
        if (!newGoalName || !newGoalTarget || !goalsCollectionRef) return;

        const newGoal = {
            name: newGoalName,
            targetAmount: parseFloat(newGoalTarget),
            savedAmount: 0,
            startDate: serverTimestamp(),
            endDate: newGoalDate || null,
            status: 'active',
        };

        addDocumentNonBlocking(goalsCollectionRef, newGoal);
        
        setNewGoalName('');
        setNewGoalTarget('');
        setNewGoalDate('');
        setIsDialogOpen(false);
    };

    const handleDeleteGoal = (id: string) => {
        if (!goalsCollectionRef) return;
        const docRef = doc(goalsCollectionRef.firestore, goalsCollectionRef.path, id);
        deleteDocumentNonBlocking(docRef);
    };

    const isFormValid = newGoalName.trim() !== '' && newGoalTarget.trim() !== '';

    const activeGoals = useMemo(() => goals?.filter(g => g.status === 'active') || [], [goals]);
    const completedGoals = useMemo(() => goals?.filter(g => g.status === 'completed') || [], [goals]);
    const allGoals = goals || [];

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">{t('goals.title')}</h1>
                    <p className="text-muted-foreground">{t('goals.description')}</p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
                                <Input 
                                    id="name" 
                                    placeholder={t('goals.goalNamePlaceholder')} 
                                    value={newGoalName}
                                    onChange={(e) => setNewGoalName(e.target.value)}
                                />
                            </div>
                             <div className="grid gap-2">
                                <Label htmlFor="target">{t('goals.targetAmount')}</Label>
                                <Input 
                                    id="target" 
                                    type="number" 
                                    placeholder={t('goals.targetAmountPlaceholder')} 
                                    value={newGoalTarget}
                                    onChange={(e) => setNewGoalTarget(e.target.value)}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="end-date">{t('goals.targetDate')}</Label>
                                <Input 
                                    id="end-date" 
                                    type="date"
                                    value={newGoalDate}
                                    onChange={(e) => setNewGoalDate(e.target.value)}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                            </DialogClose>
                            <Button onClick={handleAddGoal} disabled={!isFormValid}>
                                {t('goals.createButton')}
                            </Button>
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
                <TabsContent value="active" className="pt-4">
                   {isLoading && <p>Loading goals...</p>}
                   {!isLoading && activeGoals.length === 0 && <p className="text-muted-foreground">No active goals yet. Create one to get started!</p>}
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {activeGoals.map(goal => <GoalCard key={goal.id} goal={goal} onDelete={handleDeleteGoal} />)}
                   </div>
                </TabsContent>
                <TabsContent value="completed" className="pt-4">
                   {isLoading && <p>Loading goals...</p>}
                   {!isLoading && completedGoals.length === 0 && <p className="text-muted-foreground">No completed goals yet.</p>}
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {completedGoals.map(goal => <GoalCard key={goal.id} goal={goal} onDelete={handleDeleteGoal} />)}
                   </div>
                </TabsContent>
                <TabsContent value="all" className="pt-4">
                   {isLoading && <p>Loading goals...</p>}
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {allGoals.map(goal => <GoalCard key={goal.id} goal={goal} onDelete={handleDeleteGoal} />)}
                   </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}
