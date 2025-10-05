import { RegisterForm } from '@/components/auth/register-form';
import { BachatBuddyLogo } from '@/components/bachat-buddy-logo';

export default function RegisterPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
        <div className="mx-auto grid w-full max-w-2xl gap-6">
            <div className="grid gap-2 text-center">
                <div className="flex justify-center items-center gap-4 mb-4">
                    <BachatBuddyLogo className="h-12 w-12" />
                    <h1 className="text-4xl font-bold font-headline text-primary">
                        Join Bachat Buddy
                    </h1>
                </div>
                <p className="text-balance text-muted-foreground">
                    Create your account to start your savings journey
                </p>
            </div>
            <RegisterForm />
        </div>
    </div>
  );
}
