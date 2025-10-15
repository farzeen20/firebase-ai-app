
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
import { Switch } from '../ui/switch';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export function FamilyMode() {
    const { t } = useLanguage();
    const [members, setMembers] = useState<FamilyMember[]>(familyData);
    const [isAddMemberDialogOpen, setIsAddMemberDialogOpen] = useState(false);
    const [isContributeDialogOpen, setIsContributeDialogOpen] = useState(false);
    const [isControlsDialogOpen, setIsControlsDialogOpen] = useState(false);
    const [contributionAmount, setContributionAmount] = useState('');

    // Add Member Form state
    const [name, setName] = useState('');
    const [role, setRole] = useState<'parent' | 'child' | ''>('');

    const parents = members.filter(m => m.role === 'parent');
    const children = members.filter(m => m.role === 'child');

    const [sharedGoal, setSharedGoal] = useState({
        name: "Family Vacation to Murree",
        targetAmount: 200000,
        savedAmount: 120000
    });
    
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
        setIsAddMemberDialogOpen(false);
    }
    
    const handleContribute = () => {
        const amount = parseFloat(contributionAmount);
        if (isNaN(amount) || amount <= 0) return;

        setSharedGoal(prev => ({
            ...prev,
            savedAmount: prev.savedAmount + amount
        }));
        setContributionAmount('');
        setIsContributeDialogOpen(false);
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">{t('family.title')}</h1>
                    <p className="text-muted-foreground">{t('family.description')}</p>
                </div>
                <Dialog open={isAddMemberDialogOpen} onOpenChange={setIsAddMemberDialogOpen}>
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
                                <Dialog open={isContributeDialogOpen} onOpenChange={setIsContributeDialogOpen}>
                                    <DialogTrigger asChild>
                                        <Button>
                                            <PlusCircle className="me-2 h-4 w-4" /> {t('family.contribute')}
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Contribute to Family Goal</DialogTitle>
                                            <DialogDescription>
                                                How much would you like to contribute to &quot;{sharedGoal.name}&quot;?
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="grid gap-4 py-4">
                                            <div className="grid gap-2">
                                                <Label htmlFor="contribution-amount">Amount (PKR)</Label>
                                                <Input id="contribution-amount" type="number" placeholder="e.g., 5000" value={contributionAmount} onChange={(e) => setContributionAmount(e.target.value)} />
                                            </div>
                                        </div>
                                        <DialogFooter>
                                            <DialogClose asChild>
                                                <Button variant="outline">Cancel</Button>
                                            </DialogClose>
                                            <Button onClick={handleContribute} disabled={!contributionAmount || parseFloat(contributionAmount) <= 0}>Contribute</Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
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
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <ShieldCheck className="h-5 w-5 text-primary" />
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Parental Controls Active</p>
                                        </TooltipContent>
                                    </Tooltip>
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
                         <Dialog open={isControlsDialogOpen} onOpenChange={setIsControlsDialogOpen}>
                            <DialogTrigger asChild>
                                <Button variant="outline" className="w-full">
                                    <Shield className="me-2 h-4 w-4" /> Manage Controls
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Parental Controls</DialogTitle>
                                    <DialogDescription>
                                        Manage savings and spending controls for your children.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-6 py-4">
                                    <div className="flex items-center justify-between rounded-lg border p-3">
                                        <div className="space-y-0.5">
                                            <Label htmlFor="spending-limit">Set spending limits</Label>
                                            <p className="text-xs text-muted-foreground">
                                                Children will need approval for spending over a set amount.
                                            </p>
                                        </div>
                                        <Switch id="spending-limit" />
                                    </div>
                                    <div className="flex items-center justify-between rounded-lg border p-3">
                                        <div className="space-y-0.5">
                                            <Label htmlFor="goal-approval">Goal approval</Label>
                                            <p className="text-xs text-muted-foreground">
                                                Require parental approval for new savings goals.
                                            </p>
                                        </div>
                                        <Switch id="goal-approval" defaultChecked />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <DialogClose asChild>
                                        <Button>Done</Button>
                                    </DialogClose>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );

    