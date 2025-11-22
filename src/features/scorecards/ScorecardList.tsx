"use client";

import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Input,
  Space,
  Tag,
  message,
  Popconfirm,
  Card,
  Row,
  Col,
  Statistic,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  EyeOutlined,
  ProjectOutlined,
} from '@ant-design/icons';
import type { TableProps } from 'antd';
import { Scorecard } from '@/types';
import { hillfogClient } from '@/api/hillfogClient';
import { handleApiError, formatDate } from '@/utils/helpers';
import { useRouter } from 'next/navigation';

const { Search } = Input;

export default function ScorecardList() {
  const [scorecards, setScorecards] = useState<Scorecard[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const router = useRouter();

  // Fetch scorecards
  const fetchScorecards = async () => {
    setLoading(true);
    try {
      const data = await hillfogClient.get<Scorecard[]>('/scorecards');
      setScorecards(data);
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScorecards();
  }, []);

  // Delete scorecard
  const handleDelete = async (id: string) => {
    try {
      await hillfogClient.delete(`/scorecards/${id}`);
      message.success('Scorecard deleted successfully');
      fetchScorecards();
    } catch (error) {
      handleApiError(error);
    }
  };

  // Filter scorecards based on search
  const filteredScorecards = scorecards.filter((scorecard) =>
    scorecard.name.toLowerCase().includes(searchText.toLowerCase()) ||
    scorecard.description?.toLowerCase().includes(searchText.toLowerCase())
  );

  // Table columns
  const columns: TableProps<Scorecard>['columns'] = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: 'Perspectives',
      key: 'perspectives',
      render: (_, record) => (
        <Tag color="blue">{record.perspectives?.length || 0} Perspectives</Tag>
      ),
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => formatDate(date),
      sorter: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    },
    {
      title: 'Updated',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (date) => formatDate(date),
      sorter: (a, b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => router.push(`/scorecards/${record.id}`)}
          >
            View
          </Button>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => router.push(`/scorecards/${record.id}/edit`)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete Scorecard"
            description="Are you sure you want to delete this scorecard?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="text" danger icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={8}>
          <Card>
            <Statistic
              title="Total Scorecards"
              value={scorecards.length}
              prefix={<ProjectOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Total Perspectives"
              value={scorecards.reduce((acc, s) => acc + (s.perspectives?.length || 0), 0)}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Total Objectives"
              value={scorecards.reduce(
                (acc, s) =>
                  acc +
                  (s.perspectives?.reduce((pacc, p) => pacc + (p.objectives?.length || 0), 0) || 0),
                0
              )}
            />
          </Card>
        </Col>
      </Row>

      <Card
        title="Scorecards"
        extra={
          <Space>
            <Search
              placeholder="Search scorecards..."
              allowClear
              prefix={<SearchOutlined />}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 300 }}
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => router.push('/scorecards/new')}
            >
              New Scorecard
            </Button>
          </Space>
        }
      >
        <Table
          columns={columns}
          dataSource={filteredScorecards}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} scorecards`,
          }}
        />
      </Card>
    </div>
  );
}