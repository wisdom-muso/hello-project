"use client";

export const dynamic = 'force-dynamic';

import MainLayout from '@/components/MainLayout';
import CommonQueryTool from '@/features/query/CommonQueryTool';

export default function QueryToolPage() {
  return (
    <MainLayout>
      <CommonQueryTool />
    </MainLayout>
  );
}
