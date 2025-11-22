"use client";

import React from 'react';
import MainLayout from '@/components/MainLayout';
import SettingsPage from '@/features/settings/SettingsPage';

export default function Settings() {
  return (
    <MainLayout>
      <SettingsPage />
    </MainLayout>
  );
}