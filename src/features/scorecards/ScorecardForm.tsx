"use client";

import React, { useEffect, useState } from 'react';
import {
  Form,
  Input,
  Button,
  Card,
  Collapse,
  Space,
  message,
  Spin,
  Select,
} from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import type { CollapseProps } from 'antd';
import { Scorecard, Perspective, Objective } from '@/types';
import { hillfogClient } from '@/api/hillfogClient';
import { kpiService } from '@/api/services';
import { handleApiError } from '@/utils/helpers';
import { useRouter } from 'next/navigation';

const { TextArea } = Input;
const { Option } = Select;

interface ScorecardFormProps {
  scorecardId?: string;
}

export default function ScorecardForm({ scorecardId }: ScorecardFormProps) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [kpiOptions, setKpiOptions] = useState<Array<{ value: string; label: string }>>([]);
  const [loadingKpis, setLoadingKpis] = useState(false);
  const router = useRouter();

  // Fetch KPIs for selection
  useEffect(() => {
    fetchKpis();
  }, []);

  const fetchKpis = async () => {
    setLoadingKpis(true);
    try {
      const kpiMap = await kpiService.findMap();
      const options = Object.entries(kpiMap).map(([oid, kpi]) => ({
        value: oid,
        label: kpi.name,
      }));
      setKpiOptions(options);
    } catch (error) {
      console.error('Failed to fetch KPIs:', error);
      // Continue without KPI options
    } finally {
      setLoadingKpis(false);
    }
  };

  // Fetch existing scorecard if editing
  useEffect(() => {
    if (scorecardId) {
      fetchScorecard();
    }
  }, [scorecardId]);

  const fetchScorecard = async () => {
    setFetchLoading(true);
    try {
      const data = await hillfogClient.get<Scorecard>(`/scorecards/${scorecardId}`);
      form.setFieldsValue(data);
    } catch (error) {
      handleApiError(error);
    } finally {
      setFetchLoading(false);
    }
  };

  // Submit form
  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      if (scorecardId) {
        await hillfogClient.put(`/scorecards/${scorecardId}`, values);
        message.success('Scorecard updated successfully');
      } else {
        await hillfogClient.post('/scorecards', values);
        message.success('Scorecard created successfully');
      }
      router.push('/scorecards');
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <Card>
        <div style={{ textAlign: 'center', padding: 50 }}>
          <Spin size="large" />
        </div>
      </Card>
    );
  }

  return (
    <Card title={scorecardId ? 'Edit Scorecard' : 'Create New Scorecard'}>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          perspectives: [
            {
              name: '',
              description: '',
              objectives: [{ name: '', description: '', kpiIds: [] }],
            },
          ],
        }}
      >
        <Form.Item
          label="Scorecard Name"
          name="name"
          rules={[{ required: true, message: 'Please enter scorecard name' }]}
        >
          <Input placeholder="Enter scorecard name" size="large" />
        </Form.Item>

        <Form.Item label="Description" name="description">
          <TextArea
            rows={3}
            placeholder="Enter scorecard description"
          />
        </Form.Item>

        <Form.List name="perspectives">
          {(perspectives, { add: addPerspective, remove: removePerspective }) => (
            <>
              <div style={{ marginBottom: 16 }}>
                <strong style={{ fontSize: 16 }}>Perspectives</strong>
              </div>
              {perspectives.map((perspective, perspectiveIndex) => (
                <Card
                  key={perspective.key}
                  style={{ marginBottom: 16 }}
                  extra={
                    <Button
                      type="text"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => removePerspective(perspective.name)}
                    >
                      Remove Perspective
                    </Button>
                  }
                >
                  <Form.Item
                    label="Perspective Name"
                    name={[perspective.name, 'name']}
                    rules={[{ required: true, message: 'Please enter perspective name' }]}
                  >
                    <Input placeholder="e.g., Financial, Customer, Internal Process" />
                  </Form.Item>

                  <Form.Item
                    label="Perspective Description"
                    name={[perspective.name, 'description']}
                  >
                    <TextArea rows={2} placeholder="Enter perspective description" />
                  </Form.Item>

                  <Form.List name={[perspective.name, 'objectives']}>
                    {(objectives, { add: addObjective, remove: removeObjective }) => (
                      <>
                        <Collapse
                          items={objectives.map((objective, objectiveIndex) => ({
                            key: objective.key,
                            label: `Objective ${objectiveIndex + 1}`,
                            extra: (
                              <Button
                                type="text"
                                danger
                                size="small"
                                icon={<DeleteOutlined />}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeObjective(objective.name);
                                }}
                              >
                                Remove
                              </Button>
                            ),
                            children: (
                              <div>
                                <Form.Item
                                  label="Objective Name"
                                  name={[objective.name, 'name']}
                                  rules={[{ required: true, message: 'Please enter objective name' }]}
                                >
                                  <Input placeholder="Enter objective name" />
                                </Form.Item>

                                <Form.Item
                                  label="Objective Description"
                                  name={[objective.name, 'description']}
                                >
                                  <TextArea rows={2} placeholder="Enter objective description" />
                                </Form.Item>

                                <Form.Item
                                  label="Target Value"
                                  name={[objective.name, 'targetValue']}
                                >
                                  <Input type="number" placeholder="Enter target value" />
                                </Form.Item>

                                <Form.Item
                                  label="Linked KPIs"
                                  name={[objective.name, 'kpiIds']}
                                  tooltip="Select KPIs to link to this strategic objective"
                                >
                                  <Select
                                    mode="multiple"
                                    placeholder="Select KPIs to link"
                                    loading={loadingKpis}
                                    options={kpiOptions}
                                    filterOption={(input, option) =>
                                      (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                    }
                                    showSearch
                                  />
                                </Form.Item>
                              </div>
                            ),
                          }))}
                          style={{ marginBottom: 16 }}
                        />
                        <Button
                          type="dashed"
                          onClick={() => addObjective({ name: '', description: '', kpiIds: [] })}
                          icon={<PlusOutlined />}
                          block
                        >
                          Add Objective
                        </Button>
                      </>
                    )}
                  </Form.List>
                </Card>
              ))}
              <Button
                type="dashed"
                onClick={() =>
                  addPerspective({
                    name: '',
                    description: '',
                    objectives: [{ name: '', description: '', kpiIds: [] }],
                  })
                }
                icon={<PlusOutlined />}
                block
                size="large"
              >
                Add Perspective
              </Button>
            </>
          )}
        </Form.List>

        <Form.Item style={{ marginTop: 24 }}>
          <Space>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              icon={<SaveOutlined />}
              size="large"
            >
              {scorecardId ? 'Update Scorecard' : 'Create Scorecard'}
            </Button>
            <Button size="large" onClick={() => router.push('/scorecards')}>
              Cancel
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );
}