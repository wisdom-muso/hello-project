"use client";

import React from 'react';
import { Card, Tabs } from 'antd';
import MainLayout from '@/components/MainLayout';
import FormulaList from '@/features/formulas/FormulaList';
import AggregationList from '@/features/aggregations/AggregationList';

const SystemSetupPage: React.FC = () => {
  const items = [
    {
      key: 'formulas',
      label: 'Formula Management',
      children: <FormulaList />,
    },
    {
      key: 'aggregations',
      label: 'Aggregation Methods',
      children: <AggregationList />,
    },
  ];

  return (
    <MainLayout>
      <Card title="System Setup">
        <Tabs defaultActiveKey="formulas" items={items} />
      </Card>
    </MainLayout>
  );
};

export default SystemSetupPage;
