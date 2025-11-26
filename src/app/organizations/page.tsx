"use client";

import MainLayout from '@/components/MainLayout';
import OrganizationTree from '@/features/organizations/OrganizationTree';

export const dynamic = 'force-dynamic';

export default function OrganizationsPage() {
  return (
    <MainLayout>
      <OrganizationTree />
    </MainLayout>
  );
}
