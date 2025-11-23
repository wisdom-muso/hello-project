import React, { useState } from 'react';
import { Card, Table, Button, Space, Modal, message, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import pdcaService from '@/api/services/pdcaService';
import { PdcaCycle } from '@/types';
import PdcaForm from './PdcaForm';
import dayjs from 'dayjs';

const PdcaList: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCycle, setEditingCycle] = useState<PdcaCycle | undefined>(undefined);
  const queryClient = useQueryClient();

  const { data: cycles, isLoading } = useQuery({
    queryKey: ['pdcaCycles'],
    queryFn: pdcaService.getAll,
  });

  const deleteMutation = useMutation({
    mutationFn: (oid: string) => pdcaService.delete(oid),
    onSuccess: () => {
      message.success('PDCA Cycle deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['pdcaCycles'] });
    },
    onError: () => {
      message.error('Failed to delete PDCA Cycle');
    },
  });

  const handleDelete = (oid: string) => {
    Modal.confirm({
      title: 'Confirm Delete',
      content: 'Are you sure you want to delete this PDCA Cycle?',
      okText: 'Delete',
      okType: 'danger',
      onOk: () => deleteMutation.mutate(oid),
    });
  };

  const handleEdit = (cycle: PdcaCycle) => {
    setEditingCycle(cycle);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingCycle(undefined);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingCycle(undefined);
  };

  const getStatusColor = (status: PdcaCycle['status']) => {
    switch (status) {
      case 'PLAN': return 'blue';
      case 'DO': return 'processing';
      case 'CHECK': return 'warning';
      case 'ACT': return 'success';
      default: return 'default';
    }
  };

  const columns = [
    { title: 'Cycle Name', dataIndex: 'name', key: 'name' },
    { title: 'Start Date', dataIndex: 'startDate', key: 'startDate', render: (date: string) => dayjs(date).format('YYYY-MM-DD') },
    { title: 'End Date', dataIndex: 'endDate', key: 'endDate', render: (date: string) => dayjs(date).format('YYYY-MM-DD') },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (status: PdcaCycle['status']) => <Tag color={getStatusColor(status)}>{status}</Tag> },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: PdcaCycle) => (
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
      title="PDCA Cycle Management"
      extra={
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          Create Cycle
        </Button>
      }
    >
      <Table
        columns={columns}
        dataSource={cycles}
        rowKey="oid"
        loading={isLoading}
        pagination={{ pageSize: 10 }}
      />
      <Modal
        title={editingCycle ? 'Edit PDCA Cycle' : 'Create New PDCA Cycle'}
        open={isModalOpen}
        onCancel={handleModalClose}
        footer={null}
      >
        <PdcaForm initialData={editingCycle} onSuccess={handleModalClose} />
      </Modal>
    </Card>
  );
};

export default PdcaList;
