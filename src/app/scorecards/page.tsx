"use client";

export const dynamic = 'force-dynamic';

import MainLayout from '@/components/MainLayout';
import ScorecardList from '@/features/scorecards/ScorecardList';

export default function ScorecardsPage() {
  return (
    <MainLayout>
      <ScorecardList />
    </MainLayout>
  );
}
