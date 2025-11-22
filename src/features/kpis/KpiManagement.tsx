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

const { Search } = Input;
const { TextArea } = Input;
const { Option } = Select;

export default function KpiManagement() {
  const [kpis, setKpis] = useState<Measure[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingKpi, setEditingKpi] = useState<Measure | null>(null);
  const [form] = Form.useForm();

  // Fetch KPIs
  const fetchKpis = async () => {
    setLoading(true);
    try {
      const data = await hillfogClient.get<Measure[]>('/measures');
      setKpis(data);
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKpis();
  }, []);

  // Open modal for create/edit
  const openModal = (kpi?: Measure) => {
    if (kpi) {
      setEditingKpi(kpi);
      form.setFieldsValue(kpi);
    } else {
      setEditingKpi(null);
      form.resetFields();
    }
    setModalVisible(true);
  };

  // Close modal
  const closeModal = () => {
    setModalVisible(false);
    setEditingKpi(null);
    form.resetFields();
  };

  // Handle form submission
  const handleSubmit = async (values: any) => {
    try {
      if (editingKpi) {
        await hillfogClient.put(`/measures/${editingKpi.id}`, values);
        message.success('KPI updated successfully');
      } else {
        await hillfogClient.post('/measures', values);
        message.success('KPI created successfully');
      }
      closeModal();
      fetchKpis();
    } catch (error) {
      handleApiError(error);
    }
  };

  // Delete KPI
  const handleDelete = async (id: string) => {
    try {
      await hillfogClient.delete(`/measures/${id}`);
      message.success('KPI deleted successfully');
      fetchKpis();
    } catch (error) {
      handleApiError(error);
    }
  };

  // Filter KPIs based on search
  const filteredKpis = kpis.filter(
    (kpi) =>
      kpi.name.toLowerCase().includes(searchText.toLowerCase()) ||
      kpi.description?.toLowerCase().includes(searchText.toLowerCase())
  );

  // Calculate statistics
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

  // Table columns
  const columns: TableProps<Measure>['columns'] = [
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
  ];

  return (
    <div>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total KPIs"
              value={kpis.length}
              prefix={<LineChartOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Active KPIs"
              value={activeKpis}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Achieved"
              value={achievedKpis}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="At Risk"
              value={atRiskKpis}
              valueStyle={{ color: '#cf1322' }}
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
              onChange={(e) => setSearchText(e.target.value)}
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
          loading={loading}
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
