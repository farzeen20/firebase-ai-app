'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/login');
    }, 3000); // 3-second delay

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <main
      className={cn(
        'flex h-screen w-full flex-col items-center justify-center bg-[#386641] text-[#FFFCB8]'
      )}
    >
      <div className="flex flex-col items-center justify-center space-y-4">
        <div
          className={cn(
            'relative flex h-48 w-48 items-center justify-center rounded-full bg-[#FFFCB8] shadow-lg',
            'transform -rotate-12' // Slightly tilted
          )}
          style={{ boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)' }}
        >
          <span className="text-9xl font-bold text-[#386641]">B</span>
        </div>
        <h1 className="text-5xl font-bold tracking-tight">Bachat Buddy</h1>
      </div>
    </main>
  );
}
