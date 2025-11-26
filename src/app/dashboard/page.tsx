"use client";

export const dynamic = 'force-dynamic';

import React from 'react';
import { Card, Row, Col, Statistic, Typography } from 'antd';
import {
  BarChartOutlined,
  LineChartOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import MainLayout from '@/components/MainLayout';

const { Title } = Typography;

export default function DashboardPage() {
  return (
    <MainLayout>
      <Title level={2}>Dashboard</Title>
      <Title level={5} type="secondary">
        Overview of key metrics and performance indicators
      </Title>

      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Scorecards"
              value={12}
              prefix={<BarChartOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Active KPIs"
              value={48}
              prefix={<LineChartOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Data Entries"
              value={324}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Targets Met"
              value={85}
              suffix="%"
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24} lg={12}>
          <Card title="Recent Activity" bordered={false}>
            <p>• Scorecard "Q1 2024 Strategy" updated</p>
            <p>• New KPI "Customer Satisfaction" added</p>
            <p>• Measure data for "Revenue Growth" entered</p>
            <p>• Report "Monthly Performance" generated</p>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Upcoming Tasks" bordered={false}>
            <p>• Review Q1 performance metrics</p>
            <p>• Update KPI targets for Q2</p>
            <p>• Generate quarterly reports</p>
            <p>• Schedule strategy review meeting</p>
          </Card>
        </Col>
      </Row>
    </MainLayout>
  );
}
