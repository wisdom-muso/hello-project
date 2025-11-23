import React from 'react';
import { Form, Input, Button } from 'antd';
import { Formula } from '@/types';
import formulaService from '@/api/services/formulaService';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const { TextArea } = Input;

interface FormulaFormProps {
  initialData?: Formula;
  onSuccess: () => void;
}

const FormulaForm: React.FC<FormulaFormProps> = ({ initialData, onSuccess }) => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: Omit<Formula, 'oid'> | Partial<Formula>) => {
      if (initialData) {
        return formulaService.update(initialData.oid, data as Partial<Formula>);
      }
      return formulaService.create(data as Omit<Formula, 'oid'>);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['formulas'] });
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
        label="Formula Name"
        rules={[{ required: true, message: 'Please input the formula name!' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="expression"
        label="Expression (Calculation Logic)"
        rules={[{ required: true, message: 'Please input the calculation expression!' }]}
      >
        <TextArea rows={4} placeholder="e.g., (KPI_A + KPI_B) / 2" />
      </Form.Item>
      <Form.Item
        name="description"
        label="Description"
      >
        <TextArea rows={2} />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={mutation.isPending}>
          {initialData ? 'Update Formula' : 'Create Formula'}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default FormulaForm;
