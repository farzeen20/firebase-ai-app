
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/context/language-context';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useUser, useFirestore, useMemoFirebase, useDoc, setDocumentNonBlocking } from '@/firebase';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { doc } from 'firebase/firestore';
import { useEffect } from 'react';

const profileSchema = z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.string().email('Invalid email address'),
    phone: z.string().min(1, 'Phone number is required'),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export function SettingsView() {
    const { language, setLanguage, t } = useLanguage();
    const languages = [
        { value: 'en', label: 'English' },
        { value: 'ur', label: 'Urdu' }
    ];
    const { toast } = useToast();
    const { user } = useUser();
    const firestore = useFirestore();

    const userDocRef = useMemoFirebase(() => {
        if (!firestore || !user?.uid) return null;
        return doc(firestore, 'users', user.uid);
    }, [firestore, user?.uid]);

    const { data: userData, isLoading } = useDoc<ProfileFormValues>(userDocRef);

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
        },
    });

    useEffect(() => {
        if (userData) {
            form.reset(userData);
        }
    }, [userData, form]);

    const onProfileSubmit = (data: ProfileFormValues) => {
        if (!userDocRef) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'User not found.',
            });
            return;
        }

        setDocumentNonBlocking(userDocRef, data, { merge: true });

        toast({
            title: 'Profile Updated',
            description: 'Your profile information has been successfully saved.',
        });
    };

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
                        <CardContent>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onProfileSubmit)} className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="firstName"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>{t('settings.profile.firstName')}</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} disabled={isLoading} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="lastName"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>{t('settings.profile.lastName')}</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} disabled={isLoading} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>{t('settings.profile.email')}</FormLabel>
                                                <FormControl>
                                                    <Input type="email" {...field} disabled={isLoading} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="cnic">{t('settings.profile.cnic')}</Label>
                                            <Input id="cnic" value={userData ? (userData as any).cnic : ''} disabled />
                                        </div>
                                         <FormField
                                            control={form.control}
                                            name="phone"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>{t('settings.profile.phone')}</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} disabled={isLoading} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <Button type="submit" className="bg-accent text-accent-foreground hover:bg-accent/90" disabled={form.formState.isSubmitting || isLoading}>
                                        {form.formState.isSubmitting ? 'Saving...' : t('settings.profile.saveChanges')}
                                    </Button>
                                </form>
                            </Form>
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
