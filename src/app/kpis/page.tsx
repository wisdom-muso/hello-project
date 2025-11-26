"use client";

export const dynamic = 'force-dynamic';

import React from 'react';
import MainLayout from '@/components/MainLayout';
import KpiManagement from '@/features/kpis/KpiManagement';

export default function KpisPage() {
  return (
    <MainLayout>
      <KpiManagement />
    </MainLayout>
  );
}