import React, { useState } from 'react';
import { Card, List, message, Spin, Button } from 'antd';
import { FileTextOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import reportService from '@/api/services/reportService';
import ReportViewer from './ReportViewer';

interface Report {
  id: string;
  name: string;
}

const ReportsList: React.FC = () => {
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  // Fetch list of available reports
  const { data: availableReports, isLoading, isError } = useQuery({
    queryKey: ['availableReports'],
    queryFn: reportService.getAvailableReports,
    onError: () => {
      message.error('Failed to load available reports.');
    }
  });

  if (selectedReport) {
    return (
      <Card
        title={`Report: ${selectedReport.name}`}
        extra={<Button icon={<ArrowLeftOutlined />} onClick={() => setSelectedReport(null)}>Back to Reports</Button>}
      >
        <ReportViewer
          reportId={selectedReport.id}
          reportName={selectedReport.name}
        />
      </Card>
    );
  }

  return (
    <Card title="Available Reports">
      <Spin spinning={isLoading}>
        {isError && <p>Could not load reports.</p>}
        <List
          itemLayout="horizontal"
          dataSource={availableReports}
          renderItem={(item) => (
            <List.Item
              actions={[<a key="list-load" onClick={() => setSelectedReport(item)}>View Report</a>]}
            >
              <List.Item.Meta
                avatar={<FileTextOutlined style={{ fontSize: 24, color: '#1890ff' }} />}
                title={item.name}
                description={`Report ID: ${item.id}`}
              />
            </List.Item>
          )}
        />
      </Spin>
    </Card>
  );
};

export default ReportsList;
