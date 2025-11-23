"use client";

import React, { useState, useMemo, useCallback } from 'react';
import {
  Card,
  Row,
  Col,
  Button,
  Select,
  DatePicker,
  Space,
  Typography,
  Divider,
  List,
  Tag,
} from 'antd';
import {
  FileTextOutlined,
  BarChartOutlined,
  LineChartOutlined,
  PieChartOutlined,
  DownloadOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';

const { Title, Paragraph } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

interface Report {
  id: string;
  name: string;
  description: string;
  type: 'scorecard' | 'kpi' | 'performance' | 'trend';
  icon: React.ReactNode;
  category: string;
}

const availableReports: Report[] = [
  {
    id: 'scorecard-summary',
    name: 'Scorecard Summary Report',
    description: 'Comprehensive overview of all scorecards and their performance',
    type: 'scorecard',
    icon: <BarChartOutlined style={{ fontSize: 24, color: '#1890ff' }} />,
    category: 'Scorecard',
  },
  {
    id: 'kpi-performance',
    name: 'KPI Performance Report',
    description: 'Detailed analysis of KPI targets vs actual performance',
    type: 'kpi',
    icon: <LineChartOutlined style={{ fontSize: 24, color: '#52c41a' }} />,
    category: 'KPI',
  },
  {
    id: 'quarterly-review',
    name: 'Quarterly Performance Review',
    description: 'Quarterly summary of strategic objectives and achievements',
    type: 'performance',
    icon: <PieChartOutlined style={{ fontSize: 24, color: '#722ed1' }} />,
    category: 'Performance',
  },
  {
    id: 'trend-analysis',
    name: 'Trend Analysis Report',
    description: 'Historical trend analysis of key performance indicators',
    type: 'trend',
    icon: <LineChartOutlined style={{ fontSize: 24, color: '#fa8c16' }} />,
    category: 'Trend',
  },
  {
    id: 'executive-dashboard',
    name: 'Executive Dashboard',
    description: 'High-level overview for executive decision-making',
    type: 'scorecard',
    icon: <BarChartOutlined style={{ fontSize: 24, color: '#eb2f96' }} />,
    category: 'Executive',
  },
  {
    id: 'objective-status',
    name: 'Strategic Objectives Status',
    description: 'Current status of all strategic objectives across perspectives',
    type: 'performance',
    icon: <FileTextOutlined style={{ fontSize: 24, color: '#13c2c2' }} />,
    category: 'Strategy',
  },
];

const ReportsList = React.memo(function ReportsList() {
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs]>([
    dayjs().subtract(1, 'month'),
    dayjs(),
  ]);
  const [reportFormat, setReportFormat] = useState<string>('pdf');

  // Memoize selected report details
  const selectedReportDetails = useMemo(() => {
    return availableReports.find((r) => r.id === selectedReport);
  }, [selectedReport]);

  // Memoize handlers to prevent unnecessary re-renders
  const handleGenerateReport = useCallback(() => {
    if (!selectedReport) {
      return;
    }
    console.log('Generating report:', {
      reportId: selectedReport,
      dateRange: [dateRange[0].format('YYYY-MM-DD'), dateRange[1].format('YYYY-MM-DD')],
      format: reportFormat,
    });
  }, [selectedReport, dateRange, reportFormat]);

  const handlePreviewReport = useCallback(() => {
    if (!selectedReport) {
      return;
    }
    console.log('Previewing report:', selectedReport);
  }, [selectedReport]);

  const handleReportSelect = useCallback((reportId: string) => {
    setSelectedReport(reportId);
  }, []);

  const handleDateRangeChange = useCallback((dates: [Dayjs, Dayjs] | null) => {
    if (dates) {
      setDateRange(dates);
    }
  }, []);

  const handleFormatChange = useCallback((value: string) => {
    setReportFormat(value);
  }, []);

  return (
    <div>
      <Title level={2}>Reports</Title>
      <Paragraph type="secondary">
        Generate and download various performance reports based on your scorecards and KPIs.
      </Paragraph>

      <Row gutter={16} style={{ marginTop: 24 }}>
        <Col xs={24} lg={16}>
          <Card title="Available Reports">
            <List
              dataSource={availableReports}
              renderItem={(report) => (
                <List.Item
                  actions={[
                    <Button
                      key="select"
                      type="link"
                      onClick={() => handleReportSelect(report.id)}
                    >
                      Select
                    </Button>,
                  ]}
                  style={{
                    backgroundColor:
                      selectedReport === report.id ? '#e6f7ff' : 'transparent',
                    padding: 16,
                    borderRadius: 8,
                    cursor: 'pointer',
                    transition: 'background-color 0.2s ease',
                  }}
                  onClick={() => handleReportSelect(report.id)}
                >
                  <List.Item.Meta
                    avatar={report.icon}
                    title={
                      <Space>
                        {report.name}
                        <Tag color="blue">{report.category}</Tag>
                      </Space>
                    }
                    description={report.description}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card title="Report Configuration">
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <div>
                <label style={{ display: 'block', marginBottom: 8 }}>
                  <strong>Date Range</strong>
                </label>
                <RangePicker
                  value={dateRange}
                  onChange={handleDateRangeChange}
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: 8 }}>
                  <strong>Format</strong>
                </label>
                <Select
                  value={reportFormat}
                  onChange={handleFormatChange}
                  style={{ width: '100%' }}
                >
                  <Option value="pdf">PDF</Option>
                  <Option value="excel">Excel</Option>
                  <Option value="csv">CSV</Option>
                </Select>
              </div>

              <Divider />

              <Space direction="vertical" style={{ width: '100%' }}>
                <Button
                  type="primary"
                  icon={<DownloadOutlined />}
                  block
                  size="large"
                  disabled={!selectedReport}
                  onClick={handleGenerateReport}
                >
                  Generate Report
                </Button>
                <Button
                  icon={<EyeOutlined />}
                  block
                  disabled={!selectedReport}
                  onClick={handlePreviewReport}
                >
                  Preview
                </Button>
              </Space>

              {selectedReportDetails && (
                <Card size="small" style={{ marginTop: 16 }}>
                  <Paragraph type="secondary" style={{ margin: 0, fontSize: 12 }}>
                    <strong>Selected:</strong> {selectedReportDetails.name}
                  </Paragraph>
                </Card>
              )}
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
});

export default ReportsList;