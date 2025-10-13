
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { familyData } from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PlusCircle, Shield, UserPlus, ShieldCheck } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useLanguage } from '@/context/language-context';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { FamilyMember } from '@/lib/definitions';

export function FamilyMode() {
    const { t } = useLanguage();
    const [members, setMembers] = useState<FamilyMember[]>(familyData);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // Form state
    const [name, setName] = useState('');
    const [role, setRole] = useState<'parent' | 'child' | ''>('');

    const parents = members.filter(m => m.role === 'parent');
    const children = members.filter(m => m.role === 'child');

    const sharedGoal = {
        name: "Family Vacation to Murree",
        targetAmount: 200000,
        savedAmount: 120000
    };
    const progress = (sharedGoal.savedAmount / sharedGoal.targetAmount) * 100;

    const handleAddMember = () => {
        if (!name || !role) return;

        const newMember: FamilyMember = {
            id: `f${members.length + 1}`,
            name,
            role: role as 'parent' | 'child',
            avatarUrl: `https://picsum.photos/seed/${Math.random()}/100/100`,
            avatarHint: 'person portrait',
        };
        setMembers(prev => [newMember, ...prev]);

        // Reset form
        setName('');
        setRole('');
        setIsDialogOpen(false);
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">{t('family.title')}</h1>
                    <p className="text-muted-foreground">{t('family.description')}</p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                         <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
                            <UserPlus className="me-2 h-4 w-4" /> {t('family.addMember')}
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add a New Family Member</DialogTitle>
                            <DialogDescription>
                                Invite a family member and assign them a role.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Member Name</Label>
                                <Input id="name" placeholder="e.g., Ali Khan" value={name} onChange={e => setName(e.target.value)} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="role">Role</Label>
                                <Select onValueChange={(value) => setRole(value as 'parent' | 'child')} value={role}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="parent">Parent</SelectItem>
                                        <SelectItem value="child">Child</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                            </DialogClose>
                            <Button onClick={handleAddMember} disabled={!name || !role}>Add Member</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('family.sharedGoal')}</CardTitle>
                            <CardDescription>{t('family.sharedGoalDescription')}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-semibold">{sharedGoal.name}</h3>
                                <Button variant="outline">
                                    <PlusCircle className="me-2 h-4 w-4" /> {t('family.contribute')}
                                </Button>
                            </div>
                             <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="font-bold text-lg">PKR {sharedGoal.savedAmount.toLocaleString()}</span>
                                    <span className="text-muted-foreground">{t('family.of')} PKR {sharedGoal.targetAmount.toLocaleString()}</span>
                                </div>
                                <Progress value={progress} className="h-4" />
                                <p className="text-xs text-muted-foreground text-center pt-1">{t('family.sharedGoalProgress').replace('{progress}', Math.round(progress).toString())}</p>
                            </div>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader>
                            <CardTitle>{t('family.childrenSavings')}</CardTitle>
                            <CardDescription>{t('family.childrenSavingsDescription')}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {children.map(child => (
                                     <div key={child.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-secondary">
                                        <div className="flex items-center gap-4">
                                            <Avatar>
                                                <AvatarImage src={child.avatarUrl} alt={child.name} data-ai-hint={child.avatarHint} />
                                                <AvatarFallback>{child.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <p className="font-medium">{t('family.childSaving').replace('{name}', child.name)}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-lg">PKR 15,000</p>
                                            <p className="text-xs text-muted-foreground">{t('family.childGoal').replace('{goal}', 'New Bicycle')}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>{t('family.members')}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <h4 className="font-semibold text-sm mb-2">{t('family.parents')}</h4>
                             {parents.map(member => (
                                <div key={member.id} className="flex items-center gap-3 mb-2 p-2 rounded-lg hover:bg-secondary">
                                    <Avatar>
                                        <AvatarImage src={member.avatarUrl} alt={member.name} data-ai-hint={member.avatarHint} />
                                        <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <span className="font-medium">{member.name}</span>
                                    <ShieldCheck className="h-5 w-5 text-primary" title="Parental Controls Active" />
                                </div>
                            ))}
                        </div>
                        <div>
                             <h4 className="font-semibold text-sm mb-2">{t('family.children')}</h4>
                             {children.map(member => (
                                <div key={member.id} className="flex items-center gap-3 mb-2 p-2 rounded-lg hover:bg-secondary">
                                    <Avatar>
                                        <AvatarImage src={member.avatarUrl} alt={member.name} data-ai-hint={member.avatarHint} />
                                        <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <span className="font-medium">{member.name}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                    <CardFooter>
                         <Button variant="outline" className="w-full">Manage Controls</Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}

    