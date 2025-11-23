import React, { useState } from 'react';
import { Card, Button, Space, Modal, message, Tree, Table } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import organizationService from '@/api/services/organizationService';
import { Organization } from '@/types';
import OrganizationForm from './OrganizationForm';

// Helper function to convert flat list to tree structure (simplified for placeholder)
const buildOrganizationTree = (organizations: Organization[]): Organization[] => {
  const map: { [key: string]: Organization & { children?: Organization[] } } = {};
  organizations.forEach(org => {
    map[org.oid] = { ...org, children: [] };
  });

  const tree: Organization[] = [];
  organizations.forEach(org => {
    if (org.parentOid && map[org.parentOid]) {
      map[org.parentOid].children!.push(map[org.oid]);
    } else {
      tree.push(map[org.oid]);
    }
  });
  return tree;
};

const OrganizationTree: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOrganization, setEditingOrganization] = useState<Organization | undefined>(undefined);
  const queryClient = useQueryClient();

  const { data: organizations, isLoading } = useQuery({
    queryKey: ['organizations'],
    queryFn: organizationService.getAll,
  });

  const deleteMutation = useMutation({
    mutationFn: (oid: string) => organizationService.delete(oid),
    onSuccess: () => {
      message.success('Organization deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
    },
    onError: () => {
      message.error('Failed to delete organization');
    },
  });

  const handleDelete = (oid: string) => {
    Modal.confirm({
      title: 'Confirm Delete',
      content: 'Are you sure you want to delete this organization? This will affect all child organizations and employees.',
      okText: 'Delete',
      okType: 'danger',
      onOk: () => deleteMutation.mutate(oid),
    });
  };

  const handleEdit = (organization: Organization) => {
    setEditingOrganization(organization);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingOrganization(undefined);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingOrganization(undefined);
  };

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'ID', dataIndex: 'orgId', key: 'orgId' },
    { title: 'Description', dataIndex: 'description', key: 'description' },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: Organization) => (
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

  // Using Table with tree structure for better display of data
  return (
    <Card
      title="Organization Structure"
      extra={
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          Add Organization
        </Button>
      }
    >
      <Table
        columns={columns}
        dataSource={organizations ? buildOrganizationTree(organizations) : []}
        rowKey="oid"
        loading={isLoading}
        pagination={false}
        expandable={{ childrenColumnName: 'children' }}
      />
      <Modal
        title={editingOrganization ? 'Edit Organization' : 'Add New Organization'}
        open={isModalOpen}
        onCancel={handleModalClose}
        footer={null}
      >
        <OrganizationForm initialData={editingOrganization} onSuccess={handleModalClose} />
      </Modal>
    </Card>
  );
};

export default OrganizationTree;
