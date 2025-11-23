"use client";

import React, { useState, useMemo, useCallback } from 'react';
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
import { useSWRFetch } from '@/hooks/useSWRFetch';

const { Search } = Input;

export default function ScorecardList() {
  const { data: scorecards = [], isLoading, mutate } = useSWRFetch<Scorecard[]>('/scorecards');
  const [searchText, setSearchText] = useState('');
  const router = useRouter();

  // Delete scorecard
  const handleDelete = useCallback(async (id: string) => {
    try {
      await hillfogClient.delete(`/scorecards/${id}`);
      message.success('Scorecard deleted successfully');
      mutate();
    } catch (error) {
      handleApiError(error);
    }
  }, [mutate]);

  // Filter scorecards based on search (memoized)
  const filteredScorecards = useMemo(() => {
    return scorecards.filter((scorecard) =>
      scorecard.name.toLowerCase().includes(searchText.toLowerCase()) ||
      scorecard.description?.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [scorecards, searchText]);

  // Memoize statistics calculations
  const statistics = useMemo(() => ({
    totalScorecards: scorecards.length,
    totalPerspectives: scorecards.reduce((acc, s) => acc + (s.perspectives?.length || 0), 0),
    totalObjectives: scorecards.reduce(
      (acc, s) =>
        acc +
        (s.perspectives?.reduce((pacc, p) => pacc + (p.objectives?.length || 0), 0) || 0),
      0
    ),
  }), [scorecards]);

  // Memoize handlers
  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  }, []);

  const handleView = useCallback((id: string) => {
    router.push(`/scorecards/${id}`);
  }, [router]);

  const handleEdit = useCallback((id: string) => {
    router.push(`/scorecards/${id}/edit`);
  }, [router]);

  const handleNew = useCallback(() => {
    router.push('/scorecards/new');
  }, [router]);

  // Table columns (memoized)
  const columns: TableProps<Scorecard>['columns'] = useMemo(() => [
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
            onClick={() => handleView(record.id)}
          >
            View
          </Button>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record.id)}
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
  ], [handleView, handleEdit, handleDelete]);

  return (
    <div>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={8}>
          <Card>
            <Statistic
              title="Total Scorecards"
              value={statistics.totalScorecards}
              prefix={<ProjectOutlined />}
              loading={isLoading}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Total Perspectives"
              value={statistics.totalPerspectives}
              loading={isLoading}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Total Objectives"
              value={statistics.totalObjectives}
              loading={isLoading}
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
              onChange={handleSearch}
              style={{ width: 300 }}
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleNew}
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
          loading={isLoading}
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