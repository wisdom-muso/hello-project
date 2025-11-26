"use client";

export const dynamic = 'force-dynamic';

import MainLayout from '@/components/MainLayout';
import OkrList from '@/features/okrs/OkrList';

export default function OkrsPage() {
  return (
    <MainLayout>
      <OkrList />
    </MainLayout>
  );
}
