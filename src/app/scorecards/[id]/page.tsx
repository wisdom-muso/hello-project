"use client";

import MainLayout from '@/components/MainLayout';
import ScorecardDetail from '@/features/scorecards/ScorecardDetail';
import { useParams } from 'next/navigation';

export default function ScorecardViewPage() {
  const params = useParams();
  const id = params.id as string;

  return (
    <MainLayout>
      <ScorecardDetail scorecardId={id} />
    </MainLayout>
  );
}
