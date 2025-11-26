"use client";

export const dynamic = 'force-dynamic';

import React from 'react';
import MainLayout from '@/components/MainLayout';
import ReportsList from '@/features/reports/ReportsList';

export default function ReportsPage() {
  return (
    <MainLayout>
      <ReportsList />
    </MainLayout>
  );
}