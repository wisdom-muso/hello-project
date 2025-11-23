import React, { useState } from 'react';
import { Card, Button, Space, Modal, message, Collapse, Progress, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import okrService from '@/api/services/okrService';
import { OkrBase, Objective, KeyResult } from '@/types';
import OkrForm from './OkrForm';

const { Panel } = Collapse;

const calculateProgress = (okr: OkrBase): number => {
  if (!okr.objectives || okr.objectives.length === 0) return 0;

  let totalWeightedProgress = 0;
  let totalWeight = 0;

  okr.objectives.forEach(objective => {
    if (!objective.keyResults || objective.keyResults.length === 0) return;

    objective.keyResults.forEach(kr => {
      const progress = kr.targetValue > 0 ? (kr.currentValue / kr.targetValue) : 0;
      const weight = kr.weight || 1; // Assuming weight defaults to 1 if not set
      totalWeightedProgress += progress * weight;
      totalWeight += weight;
    });
  });

  return totalWeight > 0 ? Math.min(100, Math.round((totalWeightedProgress / totalWeight) * 100)) : 0;
};

const OkrList: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOkr, setEditingOkr] = useState<OkrBase | undefined>(undefined);
  const queryClient = useQueryClient();

  const { data: okrs, isLoading } = useQuery({
    queryKey: ['okrs'],
    queryFn: okrService.getAll,
  });

  const deleteMutation = useMutation({
    mutationFn: (oid: string) => okrService.delete(oid),
    onSuccess: () => {
      message.success('OKR deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['okrs'] });
    },
    onError: () => {
      message.error('Failed to delete OKR');
    },
  });

  const handleDelete = (oid: string) => {
    Modal.confirm({
      title: 'Confirm Delete',
      content: 'Are you sure you want to delete this OKR base?',
      okText: 'Delete',
      okType: 'danger',
      onOk: () => deleteMutation.mutate(oid),
    });
  };

  const handleEdit = (okr: OkrBase) => {
    setEditingOkr(okr);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingOkr(undefined);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingOkr(undefined);
  };

  const renderKeyResult = (kr: KeyResult) => {
    const progress = kr.targetValue > 0 ? (kr.currentValue / kr.targetValue) : 0;
    const percent = Math.min(100, Math.round(progress * 100));
    return (
      <div key={kr.oid} style={{ marginBottom: 8, paddingLeft: 16, borderLeft: '2px solid #1890ff' }}>
        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
          <strong>{kr.name}</strong>
          <Tag color="blue">{kr.weight}% Weight</Tag>
        </Space>
        <Progress percent={percent} size="small" status={percent >= 100 ? 'success' : 'active'} />
        <small>Current: {kr.currentValue} / Target: {kr.targetValue} {kr.unit}</small>
      </div>
    );
  };

  const renderObjective = (objective: Objective) => (
    <Panel header={objective.name} key={objective.oid}>
      <p>{objective.description}</p>
      <div style={{ marginTop: 10 }}>
        <h4>Key Results:</h4>
        {objective.keyResults.map(renderKeyResult)}
      </div>
    </Panel>
  );

  const renderOkrBase = (okr: OkrBase) => {
    const progress = calculateProgress(okr);
    return (
      <Card
        key={okr.oid}
        title={okr.title}
        extra={
          <Space>
            <Progress type="circle" percent={progress} width={50} />
            <Button icon={<EditOutlined />} onClick={() => handleEdit(okr)} />
            <Button icon={<DeleteOutlined />} danger onClick={() => handleDelete(okr.oid)} loading={deleteMutation.isPending} />
          </Space>
        }
        style={{ marginBottom: 16 }}
      >
        <p><strong>Period:</strong> {okr.period}</p>
        <Collapse accordion>
          {okr.objectives.map(renderObjective)}
        </Collapse>
      </Card>
    );
  };

  return (
    <Card
      title="OKR Management"
      extra={
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          Create OKR
        </Button>
      }
    >
      {isLoading ? (
        <p>Loading OKRs...</p>
      ) : (
        okrs?.map(renderOkrBase)
      )}
      <Modal
        title={editingOkr ? 'Edit OKR' : 'Create New OKR'}
        open={isModalOpen}
        onCancel={handleModalClose}
        footer={null}
        width={800}
      >
        <OkrForm initialData={editingOkr} onSuccess={handleModalClose} />
      </Modal>
    </Card>
  );
};

export default OkrList;
