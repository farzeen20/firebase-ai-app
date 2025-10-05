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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

function GoalCard({ goal }: { goal: Goal }) {
  const progress = (goal.savedAmount / goal.targetAmount) * 100;
  
  const getStatusChip = () => {
    switch(goal.status) {
      case 'active': return <div className="flex items-center gap-1 text-sm text-green-600"><Star className="w-4 h-4 fill-current" /> Active</div>;
      case 'completed': return <div className="flex items-center gap-1 text-sm text-blue-600"><CheckCircle2 className="w-4 h-4" /> Completed</div>;
      case 'paused': return <div className="flex items-center gap-1 text-sm text-gray-500"><PauseCircle className="w-4 h-4" /> Paused</div>;
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
          <CardDescription>Target: PKR {goal.targetAmount.toLocaleString()}</CardDescription>
        </div>
        <div>
          {getStatusChip()}
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="text-2xl font-bold">PKR {goal.savedAmount.toLocaleString()}</div>
        <p className="text-xs text-muted-foreground">
          {Math.round(progress)}% of your goal
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

    const activeGoals = goals.filter(g => g.status === 'active');
    const completedGoals = goals.filter(g => g.status === 'completed');
    const allGoals = goals;


    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Saving Goals</h1>
                    <p className="text-muted-foreground">Define your targets and track your progress towards achieving them.</p>
                </div>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
                            <PlusCircle className="mr-2 h-4 w-4" /> Add New Goal
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create a New Goal</DialogTitle>
                            <DialogDescription>
                                What are you saving for? Let's set it up.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Goal Name</Label>
                                <Input id="name" placeholder="e.g., New Laptop" />
                            </div>
                             <div className="grid gap-2">
                                <Label htmlFor="target">Target Amount (PKR)</Label>
                                <Input id="target" type="number" placeholder="e.g., 150000" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="end-date">Target Date (Optional)</Label>
                                <Input id="end-date" type="date" />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="submit">Create Goal</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
            
            <Tabs defaultValue="active">
                <TabsList>
                    <TabsTrigger value="active">Active ({activeGoals.length})</TabsTrigger>
                    <TabsTrigger value="completed">Completed ({completedGoals.length})</TabsTrigger>
                    <TabsTrigger value="all">All ({allGoals.length})</TabsTrigger>
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
