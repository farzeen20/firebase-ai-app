
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from '@/components/ui/table';
import { PlusCircle } from 'lucide-react';
import { useLanguage } from '@/context/language-context';
import type { SavingEntry } from '@/lib/definitions';
import { savingsHistoryData } from '@/lib/data';
import { format } from 'date-fns';

export function DailySavings() {
  const { t } = useLanguage();
  const [savings, setSavings] = useState<SavingEntry[]>(savingsHistoryData);
  const [newAmount, setNewAmount] = useState('');
  const [newDate, setNewDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  const handleAddSaving = () => {
    if (!newAmount || !newDate) return;

    const newEntry: SavingEntry = {
      id: `s${savings.length + 1}`,
      date: newDate,
      amount: parseFloat(newAmount),
    };

    setSavings(prev => [newEntry, ...prev].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    setNewAmount('');
  };
  
  const weeklyTotal = savings.reduce((total, entry) => {
    const entryDate = new Date(entry.date);
    const today = new Date();
    const oneWeekAgo = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 6);
    if (entryDate >= oneWeekAgo && entryDate <= today) {
        return total + entry.amount;
    }
    return total;
  }, 0);

  // Filter savings for the last 7 days to display in the table
  const recentSavings = savings.filter(entry => {
     const entryDate = new Date(entry.date);
     const today = new Date();
     const oneWeekAgo = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 6);
     return entryDate >= oneWeekAgo && entryDate <= today;
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">{t('dailySavings.title')}</h1>
        <p className="text-muted-foreground">{t('dailySavings.description')}</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
           <Card>
            <CardHeader>
                <CardTitle>Weekly Savings</CardTitle>
                <CardDescription>Your logged savings for the last 7 days.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">Amount (PKR)</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {recentSavings.length > 0 ? recentSavings.map(entry => (
                            <TableRow key={entry.id}>
                                <TableCell>{format(new Date(entry.date), 'PPP')}</TableCell>
                                <TableCell className="text-right font-medium">{entry.amount.toLocaleString()}</TableCell>
                            </TableRow>
                        )) : (
                            <TableRow>
                                <TableCell colSpan={2} className="text-center h-24 text-muted-foreground">
                                    No savings logged for this week yet.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TableHead>Weekly Total</TableHead>
                            <TableHead className="text-right text-lg font-bold">
                                PKR {weeklyTotal.toLocaleString()}
                            </TableHead>
                        </TableRow>
                    </TableFooter>
                </Table>
            </CardContent>
           </Card>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Log a New Saving</CardTitle>
              <CardDescription>Add a new entry to your savings log.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input 
                  id="date" 
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (PKR)</Label>
                <Input 
                  id="amount"
                  type="number"
                  placeholder="e.g., 500"
                  value={newAmount}
                  onChange={(e) => setNewAmount(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter>
                 <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90" onClick={handleAddSaving} disabled={!newAmount || !newDate}>
                    <PlusCircle className="me-2 h-4 w-4" /> Add Saving
                </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
