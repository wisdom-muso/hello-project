import React from 'react';
import { Form, Input, Button, Select, Space } from 'antd';
import { Organization } from '@/types';
import organizationService from '@/api/services/organizationService';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const { TextArea } = Input;

interface OrganizationFormProps {
  initialData?: Organization;
  onSuccess: () => void;
}

const OrganizationForm: React.FC<OrganizationFormProps> = ({ initialData, onSuccess }) => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: Omit<Organization, 'oid'> | Partial<Organization>) => {
      if (initialData) {
        return organizationService.update(initialData.oid, data as Partial<Organization>);
      }
      return organizationService.create(data as Omit<Organization, 'oid'>);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
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
        name="orgId"
        label="Organization ID"
        rules={[{ required: true, message: 'Please input the Organization ID!' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="name"
        label="Name"
        rules={[{ required: true, message: 'Please input the organization name!' }]}
      >
        <Input />
      </Form.Item>
      {/* Parent OID - Placeholder for TreeSelect with organization lookup */}
      <Form.Item
        name="parentOid"
        label="Parent Organization"
      >
        <Select allowClear placeholder="Select parent organization">
          {/* Replace with actual organization data mapping (TreeSelect recommended) */}
          <Select.Option value="parent1">Parent Org 1 (Placeholder)</Select.Option>
          <Select.Option value="parent2">Parent Org 2 (Placeholder)</Select.Option>
        </Select>
      </Form.Item>
      <Form.Item
        name="description"
        label="Description"
      >
        <TextArea rows={4} />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={mutation.isPending}>
          {initialData ? 'Update Organization' : 'Create Organization'}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default OrganizationForm;
