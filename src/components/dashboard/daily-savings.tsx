
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { dailySavingData } from '@/lib/data';
import { Minus, Plus } from 'lucide-react';
import { useLanguage } from '@/context/language-context';

export function DailySavings() {
  const [dailyAmount, setDailyAmount] = useState(dailySavingData.dailyAmount);
  const [currentBalance, setCurrentBalance] = useState(dailySavingData.currentBalance);
  const { t } = useLanguage();

  const monthlyGoal = dailyAmount * 30;
  const progress = (currentBalance / monthlyGoal) * 100;

  const handleAddSaving = () => {
    setCurrentBalance(prev => prev + dailyAmount);
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">{t('dailySavings.title')}</h1>
        <p className="text-muted-foreground">{t('dailySavings.description')}</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>{t('dailySavings.yourProgress')}</CardTitle>
            <CardDescription>
              {t('dailySavings.basedOnGoal').replace('{amount}', dailyAmount.toLocaleString())}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">{t('dailySavings.currentBalance')}</p>
              <p className="text-5xl font-bold tracking-tighter">
                PKR {currentBalance.toLocaleString()}
              </p>
            </div>
            <div className="space-y-2">
                <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{t('dailySavings.monthlyGoal')}</span>
                    <span>PKR {monthlyGoal.toLocaleString()}</span>
                </div>
                <Progress value={progress} className="h-4" />
                <p className="text-xs text-muted-foreground text-center pt-1">{t('dailySavings.progressAchieved').replace('{progress}', Math.round(progress).toString())}</p>
            </div>
          </CardContent>
          <CardFooter className="justify-center">
             <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90" onClick={handleAddSaving}>
                <Plus className="me-2 h-5 w-5" /> {t('dailySavings.addTodaySaving').replace('{amount}', dailyAmount.toLocaleString())}
            </Button>
          </CardFooter>
        </Card>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>{t('dailySavings.adjustAmount')}</CardTitle>
              <CardDescription>{t('dailySavings.adjustAmountDescription')}</CardDescription>
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
              <CardTitle>{t('dailySavings.proTip')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-secondary-foreground">
                {t('dailySavings.proTipContent')}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
