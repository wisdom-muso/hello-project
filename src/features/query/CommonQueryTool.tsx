import React, { useState } from 'react';
import { Card, Input, Button, Table, message, Spin, Row, Col, List, Space, Modal, Form, Switch } from 'antd';
import { PlayCircleOutlined, SaveOutlined, EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import queryService from '@/api/services/queryService';
import { CommonQuery } from '@/types';

const { TextArea } = Input;

// Form for saving/editing a query
const SaveQueryForm: React.FC<{ initialData?: CommonQuery, onSuccess: () => void }> = ({ initialData, onSuccess }) => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: Omit<CommonQuery, 'oid'> | Partial<CommonQuery>) => {
      if (initialData) {
        return queryService.update(initialData.oid, data as Partial<CommonQuery>);
      }
      return queryService.create(data as Omit<CommonQuery, 'oid'>);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savedQueries'] });
      onSuccess();
      message.success('Query saved successfully!');
    },
    onError: () => {
      message.error('Failed to save query.');
    }
  });

  return (
    <Form form={form} layout="vertical" onFinish={mutation.mutate} initialValues={initialData}>
      <Form.Item name="name" label="Query Name" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="sqlStatement" label="SQL Statement" rules={[{ required: true }]}>
        <TextArea rows={6} />
      </Form.Item>
      <Form.Item name="isPublic" label="Public" valuePropName="checked">
        <Switch />
      </Form.Item>
      <Button type="primary" htmlType="submit" loading={mutation.isPending}>
        {initialData ? 'Update Query' : 'Save Query'}
      </Button>
    </Form>
  );
};

const CommonQueryTool: React.FC = () => {
  const [sql, setSql] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [columns, setColumns] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuery, setEditingQuery] = useState<CommonQuery | undefined>(undefined);
  const queryClient = useQueryClient();

  // Fetch saved queries
  const { data: savedQueries, isLoading: isLoadingQueries } = useQuery({
    queryKey: ['savedQueries'],
    queryFn: queryService.getAll,
  });

  // Run query mutation
  const runQueryMutation = useMutation({
    mutationFn: (querySql: string) => queryService.runQuery(querySql),
    onSuccess: (data) => {
      if (data && data.length > 0) {
        const firstRow = data[0];
        const generatedColumns = Object.keys(firstRow).map(key => ({
          title: key,
          dataIndex: key,
          key: key,
        }));
        setColumns(generatedColumns);
        setResults(data);
      } else {
        setColumns([]);
        setResults([]);
        message.info('Query executed successfully, but returned no results.');
      }
    },
    onError: (error: any) => {
      message.error(`Query failed: ${error.message}`);
    },
  });

  // Delete query mutation
  const deleteQueryMutation = useMutation({
    mutationFn: (oid: string) => queryService.delete(oid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savedQueries'] });
      message.success('Query deleted successfully.');
    },
  });

  const handleRunQuery = () => {
    if (!sql.trim()) {
      message.warning('SQL statement cannot be empty.');
      return;
    }
    runQueryMutation.mutate(sql);
  };

  const handleSaveModal = (query?: CommonQuery) => {
    setEditingQuery(query || { oid: '', name: '', sqlStatement: sql, isPublic: false });
    setIsModalOpen(true);
  };

  return (
    <Row gutter={16}>
      <Col span={6}>
        <Card title="Saved Queries" extra={<Button icon={<PlusOutlined />} onClick={() => handleSaveModal()} />}>
          <Spin spinning={isLoadingQueries}>
            <List
              dataSource={savedQueries}
              renderItem={item => (
                <List.Item
                  actions={[
                    <Button size="small" icon={<EditOutlined />} onClick={() => handleSaveModal(item)} />,
                    <Button size="small" danger icon={<DeleteOutlined />} onClick={() => deleteQueryMutation.mutate(item.oid)} />
                  ]}
                >
                  <a onClick={() => setSql(item.sqlStatement)}>{item.name}</a>
                </List.Item>
              )}
            />
          </Spin>
        </Card>
      </Col>
      <Col span={18}>
        <Card title="Query Editor">
          <TextArea
            rows={10}
            value={sql}
            onChange={(e) => setSql(e.target.value)}
            placeholder="Enter your SQL query here..."
            style={{ fontFamily: 'monospace', marginBottom: 16 }}
          />
          <Space>
            <Button
              type="primary"
              icon={<PlayCircleOutlined />}
              onClick={handleRunQuery}
              loading={runQueryMutation.isPending}
            >
              Run Query
            </Button>
            <Button icon={<SaveOutlined />} onClick={() => handleSaveModal()}>
              Save Query
            </Button>
          </Space>
        </Card>
        <Card title="Results" style={{ marginTop: 16 }}>
          <Spin spinning={runQueryMutation.isPending}>
            <Table
              dataSource={results}
              columns={columns}
              rowKey={(r, i) => i}
              scroll={{ x: 'max-content' }}
              pagination={{ pageSize: 10 }}
            />
          </Spin>
        </Card>
      </Col>
      <Modal
        title={editingQuery?.oid ? 'Edit Query' : 'Save New Query'}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <SaveQueryForm initialData={editingQuery} onSuccess={() => setIsModalOpen(false)} />
      </Modal>
    </Row>
  );
};

export default CommonQueryTool;
