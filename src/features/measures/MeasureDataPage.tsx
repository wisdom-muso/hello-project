"use client";

import React, { useState, useRef, useCallback, useMemo, useEffect } from 'react';
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
import { useSWRFetch } from '@/hooks/useSWRFetch';

const { Option } = Select;

export default function MeasureDataPage() {
  const { data: measures = [], isLoading: measuresLoading } = useSWRFetch<Measure[]>('/measures');
  const [selectedMeasure, setSelectedMeasure] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
  const [htmlContent, setHtmlContent] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Memoize fetchMeasureData function
  const fetchMeasureData = useCallback(async () => {
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
  }, [selectedMeasure, selectedDate]);

  // Memoize form submission handler
  const handleFormSubmit = useCallback(async (event: Event) => {
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
  }, [selectedMeasure, selectedDate, fetchMeasureData]);

  // Single effect to handle form submissions
  useEffect(() => {
    if (!containerRef.current || !htmlContent) return;

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
  }, [htmlContent, handleFormSubmit]);

  // Memoize handlers
  const handleMeasureChange = useCallback((value: string) => {
    setSelectedMeasure(value);
    setHtmlContent('');
  }, []);

  const handleDateChange = useCallback((date: Dayjs | null) => {
    if (date) {
      setSelectedDate(date);
      setHtmlContent('');
    }
  }, []);

  // Memoize selected measure name
  const selectedMeasureName = useMemo(() => {
    return measures.find((m) => m.id === selectedMeasure)?.name || '';
  }, [measures, selectedMeasure]);

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
                loading={measuresLoading}
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
              message={`Selected: ${selectedMeasureName} - ${selectedDate.format('YYYY-MM-DD')}`}
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