"use client";

import React, { useState, useEffect } from 'react';
import {
  Card,
  Spin,
  Button,
  Space,
  Descriptions,
  Collapse,
  Table,
  Progress,
  Typography,
  Tag,
  Statistic,
  Row,
  Col,
} from 'antd';
import {
  EditOutlined,
  ArrowLeftOutlined,
  BarChartOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import type { CollapseProps, TableProps } from 'antd';
import { Scorecard, Objective } from '@/types';
import { hillfogClient } from '@/api/hillfogClient';
import { handleApiError, formatDate } from '@/utils/helpers';
import { useRouter } from 'next/navigation';

const { Title, Paragraph } = Typography;

interface ScorecardDetailProps {
  scorecardId: string;
}

export default function ScorecardDetail({ scorecardId }: ScorecardDetailProps) {
  const [scorecard, setScorecard] = useState<Scorecard | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchScorecard();
  }, [scorecardId]);

  const fetchScorecard = async () => {
    setLoading(true);
    try {
      const data = await hillfogClient.get<Scorecard>(`/scorecards/${scorecardId}`);
      setScorecard(data);
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <div style={{ textAlign: 'center', padding: 50 }}>
          <Spin size="large" />
        </div>
      </Card>
    );
  }

  if (!scorecard) {
    return (
      <Card>
        <div style={{ textAlign: 'center', padding: 50 }}>
          <Title level={4}>Scorecard not found</Title>
        </div>
      </Card>
    );
  }

  // Calculate overall progress
  const totalObjectives = scorecard.perspectives.reduce(
    (acc, p) => acc + p.objectives.length,
    0
  );
  const completedObjectives = scorecard.perspectives.reduce(
    (acc, p) =>
      acc +
      p.objectives.filter((o) => o.currentValue && o.targetValue && o.currentValue >= o.targetValue)
        .length,
    0
  );
  const overallProgress = totalObjectives > 0 ? (completedObjectives / totalObjectives) * 100 : 0;

  // Objective table columns
  const objectiveColumns: TableProps<Objective>['columns'] = [
    {
      title: 'Objective',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: 'Target',
      dataIndex: 'targetValue',
      key: 'targetValue',
      align: 'center',
      render: (value) => value ?? 'N/A',
    },
    {
      title: 'Current',
      dataIndex: 'currentValue',
      key: 'currentValue',
      align: 'center',
      render: (value) => value ?? 'N/A',
    },
    {
      title: 'Progress',
      key: 'progress',
      align: 'center',
      render: (_, record) => {
        if (!record.targetValue || !record.currentValue) return 'N/A';
        const progress = (record.currentValue / record.targetValue) * 100;
        return (
          <Progress
            percent={Math.round(progress)}
            size="small"
            status={progress >= 100 ? 'success' : progress >= 70 ? 'normal' : 'exception'}
          />
        );
      },
    },
    {
      title: 'Status',
      key: 'status',
      align: 'center',
      render: (_, record) => {
        if (!record.targetValue || !record.currentValue) {
          return <Tag color="default">Not Started</Tag>;
        }
        const progress = (record.currentValue / record.targetValue) * 100;
        if (progress >= 100) return <Tag color="success">Achieved</Tag>;
        if (progress >= 70) return <Tag color="processing">On Track</Tag>;
        return <Tag color="error">At Risk</Tag>;
      },
    },
  ];

  // Collapse items for perspectives
  const perspectiveItems: CollapseProps['items'] = scorecard.perspectives.map((perspective) => ({
    key: perspective.id,
    label: (
      <Space>
        <strong style={{ fontSize: 16 }}>{perspective.name}</strong>
        <Tag color="blue">{perspective.objectives.length} Objectives</Tag>
      </Space>
    ),
    children: (
      <div>
        {perspective.description && (
          <Paragraph style={{ marginBottom: 16 }}>{perspective.description}</Paragraph>
        )}
        <Table
          columns={objectiveColumns}
          dataSource={perspective.objectives}
          rowKey="id"
          pagination={false}
          size="middle"
        />
      </div>
    ),
  }));

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => router.push('/scorecards')}>
          Back to List
        </Button>
        <Button
          type="primary"
          icon={<EditOutlined />}
          onClick={() => router.push(`/scorecards/${scorecardId}/edit`)}
        >
          Edit Scorecard
        </Button>
      </Space>

      <Card title={<Title level={2} style={{ margin: 0 }}>{scorecard.name}</Title>}>
        <Descriptions bordered column={2} style={{ marginBottom: 24 }}>
          <Descriptions.Item label="Description" span={2}>
            {scorecard.description || 'No description provided'}
          </Descriptions.Item>
          <Descriptions.Item label="Created At">
            {formatDate(scorecard.createdAt)}
          </Descriptions.Item>
          <Descriptions.Item label="Last Updated">
            {formatDate(scorecard.updatedAt)}
          </Descriptions.Item>
          <Descriptions.Item label="Perspectives">
            {scorecard.perspectives.length}
          </Descriptions.Item>
          <Descriptions.Item label="Total Objectives">
            {totalObjectives}
          </Descriptions.Item>
        </Descriptions>

        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={12} lg={8}>
            <Card>
              <Statistic
                title="Overall Progress"
                value={Math.round(overallProgress)}
                suffix="%"
                prefix={<BarChartOutlined />}
                valueStyle={{ color: overallProgress >= 70 ? '#3f8600' : '#cf1322' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <Card>
              <Statistic
                title="Completed Objectives"
                value={completedObjectives}
                suffix={`/ ${totalObjectives}`}
                prefix={<CheckCircleOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <Card>
              <Statistic
                title="Completion Rate"
                value={totalObjectives > 0 ? Math.round((completedObjectives / totalObjectives) * 100) : 0}
                suffix="%"
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
        </Row>

        <Title level={4} style={{ marginTop: 24, marginBottom: 16 }}>
          Perspectives & Objectives
        </Title>
        <Collapse items={perspectiveItems} defaultActiveKey={scorecard.perspectives[0]?.id} />
      </Card>
    </div>
  );
}
