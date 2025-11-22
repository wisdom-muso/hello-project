"use client";

import React from 'react';
import { ConfigProvider, App } from 'antd';

export default function AntdProvider({ children }: { children: React.ReactNode }) {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1890ff',
          borderRadius: 6,
          fontSize: 14,
        },
        components: {
          Layout: {
            colorBgHeader: '#001529',
            colorBgBody: '#f0f2f5',
          },
        },
      }}
    >
      <App>{children}</App>
    </ConfigProvider>
  );
}
