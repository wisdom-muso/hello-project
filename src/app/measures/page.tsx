"use client";

export const dynamic = 'force-dynamic';

import MainLayout from '@/components/MainLayout';
import MeasureDataPage from '@/features/measures/MeasureDataPage';

export default function MeasuresPage() {
  return (
    <MainLayout>
      <MeasureDataPage />
    </MainLayout>
  );
}
