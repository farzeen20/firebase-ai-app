
'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from '@/components/ui/table';
import { PlusCircle, Trash2 } from 'lucide-react';
import { useLanguage } from '@/context/language-context';
import type { SavingEntry } from '@/lib/definitions';
import { format } from 'date-fns';
import { useUser, useFirestore, useCollection, addDocumentNonBlocking, deleteDocumentNonBlocking, useMemoFirebase } from '@/firebase';
import { collection, doc, serverTimestamp, query, orderBy, where, Timestamp } from 'firebase/firestore';

export function DailySavings() {
  const { t } = useLanguage();
  const { user } = useUser();
  const firestore = useFirestore();

  const [newAmount, setNewAmount] = useState('');
  const [newDate, setNewDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  const savingsCollectionRef = useMemoFirebase(() => {
    if (!firestore || !user?.uid) return null;
    return collection(firestore, 'users', user.uid, 'dailySavings');
  }, [firestore, user?.uid]);

  const today = new Date();
  const oneWeekAgo = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 6);

  const recentSavingsQuery = useMemoFirebase(() => {
    if (!savingsCollectionRef) return null;
    return query(
      savingsCollectionRef,
      where('createdAt', '>=', oneWeekAgo),
      where('createdAt', '<=', today),
      orderBy('createdAt', 'desc')
    );
  }, [savingsCollectionRef, oneWeekAgo, today]);


  const { data: savings, isLoading } = useCollection<SavingEntry>(recentSavingsQuery);

  const handleAddSaving = () => {
    if (!newAmount || !newDate || !savingsCollectionRef) return;

    const newEntry = {
      date: newDate,
      amount: parseFloat(newAmount),
      createdAt: serverTimestamp(),
    };

    addDocumentNonBlocking(savingsCollectionRef, newEntry);
    setNewAmount('');
  };
  
  const handleDeleteSaving = (id: string) => {
    if (!savingsCollectionRef) return;
    const docRef = doc(savingsCollectionRef.firestore, savingsCollectionRef.path, id);
    deleteDocumentNonBlocking(docRef);
  };

  const weeklyTotal = useMemo(() => {
    return savings?.reduce((total, entry) => total + entry.amount, 0) || 0;
  }, [savings]);

  const getDisplayDate = (entry: SavingEntry) => {
    if (entry.createdAt instanceof Timestamp) {
      return format(entry.createdAt.toDate(), 'PPP');
    }
    // Fallback for local additions before server timestamp is applied
    return format(new Date(entry.date), 'PPP');
  }

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
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading && <TableRow><TableCell colSpan={3} className="text-center h-24">Loading...</TableCell></TableRow>}
                        {!isLoading && savings && savings.length > 0 ? savings.map(entry => (
                            <TableRow key={entry.id}>
                                <TableCell>{getDisplayDate(entry)}</TableCell>
                                <TableCell className="text-right font-medium">{entry.amount.toLocaleString()}</TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="icon" onClick={() => handleDeleteSaving(entry.id)}>
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                        <span className="sr-only">Delete</span>
                                    </Button>
                                </TableCell>
                            </TableRow>
                        )) : (
                           !isLoading && (
                            <TableRow>
                                <TableCell colSpan={3} className="text-center h-24 text-muted-foreground">
                                    No savings logged for this week yet.
                                </TableCell>
                            </TableRow>
                           )
                        )}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TableHead>Weekly Total</TableHead>
                            <TableHead className="text-right text-lg font-bold" colSpan={2}>
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
