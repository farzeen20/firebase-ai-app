'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function SettingsView() {
    const languages = [
        "English", "Urdu", "Punjabi", "Saraiki", "Sindhi", "Balochi", "Pashto"
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Settings</h1>
                <p className="text-muted-foreground">Manage your account settings and preferences.</p>
            </div>

            <Tabs defaultValue="profile" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="profile">Profile</TabsTrigger>
                    <TabsTrigger value="language">Language</TabsTrigger>
                    <TabsTrigger value="security">Security</TabsTrigger>
                </TabsList>
                <TabsContent value="profile">
                    <Card>
                        <CardHeader>
                            <CardTitle>Profile Information</CardTitle>
                            <CardDescription>Update your personal details here.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="first-name">First Name</Label>
                                    <Input id="first-name" defaultValue="Ayesha" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="last-name">Last Name</Label>
                                    <Input id="last-name" defaultValue="Khan" />
                                </div>
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" defaultValue="ayesha.khan@example.com" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="cnic">CNIC</Label>
                                    <Input id="cnic" defaultValue="XXXXX-XXXXXXX-X" disabled />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone Number</Label>
                                    <Input id="phone" defaultValue="+92 3XX XXXXXXX" />
                                </div>
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="bank-account">Bank Account (IBAN)</Label>
                                <Input id="bank-account" defaultValue="PKXX XXXX ... XXXX" disabled />
                            </div>
                            <Button className="bg-accent text-accent-foreground hover:bg-accent/90">Save Changes</Button>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="language">
                    <Card>
                        <CardHeader>
                            <CardTitle>Language and Region</CardTitle>
                            <CardDescription>Choose the language you want to experience the app in.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="language">App Language</Label>
                                 <Select defaultValue="English">
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a language" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {languages.map(lang => (
                                            <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                             <Button className="bg-accent text-accent-foreground hover:bg-accent/90">Save Language</Button>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="security">
                     <Card>
                        <CardHeader>
                            <CardTitle>Security</CardTitle>
                            <CardDescription>Manage your account's security settings.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                    <Label className="text-base">Two-Factor Authentication (2FA)</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Add an extra layer of security to your account.
                                    </p>
                                </div>
                                <Switch />
                            </div>
                             <div className="space-y-2">
                                <Label>Change Password</Label>
                                <div className="space-y-2">
                                    <Input id="current-password" type="password" placeholder="Current Password"/>
                                    <Input id="new-password" type="password" placeholder="New Password" />
                                </div>
                                <Button className="bg-accent text-accent-foreground hover:bg-accent/90">Update Password</Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
