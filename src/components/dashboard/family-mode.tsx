
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { familyData } from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PlusCircle, Shield, UserPlus } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useLanguage } from '@/context/language-context';

export function FamilyMode() {
    const { t } = useLanguage();
    const parents = familyData.filter(m => m.role === 'parent');
    const children = familyData.filter(m => m.role === 'child');

    const sharedGoal = {
        name: "Family Vacation to Murree",
        targetAmount: 200000,
        savedAmount: 120000
    };
    const progress = (sharedGoal.savedAmount / sharedGoal.targetAmount) * 100;

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">{t('family.title')}</h1>
                    <p className="text-muted-foreground">{t('family.description')}</p>
                </div>
                 <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
                    <UserPlus className="me-2 h-4 w-4" /> {t('family.addMember')}
                </Button>
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
                                <div key={member.id} className="flex items-center gap-3 mb-2">
                                    <Avatar>
                                        <AvatarImage src={member.avatarUrl} alt={member.name} data-ai-hint={member.avatarHint} />
                                        <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <span className="font-medium">{member.name}</span>
                                    <Shield className="h-4 w-4 text-accent" />
                                </div>
                            ))}
                        </div>
                        <div>
                             <h4 className="font-semibold text-sm mb-2">{t('family.children')}</h4>
                             {children.map(member => (
                                <div key={member.id} className="flex items-center gap-3 mb-2">
                                    <Avatar>
                                        <AvatarImage src={member.avatarUrl} alt={member.name} data-ai-hint={member.avatarHint} />
                                        <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <span className="font-medium">{member.name}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
