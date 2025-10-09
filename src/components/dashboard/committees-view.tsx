
'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { committeesData } from '@/lib/data';
import { PlusCircle, Users } from 'lucide-react';
import { useLanguage } from '@/context/language-context';

export function CommitteesView() {
    const { t } = useLanguage();
    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">{t('committees.title')}</h1>
                    <p className="text-muted-foreground">{t('committees.description')}</p>
                </div>
                <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
                    <PlusCircle className="me-2 h-4 w-4" /> {t('committees.create')}
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {committeesData.map(committee => (
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
