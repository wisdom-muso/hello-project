import React, { useState } from 'react';
import { Card, Table, Button, Space, Modal, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import formulaService from '@/api/services/formulaService';
import { Formula } from '@/types';
import FormulaForm from './FormulaForm';

const FormulaList: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFormula, setEditingFormula] = useState<Formula | undefined>(undefined);
  const queryClient = useQueryClient();

  const { data: formulas, isLoading } = useQuery({
    queryKey: ['formulas'],
    queryFn: formulaService.getAll,
  });

  const deleteMutation = useMutation({
    mutationFn: (oid: string) => formulaService.delete(oid),
    onSuccess: () => {
      message.success('Formula deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['formulas'] });
    },
    onError: () => {
      message.error('Failed to delete formula');
    },
  });

  const handleDelete = (oid: string) => {
    Modal.confirm({
      title: 'Confirm Delete',
      content: 'Are you sure you want to delete this formula?',
      okText: 'Delete',
      okType: 'danger',
      onOk: () => deleteMutation.mutate(oid),
    });
  };

  const handleEdit = (formula: Formula) => {
    setEditingFormula(formula);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingFormula(undefined);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingFormula(undefined);
  };

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Expression', dataIndex: 'expression', key: 'expression' },
    { title: 'Description', dataIndex: 'description', key: 'description' },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: Formula) => (
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
      title="Formula Management"
      extra={
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          Add Formula
        </Button>
      }
    >
      <Table
        columns={columns}
        dataSource={formulas}
        rowKey="oid"
        loading={isLoading}
        pagination={{ pageSize: 10 }}
      />
      <Modal
        title={editingFormula ? 'Edit Formula' : 'Create New Formula'}
        open={isModalOpen}
        onCancel={handleModalClose}
        footer={null}
      >
        <FormulaForm initialData={editingFormula} onSuccess={handleModalClose} />
      </Modal>
    </Card>
  );
};

export default FormulaList;
