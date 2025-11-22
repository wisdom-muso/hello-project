"use client";

import MainLayout from '@/components/MainLayout';
import ScorecardForm from '@/features/scorecards/ScorecardForm';
import { useParams } from 'next/navigation';

export default function EditScorecardPage() {
  const params = useParams();
  const id = params.id as string;

  return (
    <MainLayout>
      <ScorecardForm scorecardId={id} />
    </MainLayout>
  );
}
