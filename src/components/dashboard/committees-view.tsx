
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { committeesData } from '@/lib/data';
import type { Committee } from '@/lib/definitions';
import { PlusCircle, Users } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/context/language-context';

export function CommitteesView() {
    const { t } = useLanguage();
    const [committees, setCommittees] = useState<Committee[]>(committeesData);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    
    const [title, setTitle] = useState('');
    const [perMemberAmount, setPerMemberAmount] = useState('');
    const [members, setMembers] = useState('');
    const [tenure, setTenure] = useState('');

    const isFormValid = title.trim() !== '' && perMemberAmount.trim() !== '' && members.trim() !== '' && tenure.trim() !== '';

    const handleCreateCommittee = () => {
        if (!isFormValid) return;

        const newCommittee: Committee = {
            id: `c${committees.length + 1}`,
            name: title,
            owner: 'You', // Assuming the current user is the owner
            members: parseInt(members, 10),
            totalPot: parseInt(perMemberAmount, 10) * parseInt(members, 10),
            myContribution: parseInt(perMemberAmount, 10),
            nextPayout: 'TBD',
        };

        setCommittees(prev => [newCommittee, ...prev]);
        
        // Reset form and close dialog
        setTitle('');
        setPerMemberAmount('');
        setMembers('');
        setTenure('');
        setIsDialogOpen(false);
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">{t('committees.title')}</h1>
                    <p className="text-muted-foreground">{t('committees.description')}</p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
                            <PlusCircle className="me-2 h-4 w-4" /> {t('committees.create')}
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create a New Committee</DialogTitle>
                            <DialogDescription>
                                Fill in the details to start a new savings committee.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="title">Committee Title</Label>
                                <Input id="title" placeholder="e.g., Office Lunch Club" value={title} onChange={(e) => setTitle(e.target.value)} />
                            </div>
                             <div className="grid gap-2">
                                <Label htmlFor="amount">Per Member Amount (PKR)</Label>
                                <Input id="amount" type="number" placeholder="e.g., 5000" value={perMemberAmount} onChange={(e) => setPerMemberAmount(e.target.value)} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="members">Number of Members</Label>
                                    <Input id="members" type="number" placeholder="e.g., 10" value={members} onChange={(e) => setMembers(e.target.value)} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="tenure">Payment Tenure</Label>
                                    <Input id="tenure" placeholder="e.g., Monthly" value={tenure} onChange={(e) => setTenure(e.target.value)} />
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline" onClick={() => {
                                    setTitle('');
                                    setPerMemberAmount('');
                                    setMembers('');
                                    setTenure('');
                                }}>Cancel</Button>
                            </DialogClose>
                            <Button onClick={handleCreateCommittee} disabled={!isFormValid}>
                                Create Committee
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {committees.map(committee => (
                    <Card key={committee.id}>
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle>{committee.name}</CardTitle>
                                    <CardDescription>{t('committees.ownedBy').replace('{owner}', committee.owner)}</CardDescription>
                                </div>
                                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                                    <Users className="h-4 w-4" />
                                    <span>{t('committees.members').replace('{count}', committee.members.toString())}</span>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-muted-foreground">{t('committees.totalPot')}</p>
                                <p className="text-2xl font-bold">PKR {committee.totalPot.toLocaleString()}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-muted-foreground">{t('committees.yourContribution')}</p>
                                <p className="text-2xl font-bold">PKR {committee.myContribution.toLocaleString()}</p>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-between items-center bg-secondary/50 py-3 px-6">
                            <div className="text-sm">
                                <span className="text-muted-foreground">{t('committees.nextPayout')}</span>
                                <span className="font-semibold">{committee.nextPayout}</span>
                            </div>
                            <Button variant="outline">{t('committees.viewDetails')}</Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
             <Card className="mt-8 text-center bg-secondary">
                <CardHeader>
                    <CardTitle>{t('committees.joinTitle')}</CardTitle>
                    <CardDescription>{t('committees.joinDescription')}</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button>
                        {t('committees.browsePublic')}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
