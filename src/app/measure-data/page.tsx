"use client";

export const dynamic = 'force-dynamic';

import React from 'react';
import MainLayout from '@/components/MainLayout';
import MeasureDataPage from '@/features/measures/MeasureDataPage';

export default function MeasureData() {
  return (
    <MainLayout>
      <MeasureDataPage />
    </MainLayout>
  );
}