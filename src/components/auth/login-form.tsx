
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { useAuth } from '@/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/context/language-context';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const auth = useAuth();
  const { toast } = useToast();
  const { t } = useLanguage();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    if (!auth) {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'Firebase Auth is not initialized.',
      });
      return;
    }
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Login Error:', error);
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: error.message || 'There was a problem with your request.',
      });
    }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('login.emailLabel')}</FormLabel>
                <FormControl>
                  <Input placeholder={t('login.emailPlaceholder')} {...field} />
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
                <div className="flex items-center">
                  <FormLabel>{t('login.passwordLabel')}</FormLabel>
                  <Link
                    href="#"
                    className="ms-auto inline-block text-sm underline"
                  >
                    {t('login.forgotPassword')}
                  </Link>
                </div>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={form.formState.isSubmitting}>
             {form.formState.isSubmitting ? t('login.loggingIn') : t('login.loginButton')}
          </Button>
        </form>
      </Form>
      <Button variant="outline" className="w-full mt-4">
        {t('login.loginWithPhone')}
      </Button>
      <div className="mt-4 text-center text-sm">
        {t('login.noAccount')}{' '}
        <Link href="/register" className="underline">
          {t('login.signUp')}
        </Link>
      </div>
    </>
  );
}
