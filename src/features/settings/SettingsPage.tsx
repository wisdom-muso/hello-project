"use client";

import React, { useState } from 'react';
import {
  Card,
  Tabs,
  Form,
  Input,
  Button,
  Switch,
  Select,
  Space,
  Avatar,
  Upload,
  message,
  Divider,
  Typography,
  Row,
  Col,
} from 'antd';
import {
  UserOutlined,
  LockOutlined,
  BellOutlined,
  SettingOutlined,
  UploadOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { useAppSelector } from '@/store/hooks';

const { Title, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;
const { TabPane } = Tabs;

export default function SettingsPage() {
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const { user } = useAppSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);

  // Profile form submission
  const handleProfileSubmit = async (values: any) => {
    setLoading(true);
    try {
      // In real implementation, call API to update profile
      console.log('Updating profile:', values);
      message.success('Profile updated successfully');
    } catch (error) {
      message.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  // Password form submission
  const handlePasswordSubmit = async (values: any) => {
    if (values.newPassword !== values.confirmPassword) {
      message.error('New passwords do not match');
      return;
    }
    
    setLoading(true);
    try {
      // In real implementation, call API to change password
      console.log('Changing password');
      message.success('Password changed successfully');
      passwordForm.resetFields();
    } catch (error) {
      message.error('Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  // Notification settings submission
  const handleNotificationSubmit = async (values: any) => {
    setLoading(true);
    try {
      // In real implementation, call API to update notification settings
      console.log('Updating notification settings:', values);
      message.success('Notification settings updated successfully');
    } catch (error) {
      message.error('Failed to update notification settings');
    } finally {
      setLoading(false);
    }
  };

  // Application settings submission
  const handleAppSettingsSubmit = async (values: any) => {
    setLoading(true);
    try {
      // In real implementation, call API to update app settings
      console.log('Updating app settings:', values);
      message.success('Application settings updated successfully');
    } catch (error) {
      message.error('Failed to update app settings');
    } finally {
      setLoading(false);
    }
  };

  // Upload props
  const uploadProps: UploadProps = {
    name: 'avatar',
    action: '/api/upload',
    showUploadList: false,
    onChange(info) {
      if (info.file.status === 'done') {
        message.success(`${info.file.name} uploaded successfully`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} upload failed.`);
      }
    },
  };

  return (
    <div>
      <Title level={2}>Settings</Title>
      <Paragraph type="secondary">
        Manage your account settings and preferences.
      </Paragraph>

      <Card style={{ marginTop: 24 }}>
        <Tabs defaultActiveKey="profile" tabPosition="left">
          <TabPane
            tab={
              <span>
                <UserOutlined />
                Profile
              </span>
            }
            key="profile"
          >
            <Title level={4}>Profile Settings</Title>
            <Divider />
            
            <Form
              form={form}
              layout="vertical"
              onFinish={handleProfileSubmit}
              initialValues={{
                name: user?.name || '',
                email: user?.email || '',
                role: user?.role || 'user',
              }}
            >
              <Row gutter={24}>
                <Col span={24} style={{ marginBottom: 24 }}>
                  <Space direction="vertical" align="center" style={{ width: '100%' }}>
                    <Avatar size={100} icon={<UserOutlined />} src={user?.avatar} />
                    <Upload {...uploadProps}>
                      <Button icon={<UploadOutlined />}>Change Avatar</Button>
                    </Upload>
                  </Space>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item
                    label="Full Name"
                    name="name"
                    rules={[{ required: true, message: 'Please enter your name' }]}
                  >
                    <Input placeholder="Enter your full name" />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                      { required: true, message: 'Please enter your email' },
                      { type: 'email', message: 'Please enter a valid email' },
                    ]}
                  >
                    <Input placeholder="Enter your email" />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item label="Role" name="role">
                    <Select disabled>
                      <Option value="admin">Administrator</Option>
                      <Option value="manager">Manager</Option>
                      <Option value="user">User</Option>
                    </Select>
                  </Form.Item>
                </Col>

                <Col span={24}>
                  <Form.Item label="Bio" name="bio">
                    <TextArea rows={4} placeholder="Tell us about yourself" />
                  </Form.Item>
                </Col>

                <Col span={24}>
                  <Button type="primary" htmlType="submit" loading={loading} icon={<SaveOutlined />}>
                    Save Profile
                  </Button>
                </Col>
              </Row>
            </Form>
          </TabPane>

          <TabPane
            tab={
              <span>
                <LockOutlined />
                Security
              </span>
            }
            key="security"
          >
            <Title level={4}>Change Password</Title>
            <Divider />
            
            <Form form={passwordForm} layout="vertical" onFinish={handlePasswordSubmit}>
              <Row gutter={24}>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="Current Password"
                    name="currentPassword"
                    rules={[{ required: true, message: 'Please enter your current password' }]}
                  >
                    <Input.Password placeholder="Enter current password" />
                  </Form.Item>
                </Col>

                <Col span={24} />

                <Col xs={24} md={12}>
                  <Form.Item
                    label="New Password"
                    name="newPassword"
                    rules={[
                      { required: true, message: 'Please enter new password' },
                      { min: 8, message: 'Password must be at least 8 characters' },
                    ]}
                  >
                    <Input.Password placeholder="Enter new password" />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item
                    label="Confirm New Password"
                    name="confirmPassword"
                    rules={[{ required: true, message: 'Please confirm new password' }]}
                  >
                    <Input.Password placeholder="Confirm new password" />
                  </Form.Item>
                </Col>

                <Col span={24}>
                  <Button type="primary" htmlType="submit" loading={loading}>
                    Change Password
                  </Button>
                </Col>
              </Row>
            </Form>
          </TabPane>

          <TabPane
            tab={
              <span>
                <BellOutlined />
                Notifications
              </span>
            }
            key="notifications"
          >
            <Title level={4}>Notification Preferences</Title>
            <Divider />
            
            <Form
              layout="vertical"
              onFinish={handleNotificationSubmit}
              initialValues={{
                emailNotifications: true,
                scorecardupdates: true,
                kpiAlerts: true,
                weeklyReports: false,
              }}
            >
              <Form.Item label="Email Notifications" name="emailNotifications" valuePropName="checked">
                <Switch />
              </Form.Item>

              <Form.Item label="Scorecard Updates" name="scorecardUpdates" valuePropName="checked">
                <Switch />
              </Form.Item>

              <Form.Item label="KPI Alerts" name="kpiAlerts" valuePropName="checked">
                <Switch />
              </Form.Item>

              <Form.Item label="Weekly Performance Reports" name="weeklyReports" valuePropName="checked">
                <Switch />
              </Form.Item>

              <Button type="primary" htmlType="submit" loading={loading} icon={<SaveOutlined />}>
                Save Preferences
              </Button>
            </Form>
          </TabPane>

          <TabPane
            tab={
              <span>
                <SettingOutlined />
                Application
              </span>
            }
            key="application"
          >
            <Title level={4}>Application Settings</Title>
            <Divider />
            
            <Form
              layout="vertical"
              onFinish={handleAppSettingsSubmit}
              initialValues={{
                theme: 'light',
                language: 'en',
                dateFormat: 'YYYY-MM-DD',
                timezone: 'UTC',
              }}
            >
              <Row gutter={24}>
                <Col xs={24} md={12}>
                  <Form.Item label="Theme" name="theme">
                    <Select>
                      <Option value="light">Light</Option>
                      <Option value="dark">Dark</Option>
                      <Option value="auto">Auto</Option>
                    </Select>
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item label="Language" name="language">
                    <Select>
                      <Option value="en">English</Option>
                      <Option value="es">Spanish</Option>
                      <Option value="fr">French</Option>
                      <Option value="de">German</Option>
                    </Select>
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item label="Date Format" name="dateFormat">
                    <Select>
                      <Option value="YYYY-MM-DD">YYYY-MM-DD</Option>
                      <Option value="DD/MM/YYYY">DD/MM/YYYY</Option>
                      <Option value="MM/DD/YYYY">MM/DD/YYYY</Option>
                    </Select>
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item label="Timezone" name="timezone">
                    <Select showSearch>
                      <Option value="UTC">UTC</Option>
                      <Option value="America/New_York">Eastern Time</Option>
                      <Option value="America/Los_Angeles">Pacific Time</Option>
                      <Option value="Europe/London">London</Option>
                      <Option value="Asia/Tokyo">Tokyo</Option>
                    </Select>
                  </Form.Item>
                </Col>

                <Col span={24}>
                  <Button type="primary" htmlType="submit" loading={loading} icon={<SaveOutlined />}>
                    Save Settings
                  </Button>
                </Col>
              </Row>
            </Form>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
}
