"use client";

import MainLayout from '@/components/MainLayout';
import EmployeeList from '@/features/employees/EmployeeList';

export default function EmployeesPage() {
  return (
    <MainLayout>
      <EmployeeList />
    </MainLayout>
  );
}
