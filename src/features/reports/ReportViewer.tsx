import React, { useState } from 'react';
import { Card, Form, Select, Button, Spin, Alert, Table, Space } from 'antd';
import { ReportData } from '@/types';
import reportService from '@/api/services/reportService';
import { useQuery, useMutation } from '@tanstack/react-query';

const { Option } = Select;

interface ReportViewerProps {
  reportId: string;
  reportName: string;
}

// Placeholder component for rendering a Scorecard Report
const ScorecardReport: React.FC<{ data: any }> = ({ data }) => {
  // Assuming data is an array of objects for a table display
  if (!data || data.length === 0) {
    return <Alert message="No data available for this report." type="info" />;
  }

  // Dynamically generate columns from the first object's keys
  const columns = Object.keys(data[0]).map(key => ({
    title: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1').trim(),
    dataIndex: key,
    key: key,
  }));

  return (
    <Table
      dataSource={data}
      columns={columns}
      rowKey={(_, index) => index.toString()}
      pagination={false}
      scroll={{ x: 'max-content' }}
    />
  );
};

// Placeholder component for rendering an OKR Report
const OkrReport: React.FC<{ data: any }> = ({ data }) => {
  // Assuming data is a structured object for a more complex visualization
  return (
    <Card title="OKR Report Details" bordered={false}>
      <p>This is a placeholder for a complex OKR visualization.</p>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </Card>
  );
};

const ReportViewer: React.FC<ReportViewerProps> = ({ reportId, reportName }) => {
  const [form] = Form.useForm();
  const [reportData, setReportData] = useState<ReportData | null>(null);

  const fetchReportMutation = useMutation({
    mutationFn: (params: any) => {
      if (reportId === 'scorecard') {
        return reportService.getScorecardReport(params);
      }
      if (reportId === 'okr') {
        return reportService.getOkrReport(params);
      }
      return Promise.reject(new Error('Unknown report type'));
    },
    onSuccess: (data) => {
      setReportData(data);
    },
    onError: (error) => {
      console.error('Report fetch error:', error);
      setReportData(null);
    },
  });

  const onFinish = (values: any) => {
    fetchReportMutation.mutate(values);
  };

  const renderReportComponent = (data: any) => {
    if (reportId === 'scorecard') {
      return <ScorecardReport data={data} />;
    }
    if (reportId === 'okr') {
      return <OkrReport data={data} />;
    }
    return <Alert message="Report type not supported for viewing." type="warning" />;
  };

  return (
    <Card title={`Report: ${reportName}`} style={{ marginBottom: 20 }}>
      <Form form={form} layout="inline" onFinish={onFinish} style={{ marginBottom: 20 }}>
        {/* Placeholder for report parameters - should be dynamic based on reportId */}
        <Form.Item name="period" label="Period" rules={[{ required: true, message: 'Select period' }]}>
          <Select style={{ width: 120 }} placeholder="Select Period">
            <Option value="Q1">Q1</Option>
            <Option value="Q2">Q2</Option>
          </Select>
        </Form.Item>
        <Form.Item name="organizationId" label="Organization">
          <Input style={{ width: 150 }} placeholder="Org ID" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={fetchReportMutation.isPending}>
            Generate Report
          </Button>
        </Form.Item>
      </Form>

      <Spin spinning={fetchReportMutation.isPending}>
        {reportData && reportData.data && (
          <div style={{ marginTop: 20 }}>
            <h3>{reportData.title}</h3>
            {renderReportComponent(reportData.data)}
          </div>
        )}
        {fetchReportMutation.isError && (
          <Alert message="Error generating report" description={fetchReportMutation.error.message} type="error" showIcon />
        )}
      </Spin>
    </Card>
  );
};

export default ReportViewer;
