import React from 'react';
import { Form, Input, Select, Switch, Button, Space } from 'antd';
import { Employee } from '@/types';
import employeeService from '@/api/services/employeeService';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const { Option } = Select;

interface EmployeeFormProps {
  initialData?: Employee;
  onSuccess: () => void;
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({ initialData, onSuccess }) => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: Omit<Employee, 'oid'> | Partial<Employee>) => {
      if (initialData) {
        return employeeService.update(initialData.oid, data as Partial<Employee>);
      }
      return employeeService.create(data as Omit<Employee, 'oid'>);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      onSuccess();
    },
  });

  const onFinish = (values: any) => {
    mutation.mutate(values);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={initialData}
      onFinish={onFinish}
    >
      <Form.Item
        name="employeeId"
        label="Employee ID"
        rules={[{ required: true, message: 'Please input the Employee ID!' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="fullName"
        label="Full Name"
        rules={[{ required: true, message: 'Please input the full name!' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="email"
        label="Email"
        rules={[{ required: true, type: 'email', message: 'Please input a valid email!' }]}
      >
        <Input />
      </Form.Item>
      {/* Organization OID - Placeholder for Select with organization lookup */}
      <Form.Item
        name="organizationOid"
        label="Organization"
        rules={[{ required: true, message: 'Please select an organization!' }]}
      >
        <Select placeholder="Select organization">
          {/* Replace with actual organization data mapping */}
          <Option value="org1">Organization 1 (Placeholder)</Option>
          <Option value="org2">Organization 2 (Placeholder)</Option>
        </Select>
      </Form.Item>
      <Form.Item
        name="role"
        label="Role"
        rules={[{ required: true, message: 'Please select a role!' }]}
      >
        <Select placeholder="Select role">
          <Option value="ADMIN">ADMIN</Option>
          <Option value="MANAGER">MANAGER</Option>
          <Option value="USER">USER</Option>
        </Select>
      </Form.Item>
      <Form.Item name="isLocked" label="Is Locked" valuePropName="checked">
        <Switch />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={mutation.isPending}>
          {initialData ? 'Update Employee' : 'Create Employee'}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default EmployeeForm;
