
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useAuth, useFirestore, setDocumentNonBlocking } from '@/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/context/language-context';


const registerSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  cnic: z.string().min(1, 'CNIC is required'),
  phone: z.string().min(1, 'Phone number is required'),
  bankAccount: z.string().min(1, 'Bank account is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type RegisterFormValues = z.infer<typeof registerSchema>;


export function RegisterForm() {
  const router = useRouter();
  const auth = useAuth();
  const firestore = useFirestore();
  const { toast } = useToast();
  const { t } = useLanguage();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      cnic: '',
      phone: '',
      bankAccount: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    if (!auth || !firestore) {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'Firebase is not initialized correctly.',
      });
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      const user = userCredential.user;

      if (user) {
        const userDocRef = doc(firestore, 'users', user.uid);
        const { password, ...userData } = data;
        setDocumentNonBlocking(userDocRef, { ...userData, id: user.uid }, { merge: true });

        if (typeof window !== 'undefined') {
          localStorage.setItem('bachatbuddy_onboarding', 'true');
        }
        router.push('/dashboard');
      }
    } catch (error: any) {
      console.error('Registration Error:', error);
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: error.message || 'There was a problem with your request.',
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">{t('register.signUpHeader')}</CardTitle>
        <CardDescription>
          {t('register.signUpDescription')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('register.firstNameLabel')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('register.firstNamePlaceholder')} {...field} />
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
                    <FormLabel>{t('register.lastNameLabel')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('register.lastNamePlaceholder')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="cnic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('register.cnicLabel')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('register.cnicPlaceholder')} {...field} />
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
                    <FormLabel>{t('register.phoneLabel')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('register.phonePlaceholder')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="bankAccount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('register.bankAccountLabel')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('register.bankAccountPlaceholder')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('register.emailLabel')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('register.emailPlaceholder')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('register.passwordLabel')}</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? t('register.creatingAccount') : t('register.createAccountButton')}
            </Button>
          </form>
        </Form>
        <div className="mt-4 text-center text-sm">
          {t('register.haveAccount')}{' '}
          <Link href="/login" className="underline">
            {t('register.signIn')}
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
