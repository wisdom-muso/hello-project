import React from 'react';
import { Form, Input, Button, Select, DatePicker } from 'antd';
import { PdcaCycle } from '@/types';
import pdcaService from '@/api/services/pdcaService';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';

const { Option } = Select;

interface PdcaFormProps {
  initialData?: PdcaCycle;
  onSuccess: () => void;
}

const PdcaForm: React.FC<PdcaFormProps> = ({ initialData, onSuccess }) => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: Omit<PdcaCycle, 'oid'> | Partial<PdcaCycle>) => {
      const formattedData = {
        ...data,
        startDate: data.startDate ? dayjs(data.startDate).format('YYYY-MM-DD') : undefined,
        endDate: data.endDate ? dayjs(data.endDate).format('YYYY-MM-DD') : undefined,
      };
      if (initialData) {
        return pdcaService.update(initialData.oid, formattedData as Partial<PdcaCycle>);
      }
      return pdcaService.create(formattedData as Omit<PdcaCycle, 'oid'>);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pdcaCycles'] });
      onSuccess();
    },
  });

  const onFinish = (values: any) => {
    mutation.mutate(values);
  };

  const initialValues = initialData ? {
    ...initialData,
    startDate: dayjs(initialData.startDate),
    endDate: dayjs(initialData.endDate),
  } : {};

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={initialValues}
      onFinish={onFinish}
    >
      <Form.Item
        name="name"
        label="Cycle Name"
        rules={[{ required: true, message: 'Please input the cycle name!' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="startDate"
        label="Start Date"
        rules={[{ required: true, message: 'Please select the start date!' }]}
      >
        <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
      </Form.Item>
      <Form.Item
        name="endDate"
        label="End Date"
        rules={[{ required: true, message: 'Please select the end date!' }]}
      >
        <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
      </Form.Item>
      <Form.Item
        name="status"
        label="Status"
        rules={[{ required: true, message: 'Please select the status!' }]}
      >
        <Select placeholder="Select status">
          <Option value="PLAN">PLAN</Option>
          <Option value="DO">DO</Option>
          <Option value="CHECK">CHECK</Option>
          <Option value="ACT">ACT</Option>
        </Select>
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={mutation.isPending}>
          {initialData ? 'Update Cycle' : 'Create Cycle'}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default PdcaForm;
