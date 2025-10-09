'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/context/language-context';

export function SettingsView() {
    const { language, setLanguage, t } = useLanguage();
    const languages = [
        { value: 'en', label: 'English' },
        { value: 'ur', label: 'Urdu' }
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">{t('settings.title')}</h1>
                <p className="text-muted-foreground">{t('settings.description')}</p>
            </div>

            <Tabs defaultValue="profile" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="profile">{t('settings.tabs.profile')}</TabsTrigger>
                    <TabsTrigger value="language">{t('settings.tabs.language')}</TabsTrigger>
                    <TabsTrigger value="security">{t('settings.tabs.security')}</TabsTrigger>
                </TabsList>
                <TabsContent value="profile">
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('settings.profile.title')}</CardTitle>
                            <CardDescription>{t('settings.profile.description')}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="first-name">{t('settings.profile.firstName')}</Label>
                                    <Input id="first-name" defaultValue="Ayesha" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="last-name">{t('settings.profile.lastName')}</Label>
                                    <Input id="last-name" defaultValue="Khan" />
                                </div>
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="email">{t('settings.profile.email')}</Label>
                                <Input id="email" type="email" defaultValue="ayesha.khan@example.com" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="cnic">{t('settings.profile.cnic')}</Label>
                                    <Input id="cnic" defaultValue="XXXXX-XXXXXXX-X" disabled />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">{t('settings.profile.phone')}</Label>
                                    <Input id="phone" defaultValue="+92 3XX XXXXXXX" />
                                </div>
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="bank-account">{t('settings.profile.bankAccount')}</Label>
                                <Input id="bank-account" defaultValue="PKXX XXXX ... XXXX" disabled />
                            </div>
                            <Button className="bg-accent text-accent-foreground hover:bg-accent/90">{t('settings.profile.saveChanges')}</Button>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="language">
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('settings.language.title')}</CardTitle>
                            <CardDescription>{t('settings.language.description')}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="language">{t('settings.language.appLanguage')}</Label>
                                 <Select value={language} onValueChange={(value) => setLanguage(value as 'en' | 'ur')}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a language" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {languages.map(lang => (
                                            <SelectItem key={lang.value} value={lang.value}>{lang.label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                             <Button className="bg-accent text-accent-foreground hover:bg-accent/90">{t('settings.language.saveLanguage')}</Button>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="security">
                     <Card>
                        <CardHeader>
                            <CardTitle>{t('settings.security.title')}</CardTitle>
                            <CardDescription>{t('settings.security.description')}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                    <Label className="text-base">{t('settings.security.twoFactor')}</Label>
                                    <p className="text-sm text-muted-foreground">
                                        {t('settings.security.twoFactorDescription')}
                                    </p>
                                </div>
                                <Switch />
                            </div>
                             <div className="space-y-2">
                                <Label>{t('settings.security.changePassword')}</Label>
                                <div className="space-y-2">
                                    <Input id="current-password" type="password" placeholder={t('settings.security.currentPassword') ?? ''}/>
                                    <Input id="new-password" type="password" placeholder={t('settings.security.newPassword') ?? ''} />
                                </div>
                                <Button className="bg-accent text-accent-foreground hover:bg-accent/90">{t('settings.security.updatePassword')}</Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
