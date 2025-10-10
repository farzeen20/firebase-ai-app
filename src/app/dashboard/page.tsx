'use client';

import { Overview } from '@/components/dashboard/overview';
import { BachatPal } from '@/components/dashboard/bachat-pal';

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <Overview />
      <BachatPal />
    </div>
  );
}
