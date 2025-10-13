
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
import { useUser, useFirestore, useDoc, setDocumentNonBlocking, useAuth, RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from '@/firebase';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { doc } from 'firebase/firestore';
import { useEffect, useState, useRef, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';

const profileSchema = z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.string().email('Invalid email address'),
    phone: z.string().min(1, 'Phone number is required'),
    cnic: z.string().min(1, 'CNIC is required'),
    twoFAEnabled: z.boolean().optional(),
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
    const auth = useAuth();
    const firestore = useFirestore();
    const [is2faDialogOpen, setIs2faDialogOpen] = useState(false);
    const [verificationCode, setVerificationCode] = useState('');
    const [isCodeSent, setIsCodeSent] = useState(false);
    const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
    const recaptchaContainerRef = useRef<HTMLDivElement>(null);


    const userDocRef = useMemo(() => {
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
            cnic: '',
            twoFAEnabled: false,
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

        const dataToSave = { ...data };
        
        setDocumentNonBlocking(userDocRef, dataToSave, { merge: true });

        toast({
            title: 'Profile Updated',
            description: 'Your profile information has been successfully saved.',
        });
    };
    
    const setupRecaptcha = () => {
        if (!auth || !recaptchaContainerRef.current) return;
        if ((window as any).recaptchaVerifier) {
            (window as any).recaptchaVerifier.clear();
        }
        
        (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, recaptchaContainerRef.current, {
            'size': 'invisible',
            'callback': (response: any) => {
                // reCAPTCHA solved, allow signInWithPhoneNumber.
            }
        });
    };

    const handle2faToggle = (enabled: boolean) => {
        if (enabled) {
            setIsCodeSent(false);
            setVerificationCode('');
            setConfirmationResult(null);
            setIs2faDialogOpen(true);
        } else {
             if (!userDocRef) return;
            setDocumentNonBlocking(userDocRef, { twoFAEnabled: false }, { merge: true });
            form.setValue('twoFAEnabled', false);
            toast({
                title: '2FA Disabled',
                description: 'Two-factor authentication has been disabled.',
            });
        }
    };
    
    const handleSendVerificationCode = async () => {
        const phoneNumber = form.getValues('phone');
        if (!phoneNumber || !auth) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'User phone number not found.',
            });
            return;
        }

        // Setup reCAPTCHA on demand
        setupRecaptcha();
        const appVerifier = (window as any).recaptchaVerifier;

        try {
            const result = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
            setConfirmationResult(result);
            setIsCodeSent(true);
            toast({
                title: 'Code Sent!',
                description: `A verification code has been sent to ${phoneNumber}.`,
            });
        } catch (error) {
            console.error('Failed to send SMS:', error);
            toast({
                variant: 'destructive',
                title: 'Failed to Send Code',
                description: 'There was a problem sending the verification SMS. Please try again.',
            });
            // Reset reCAPTCHA so user can try again
            if ((window as any).recaptchaVerifier) {
                (window as any).recaptchaVerifier.render().then((widgetId: any) => {
                    (window as any).grecaptcha.reset(widgetId);
                });
            }
        }
    };
    
    
    const handleVerify2fa = async () => {
        if (!confirmationResult || !verificationCode) {
            toast({
                variant: 'destructive',
                title: 'Verification Error',
                description: 'Please enter the verification code.',
            });
            return;
        }
        try {
            await confirmationResult.confirm(verificationCode);
            if (!userDocRef) return;
            setDocumentNonBlocking(userDocRef, { twoFAEnabled: true }, { merge: true });
            form.setValue('twoFAEnabled', true);
            toast({
                title: '2FA Enabled!',
                description: 'Two-factor authentication has been successfully set up.',
            });
            setIs2faDialogOpen(false);
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Invalid Code',
                description: 'The verification code is incorrect. Please try again.',
            });
        }
    };


    return (
        <div className="space-y-8">
            <div ref={recaptchaContainerRef}></div>
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
                                        <FormField
                                            control={form.control}
                                            name="cnic"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>{t('settings.profile.cnic')}</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} disabled={isLoading} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
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
                                <FormField
                                    control={form.control}
                                    name="twoFAEnabled"
                                    render={({ field }) => (
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={(checked) => {
                                                // Prevent unchecking directly from UI if it's already enabled
                                                if (field.value && !checked) {
                                                    handle2faToggle(false);
                                                } else if (!field.value && checked) {
                                                    handle2faToggle(true);
                                                }
                                            }}
                                            disabled={isLoading}
                                        />
                                    )}
                                />
                            </div>
                             <div className="space-y-2">
                                <Label>{t('settings.security.changePassword')}</Label>
                                <div className="space-y-2">
                                    <Input id="current-password" type="password" placeholder={t('settings.security.currentPassword') ?? ''}/>
                                    <Input id="new-password" type="password" placeholder={t('settings.security.newPassword') ?? ''} />
                                    <Input id="confirm-new-password" type="password" placeholder={t('settings.security.confirmNewPassword') ?? ''} />
                                </div>
                                <Button className="bg-accent text-accent-foreground hover:bg-accent/90">{t('settings.security.updatePassword')}</Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
            
            <Dialog open={is2faDialogOpen} onOpenChange={setIs2faDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Enable Two-Factor Authentication</DialogTitle>
                        <DialogDescription>
                            We will send a verification code to your phone number ({form.getValues('phone')}). Enter the code below to enable 2FA.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4 space-y-4">
                        <div className="grid w-full items-center gap-1.5">
                            <Label htmlFor="verification-code">Verification Code</Label>
                            <Input 
                                id="verification-code" 
                                placeholder="Enter 6-digit code"
                                value={verificationCode}
                                onChange={(e) => setVerificationCode(e.target.value)}
                                disabled={!isCodeSent}
                            />
                        </div>
                         <Button onClick={handleSendVerificationCode} className="w-full" disabled={isCodeSent}>
                            {isCodeSent ? 'Code Sent' : 'Send Verification Code'}
                        </Button>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button onClick={handleVerify2fa} disabled={!verificationCode || !isCodeSent}>Verify &amp; Enable</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </div>
    );

}

    

    
