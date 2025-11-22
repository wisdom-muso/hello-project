"use client";

import React, { useState, useEffect, useRef } from 'react';
import {
  Card,
  Select,
  DatePicker,
  Button,
  Space,
  message,
  Spin,
  Alert,
} from 'antd';
import { ReloadOutlined, SaveOutlined } from '@ant-design/icons';
import { Measure } from '@/types';
import { hillfogClient } from '@/api/hillfogClient';
import { handleApiError } from '@/utils/helpers';
import dayjs, { Dayjs } from 'dayjs';

const { Option } = Select;

export default function MeasureDataPage() {
  const [measures, setMeasures] = useState<Measure[]>([]);
  const [selectedMeasure, setSelectedMeasure] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
  const [htmlContent, setHtmlContent] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fetch measures
  useEffect(() => {
    fetchMeasures();
  }, []);

  const fetchMeasures = async () => {
    try {
      const data = await hillfogClient.get<Measure[]>('/measures');
      setMeasures(data);
    } catch (error) {
      handleApiError(error);
    }
  };

  // Fetch HTML content for selected measure and date
  const fetchMeasureData = async () => {
    if (!selectedMeasure || !selectedDate) {
      message.warning('Please select both measure and date');
      return;
    }

    setLoading(true);
    try {
      const response = await hillfogClient.get<{ html: string }>(
        `/measures/${selectedMeasure}/data`,
        {
          params: {
            date: selectedDate.format('YYYY-MM-DD'),
          },
        }
      );
      setHtmlContent(response.html);
    } catch (error) {
      handleApiError(error);
      setHtmlContent('');
    } finally {
      setLoading(false);
    }
  };

  // Intercept form submissions within rendered HTML
  useEffect(() => {
    if (!containerRef.current) return;

    const handleFormSubmit = async (event: Event) => {
      event.preventDefault();
      const form = event.target as HTMLFormElement;

      setSaving(true);
      try {
        const formData = new FormData(form);
        const data: Record<string, any> = {};
        formData.forEach((value, key) => {
          data[key] = value;
        });

        // Add measure and date context
        data.measureId = selectedMeasure;
        data.date = selectedDate.format('YYYY-MM-DD');

        await hillfogClient.post('/measures/data', data, { useFormData: true });
        message.success('Data saved successfully');

        // Refresh data
        fetchMeasureData();
      } catch (error) {
        handleApiError(error);
      } finally {
        setSaving(false);
      }
    };

    // Attach event listeners to all forms in the container
    const forms = containerRef.current.querySelectorAll('form');
    forms.forEach((form) => {
      form.addEventListener('submit', handleFormSubmit);
    });

    // Cleanup
    return () => {
      forms.forEach((form) => {
        form.removeEventListener('submit', handleFormSubmit);
      });
    };
  }, [htmlContent, selectedMeasure, selectedDate]);

  // Handle measure change
  const handleMeasureChange = (value: string) => {
    setSelectedMeasure(value);
    setHtmlContent('');
  };

  // Handle date change
  const handleDateChange = (date: Dayjs | null) => {
    if (date) {
      setSelectedDate(date);
      setHtmlContent('');
    }
  };

  return (
    <div>
      <Card
        title="Measure Data Entry"
        extra={
          <Button
            type="primary"
            icon={<ReloadOutlined />}
            onClick={fetchMeasureData}
            disabled={!selectedMeasure || !selectedDate}
          >
            Load Data
          </Button>
        }
      >
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Space size="large" wrap>
            <div>
              <label style={{ display: 'block', marginBottom: 8 }}>
                <strong>Select Measure (KPI)</strong>
              </label>
              <Select
                style={{ width: 300 }}
                placeholder="Select a measure"
                onChange={handleMeasureChange}
                value={selectedMeasure}
                showSearch
                optionFilterProp="children"
              >
                {measures.map((measure) => (
                  <Option key={measure.id} value={measure.id}>
                    {measure.name}
                  </Option>
                ))}
              </Select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: 8 }}>
                <strong>Select Date</strong>
              </label>
              <DatePicker
                value={selectedDate}
                onChange={handleDateChange}
                format="YYYY-MM-DD"
                style={{ width: 200 }}
              />
            </div>
          </Space>

          {selectedMeasure && selectedDate && (
            <Alert
              message={`Selected: ${measures.find((m) => m.id === selectedMeasure)?.name || ''} - ${selectedDate.format('YYYY-MM-DD')}`}
              type="info"
              showIcon
            />
          )}

          {loading ? (
            <div style={{ textAlign: 'center', padding: 50 }}>
              <Spin size="large" tip="Loading measure data..." />
            </div>
          ) : htmlContent ? (
            <Card
              title="Data Entry Form"
              extra={
                saving && (
                  <Space>
                    <Spin size="small" />
                    <span>Saving...</span>
                  </Space>
                )
              }
            >
              <div
                ref={containerRef}
                dangerouslySetInnerHTML={{ __html: htmlContent }}
                style={{
                  padding: 16,
                  border: '1px solid #f0f0f0',
                  borderRadius: 8,
                  backgroundColor: '#fafafa',
                }}
              />
              <Alert
                message="Form Interception Active"
                description="Forms within this HTML will be intercepted and submitted via API automatically."
                type="success"
                showIcon
                style={{ marginTop: 16 }}
              />
            </Card>
          ) : (
            <Alert
              message="No Data"
              description="Click 'Load Data' to fetch the data entry form for the selected measure and date."
              type="warning"
              showIcon
            />
          )}
        </Space>
      </Card>
    </div>
  );
}
