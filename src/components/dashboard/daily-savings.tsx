'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { dailySavingData } from '@/lib/data';
import { Minus, Plus } from 'lucide-react';

export function DailySavings() {
  const [dailyAmount, setDailyAmount] = useState(dailySavingData.dailyAmount);
  const [currentBalance, setCurrentBalance] = useState(dailySavingData.currentBalance);

  const monthlyGoal = dailyAmount * 30;
  const progress = (currentBalance / monthlyGoal) * 100;

  const handleAddSaving = () => {
    setCurrentBalance(prev => prev + dailyAmount);
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Daily Savings Tracker</h1>
        <p className="text-muted-foreground">Log your daily savings and watch your balance grow.</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Your Savings Progress</CardTitle>
            <CardDescription>
              Based on your goal of saving PKR {dailyAmount.toLocaleString()} per day.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">Current Balance</p>
              <p className="text-5xl font-bold tracking-tighter">
                PKR {currentBalance.toLocaleString()}
              </p>
            </div>
            <div className="space-y-2">
                <div className="flex justify-between text-sm text-muted-foreground">
                    <span>This Month's Goal</span>
                    <span>PKR {monthlyGoal.toLocaleString()}</span>
                </div>
                <Progress value={progress} className="h-4" />
                <p className="text-xs text-muted-foreground text-center pt-1">{Math.round(progress)}% of your monthly goal achieved.</p>
            </div>
          </CardContent>
          <CardFooter className="justify-center">
             <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90" onClick={handleAddSaving}>
                <Plus className="mr-2 h-5 w-5" /> Add Today's Saving (PKR {dailyAmount.toLocaleString()})
            </Button>
          </CardFooter>
        </Card>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Adjust Daily Amount</CardTitle>
              <CardDescription>Set how much you want to save each day.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="icon" onClick={() => setDailyAmount(d => Math.max(0, d-50))}>
                  <Minus className="h-4 w-4" />
                </Button>
                <Input 
                  type="number" 
                  className="text-center font-bold text-lg" 
                  value={dailyAmount}
                  onChange={(e) => setDailyAmount(Number(e.target.value))}
                />
                <Button variant="outline" size="icon" onClick={() => setDailyAmount(d => d+50)}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
           <Card className='bg-secondary'>
            <CardHeader>
              <CardTitle>💡 Pro Tip</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-secondary-foreground">
                Consistency is key! Try to save a small amount every day. Even PKR 100 adds up to PKR 3,000 in a month.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
