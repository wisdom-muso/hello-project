"use client";

import MainLayout from '@/components/MainLayout';
import EmployeeList from '@/features/employees/EmployeeList';

export const dynamic = 'force-dynamic';

export default function EmployeesPage() {
  return (
    <MainLayout>
      <EmployeeList />
    </MainLayout>
  );
}
