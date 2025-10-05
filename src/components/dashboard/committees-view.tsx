'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { committeesData } from '@/lib/data';
import { PlusCircle, Users } from 'lucide-react';

export function CommitteesView() {
    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Committees (ROSCAs)</h1>
                    <p className="text-muted-foreground">Collaborate on savings with your community.</p>
                </div>
                <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
                    <PlusCircle className="mr-2 h-4 w-4" /> Create Committee
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {committeesData.map(committee => (
                    <Card key={committee.id}>
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle>{committee.name}</CardTitle>
                                    <CardDescription>Owned by {committee.owner}</CardDescription>
                                </div>
                                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                                    <Users className="h-4 w-4" />
                                    <span>{committee.members} Members</span>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-muted-foreground">Total Pot</p>
                                <p className="text-2xl font-bold">PKR {committee.totalPot.toLocaleString()}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-muted-foreground">Your Contribution</p>
                                <p className="text-2xl font-bold">PKR {committee.myContribution.toLocaleString()}</p>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-between items-center bg-secondary/50 py-3 px-6">
                            <div className="text-sm">
                                <span className="text-muted-foreground">Next Payout: </span>
                                <span className="font-semibold">{committee.nextPayout}</span>
                            </div>
                            <Button variant="outline">View Details</Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
             <Card className="mt-8 text-center bg-secondary">
                <CardHeader>
                    <CardTitle>Want to join a committee?</CardTitle>
                    <CardDescription>Browse public committees in your area or join a private one with an invite code.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button>
                        Browse Public Committees
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
