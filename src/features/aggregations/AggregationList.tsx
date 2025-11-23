import React, { useState } from 'react';
import { Card, Table, Button, Space, Modal, message, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import aggregationService from '@/api/services/aggregationService';
import { AggregationMethod } from '@/types';
import AggregationForm from './AggregationForm';

const AggregationList: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMethod, setEditingMethod] = useState<AggregationMethod | undefined>(undefined);
  const queryClient = useQueryClient();

  const { data: methods, isLoading } = useQuery({
    queryKey: ['aggregations'],
    queryFn: aggregationService.getAll,
  });

  const deleteMutation = useMutation({
    mutationFn: (oid: string) => aggregationService.delete(oid),
    onSuccess: () => {
      message.success('Aggregation Method deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['aggregations'] });
    },
    onError: () => {
      message.error('Failed to delete aggregation method');
    },
  });

  const handleDelete = (oid: string) => {
    Modal.confirm({
      title: 'Confirm Delete',
      content: 'Are you sure you want to delete this aggregation method?',
      okText: 'Delete',
      okType: 'danger',
      onOk: () => deleteMutation.mutate(oid),
    });
  };

  const handleEdit = (method: AggregationMethod) => {
    setEditingMethod(method);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingMethod(undefined);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingMethod(undefined);
  };

  const getMethodColor = (type: AggregationMethod['methodType']) => {
    switch (type) {
      case 'SUM': return 'green';
      case 'AVERAGE': return 'blue';
      case 'CUSTOM': return 'purple';
      default: return 'default';
    }
  };

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Type', dataIndex: 'methodType', key: 'methodType', render: (type: AggregationMethod['methodType']) => <Tag color={getMethodColor(type)}>{type}</Tag> },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: AggregationMethod) => (
        <Space size="middle">
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Button
            icon={<DeleteOutlined />}
            danger
            onClick={() => handleDelete(record.oid)}
            loading={deleteMutation.isPending}
          />
        </Space>
      ),
    },
  ];

  return (
    <Card
      title="Aggregation Method Management"
      extra={
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          Add Method
        </Button>
      }
    >
      <Table
        columns={columns}
        dataSource={methods}
        rowKey="oid"
        loading={isLoading}
        pagination={{ pageSize: 10 }}
      />
      <Modal
        title={editingMethod ? 'Edit Aggregation Method' : 'Create New Aggregation Method'}
        open={isModalOpen}
        onCancel={handleModalClose}
        footer={null}
      >
        <AggregationForm initialData={editingMethod} onSuccess={handleModalClose} />
      </Modal>
    </Card>
  );
};

export default AggregationList;
