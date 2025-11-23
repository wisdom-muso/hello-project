import React from 'react';
import { Form, Input, Button, Select } from 'antd';
import { AggregationMethod } from '@/types';
import aggregationService from '@/api/services/aggregationService';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const { Option } = Select;

interface AggregationFormProps {
  initialData?: AggregationMethod;
  onSuccess: () => void;
}

const AggregationForm: React.FC<AggregationFormProps> = ({ initialData, onSuccess }) => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: Omit<AggregationMethod, 'oid'> | Partial<AggregationMethod>) => {
      if (initialData) {
        return aggregationService.update(initialData.oid, data as Partial<AggregationMethod>);
      }
      return aggregationService.create(data as Omit<AggregationMethod, 'oid'>);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['aggregations'] });
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
        name="name"
        label="Method Name"
        rules={[{ required: true, message: 'Please input the method name!' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="methodType"
        label="Method Type"
        rules={[{ required: true, message: 'Please select the method type!' }]}
      >
        <Select placeholder="Select type">
          <Option value="SUM">SUM</Option>
          <Option value="AVERAGE">AVERAGE</Option>
          <Option value="CUSTOM">CUSTOM</Option>
        </Select>
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={mutation.isPending}>
          {initialData ? 'Update Method' : 'Create Method'}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default AggregationForm;
