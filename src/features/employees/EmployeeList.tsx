import React, { useState } from 'react';
import { Card, Table, Button, Space, Modal, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import employeeService from '@/api/services/employeeService';
import { Employee } from '@/types';
import EmployeeForm from './EmployeeForm';

const EmployeeList: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | undefined>(undefined);
  const queryClient = useQueryClient();

  const { data: employees, isLoading } = useQuery({
    queryKey: ['employees'],
    queryFn: employeeService.getAll,
  });

  const deleteMutation = useMutation({
    mutationFn: (oid: string) => employeeService.delete(oid),
    onSuccess: () => {
      message.success('Employee deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
    onError: () => {
      message.error('Failed to delete employee');
    },
  });

  const handleDelete = (oid: string) => {
    Modal.confirm({
      title: 'Confirm Delete',
      content: 'Are you sure you want to delete this employee?',
      okText: 'Delete',
      okType: 'danger',
      onOk: () => deleteMutation.mutate(oid),
    });
  };

  const handleEdit = (employee: Employee) => {
    setEditingEmployee(employee);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingEmployee(undefined);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingEmployee(undefined);
  };

  const columns = [
    { title: 'Employee ID', dataIndex: 'employeeId', key: 'employeeId' },
    { title: 'Full Name', dataIndex: 'fullName', key: 'fullName' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Role', dataIndex: 'role', key: 'role' },
    { title: 'Locked', dataIndex: 'isLocked', key: 'isLocked', render: (isLocked: boolean) => (isLocked ? 'Yes' : 'No') },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: Employee) => (
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
      title="Employee Management"
      extra={
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          Add Employee
        </Button>
      }
    >
      <Table
        columns={columns}
        dataSource={employees}
        rowKey="oid"
        loading={isLoading}
        pagination={{ pageSize: 10 }}
      />
      <Modal
        title={editingEmployee ? 'Edit Employee' : 'Add New Employee'}
        open={isModalOpen}
        onCancel={handleModalClose}
        footer={null}
      >
        <EmployeeForm initialData={editingEmployee} onSuccess={handleModalClose} />
      </Modal>
    </Card>
  );
};

export default EmployeeList;
