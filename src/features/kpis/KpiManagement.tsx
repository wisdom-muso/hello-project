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
  Modal,
  Form,
  Select,
  Row,
  Col,
  Statistic,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  LineChartOutlined,
} from '@ant-design/icons';
import type { TableProps } from 'antd';
import { Measure } from '@/types';
import { hillfogClient } from '@/api/hillfogClient';
import { handleApiError, formatDate } from '@/utils/helpers';
import { useSWRFetch } from '@/hooks/useSWRFetch';

const { Search } = Input;
const { TextArea } = Input;
const { Option } = Select;

export default function KpiManagement() {
  const { data: kpis = [], isLoading, mutate } = useSWRFetch<Measure[]>('/measures');
  const [searchText, setSearchText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingKpi, setEditingKpi] = useState<Measure | null>(null);
  const [form] = Form.useForm();

  // Open modal for create/edit
  const openModal = useCallback((kpi?: Measure) => {
    if (kpi) {
      setEditingKpi(kpi);
      form.setFieldsValue(kpi);
    } else {
      setEditingKpi(null);
      form.resetFields();
    }
    setModalVisible(true);
  }, [form]);

  // Close modal
  const closeModal = useCallback(() => {
    setModalVisible(false);
    setEditingKpi(null);
    form.resetFields();
  }, [form]);

  // Handle form submission
  const handleSubmit = useCallback(async (values: any) => {
    try {
      if (editingKpi) {
        await hillfogClient.put(`/measures/${editingKpi.id}`, values);
        message.success('KPI updated successfully');
      } else {
        await hillfogClient.post('/measures', values);
        message.success('KPI created successfully');
      }
      closeModal();
      mutate();
    } catch (error) {
      handleApiError(error);
    }
  }, [editingKpi, closeModal, mutate]);

  // Delete KPI
  const handleDelete = useCallback(async (id: string) => {
    try {
      await hillfogClient.delete(`/measures/${id}`);
      message.success('KPI deleted successfully');
      mutate();
    } catch (error) {
      handleApiError(error);
    }
  }, [mutate]);

  // Filter KPIs based on search (memoized)
  const filteredKpis = useMemo(() => {
    return kpis.filter(
      (kpi) =>
        kpi.name.toLowerCase().includes(searchText.toLowerCase()) ||
        kpi.description?.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [kpis, searchText]);

  // Calculate statistics (memoized)
  const statistics = useMemo(() => {
    const activeKpis = kpis.filter((k) => k.currentValue !== undefined && k.currentValue !== null).length;
    const achievedKpis = kpis.filter(
      (k) => k.currentValue && k.targetValue && k.currentValue >= k.targetValue
    ).length;
    const atRiskKpis = kpis.filter(
      (k) =>
        k.currentValue &&
        k.targetValue &&
        k.currentValue < k.targetValue * 0.7
    ).length;

    return { activeKpis, achievedKpis, atRiskKpis };
  }, [kpis]);

  // Memoize handlers
  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  }, []);

  // Table columns (memoized)
  const columns: TableProps<Measure>['columns'] = useMemo(() => [
    {
      title: 'KPI Name',
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
      title: 'Unit',
      dataIndex: 'unit',
      key: 'unit',
      align: 'center',
      render: (text) => text || 'N/A',
    },
    {
      title: 'Frequency',
      dataIndex: 'frequency',
      key: 'frequency',
      align: 'center',
      render: (frequency) => {
        const colors: Record<string, string> = {
          daily: 'blue',
          weekly: 'cyan',
          monthly: 'green',
          quarterly: 'orange',
          yearly: 'red',
        };
        return <Tag color={colors[frequency] || 'default'}>{frequency?.toUpperCase() || 'N/A'}</Tag>;
      },
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
      title: 'Status',
      key: 'status',
      align: 'center',
      render: (_, record) => {
        if (!record.targetValue || !record.currentValue) {
          return <Tag color="default">No Data</Tag>;
        }
        const progress = (record.currentValue / record.targetValue) * 100;
        if (progress >= 100) return <Tag color="success">Achieved</Tag>;
        if (progress >= 70) return <Tag color="processing">On Track</Tag>;
        return <Tag color="error">At Risk</Tag>;
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="small">
          <Button type="text" icon={<EditOutlined />} onClick={() => openModal(record)}>
            Edit
          </Button>
          <Popconfirm
            title="Delete KPI"
            description="Are you sure you want to delete this KPI?"
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
  ], [openModal, handleDelete]);

  return (
    <div>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total KPIs"
              value={kpis.length}
              prefix={<LineChartOutlined />}
              loading={isLoading}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Active KPIs"
              value={statistics.activeKpis}
              valueStyle={{ color: '#1890ff' }}
              loading={isLoading}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Achieved"
              value={statistics.achievedKpis}
              valueStyle={{ color: '#3f8600' }}
              loading={isLoading}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="At Risk"
              value={statistics.atRiskKpis}
              valueStyle={{ color: '#cf1322' }}
              loading={isLoading}
            />
          </Card>
        </Col>
      </Row>

      <Card
        title="KPI Management"
        extra={
          <Space>
            <Search
              placeholder="Search KPIs..."
              allowClear
              prefix={<SearchOutlined />}
              onChange={handleSearch}
              style={{ width: 300 }}
            />
            <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal()}>
              New KPI
            </Button>
          </Space>
        }
      >
        <Table
          columns={columns}
          dataSource={filteredKpis}
          rowKey="id"
          loading={isLoading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} KPIs`,
          }}
        />
      </Card>

      <Modal
        title={editingKpi ? 'Edit KPI' : 'Create New KPI'}
        open={modalVisible}
        onCancel={closeModal}
        footer={null}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="KPI Name"
            name="name"
            rules={[{ required: true, message: 'Please enter KPI name' }]}
          >
            <Input placeholder="Enter KPI name" />
          </Form.Item>

          <Form.Item label="Description" name="description">
            <TextArea rows={3} placeholder="Enter KPI description" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Unit" name="unit">
                <Input placeholder="e.g., %, $, units" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Frequency"
                name="frequency"
                rules={[{ required: true, message: 'Please select frequency' }]}
              >
                <Select placeholder="Select frequency">
                  <Option value="daily">Daily</Option>
                  <Option value="weekly">Weekly</Option>
                  <Option value="monthly">Monthly</Option>
                  <Option value="quarterly">Quarterly</Option>
                  <Option value="yearly">Yearly</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Target Value" name="targetValue">
                <Input type="number" placeholder="Enter target value" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Current Value" name="currentValue">
                <Input type="number" placeholder="Enter current value" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingKpi ? 'Update' : 'Create'}
              </Button>
              <Button onClick={closeModal}>Cancel</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}