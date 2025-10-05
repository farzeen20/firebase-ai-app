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
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';

export function RegisterForm() {
  const router = useRouter();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you'd handle form submission here.
    // We'll simulate success and redirect to the dashboard.
    
    // For the onboarding experience
    if(typeof window !== 'undefined') {
        localStorage.setItem('bachatbuddy_onboarding', 'true');
    }
    
    router.push('/dashboard');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Sign Up</CardTitle>
        <CardDescription>
          Enter your information to create an account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="first-name">First name</Label>
              <Input id="first-name" placeholder="Ayesha" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="last-name">Last name</Label>
              <Input id="last-name" placeholder="Khan" required />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="cnic">CNIC</Label>
              <Input id="cnic" placeholder="XXXXX-XXXXXXX-X" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" placeholder="+92 3XX XXXXXXX" required />
            </div>
          </div>
           <div className="grid gap-2">
            <Label htmlFor="bank-account">Bank Account (IBAN)</Label>
            <Input id="bank-account" placeholder="PKXX XXXX XXXX XXXX XXXX XXXX" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" />
          </div>
          <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
            Create an account
          </Button>
        </form>
        <div className="mt-4 text-center text-sm">
          Already have an account?{' '}
          <Link href="/" className="underline">
            Sign in
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
