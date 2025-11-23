import React from 'react';
import { Form, Input, Button, Space, Card, Select, DatePicker, Row, Col, InputNumber } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { OkrBase, Objective, KeyResult } from '@/types';
import okrService from '@/api/services/okrService';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const { Option } = Select;

interface OkrFormProps {
  initialData?: OkrBase;
  onSuccess: () => void;
}

// Helper component for KeyResult form fields
const KeyResultFields: React.FC<{ field: any; remove: (index: number) => void }> = ({ field, remove }) => (
  <Space style={{ display: 'flex', marginBottom: 8 }} align="baseline">
    <Form.Item
      {...field}
      name={[field.name, 'name']}
      fieldKey={[field.fieldKey, 'name']}
      rules={[{ required: true, message: 'Missing KR name' }]}
      style={{ width: '30%' }}
    >
      <Input placeholder="Key Result Name" />
    </Form.Item>
    <Form.Item
      {...field}
      name={[field.name, 'targetValue']}
      fieldKey={[field.fieldKey, 'targetValue']}
      rules={[{ required: true, message: 'Missing target' }]}
      style={{ width: '20%' }}
    >
      <InputNumber placeholder="Target Value" style={{ width: '100%' }} />
    </Form.Item>
    <Form.Item
      {...field}
      name={[field.name, 'unit']}
      fieldKey={[field.fieldKey, 'unit']}
      rules={[{ required: true, message: 'Missing unit' }]}
      style={{ width: '15%' }}
    >
      <Input placeholder="Unit (e.g., % or $)" />
    </Form.Item>
    <Form.Item
      {...field}
      name={[field.name, 'weight']}
      fieldKey={[field.fieldKey, 'weight']}
      rules={[{ required: true, message: 'Missing weight' }]}
      style={{ width: '15%' }}
    >
      <InputNumber placeholder="Weight" min={0} max={100} style={{ width: '100%' }} />
    </Form.Item>
    <MinusCircleOutlined onClick={() => remove(field.name)} />
  </Space>
);

// Helper component for Objective form fields
const ObjectiveFields: React.FC<{ field: any; remove: (index: number) => void }> = ({ field, remove }) => (
  <Card
    size="small"
    title={
      <Space>
        Objective
        <MinusCircleOutlined onClick={() => remove(field.name)} />
      </Space>
    }
    style={{ marginBottom: 16 }}
  >
    <Form.Item
      {...field}
      name={[field.name, 'name']}
      fieldKey={[field.fieldKey, 'name']}
      rules={[{ required: true, message: 'Missing Objective name' }]}
      label="Objective Name"
    >
      <Input />
    </Form.Item>
    <Form.Item
      {...field}
      name={[field.name, 'description']}
      fieldKey={[field.fieldKey, 'description']}
      label="Description"
    >
      <Input.TextArea rows={2} />
    </Form.Item>

    <Form.List name={[field.name, 'keyResults']}>
      {(fields, { add, remove: removeKR }) => (
        <>
          <label style={{ display: 'block', marginBottom: 8 }}>Key Results</label>
          {fields.map((krField) => (
            <KeyResultFields key={krField.key} field={krField} remove={removeKR} />
          ))}
          <Form.Item>
            <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
              Add Key Result
            </Button>
          </Form.Item>
        </>
      )}
    </Form.List>
  </Card>
);

const OkrForm: React.FC<OkrFormProps> = ({ initialData, onSuccess }) => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: Omit<OkrBase, 'oid'> | Partial<OkrBase>) => {
      if (initialData) {
        return okrService.update(initialData.oid, data as Partial<OkrBase>);
      }
      return okrService.create(data as Omit<OkrBase, 'oid'>);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['okrs'] });
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
        name="title"
        label="OKR Title"
        rules={[{ required: true, message: 'Please input the OKR title!' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="period"
        label="Period"
        rules={[{ required: true, message: 'Please select the period!' }]}
      >
        <Select placeholder="e.g., Q1 2025">
          <Option value="Q1 2025">Q1 2025</Option>
          <Option value="Q2 2025">Q2 2025</Option>
          <Option value="FY 2025">FY 2025</Option>
        </Select>
      </Form.Item>

      <Form.List name="objectives">
        {(fields, { add, remove }) => (
          <>
            {fields.map((field) => (
              <ObjectiveFields key={field.key} field={field} remove={remove} />
            ))}
            <Form.Item>
              <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                Add Objective
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={mutation.isPending}>
          {initialData ? 'Update OKR' : 'Create OKR'}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default OkrForm;
