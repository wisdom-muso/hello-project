"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Layout, Menu, Avatar, Dropdown, Button, theme, Breadcrumb } from 'antd';
import {
  DashboardOutlined,
  BarChartOutlined,
  LineChartOutlined,
  EditOutlined,
  FileTextOutlined,
  UserOutlined,
  TeamOutlined,
  LogoutOutlined,
  SettingOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { useRouter, usePathname } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { toggleSidebar, setBreadcrumbs } from '@/store/slices/uiSlice';
import { logout } from '@/store/slices/authSlice';
import { ROUTES } from '@/utils/constants';

const { Header, Sider, Content, Footer } = Layout;

interface MainLayoutProps {
  children: React.ReactNode;
}

function MainLayout({ children }: MainLayoutProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  
  const { sidebarCollapsed, breadcrumbs } = useAppSelector((state) => state.ui);
  const { user } = useAppSelector((state) => state.auth);
  
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  // Memoize breadcrumb computation to prevent unnecessary updates
  const computedBreadcrumbs = useMemo(() => {
    const pathSegments = pathname.split('/').filter(Boolean);
    const crumbs = pathSegments.map((segment, index) => {
      const path = '/' + pathSegments.slice(0, index + 1).join('/');
      const title = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
      return { title, path };
    });
    
    return [{ title: 'Home', path: ROUTES.DASHBOARD }, ...crumbs];
  }, [pathname]);

  // Update breadcrumbs only when they actually change (deep equality check)
  useEffect(() => {
    const isDifferent = JSON.stringify(computedBreadcrumbs) !== JSON.stringify(breadcrumbs);
    if (isDifferent) {
      dispatch(setBreadcrumbs(computedBreadcrumbs));
    }
  }, [computedBreadcrumbs]);

  // Memoize menu items to prevent recreation on every render
  const menuItems: MenuProps['items'] = useMemo(() => [
    {
      key: ROUTES.DASHBOARD,
      icon: <DashboardOutlined />,
      label: 'Dashboard',
      onClick: () => router.push(ROUTES.DASHBOARD),
    },
    {
      key: ROUTES.SCORECARDS,
      icon: <BarChartOutlined />,
      label: 'Scorecards',
      onClick: () => router.push(ROUTES.SCORECARDS),
    },
    {
      key: ROUTES.KPIS,
      icon: <LineChartOutlined />,
      label: 'KPI Management',
      onClick: () => router.push(ROUTES.KPIS),
    },
    {
      key: ROUTES.MEASURE_DATA,
      icon: <EditOutlined />,
      label: 'Measure Data',
      onClick: () => router.push(ROUTES.MEASURE_DATA),
    },
    {
      key: ROUTES.REPORTS,
      icon: <FileTextOutlined />,
      label: 'Reports',
      onClick: () => router.push(ROUTES.REPORTS),
    },
    {
      key: 'admin',
      icon: <SettingOutlined />,
      label: 'Administration',
      children: [
        { key: '/employees', label: 'Employee Management', icon: <UserOutlined />, onClick: () => router.push('/employees') },
        { key: '/organizations', label: 'Organization Structure', icon: <TeamOutlined />, onClick: () => router.push('/organizations') },
      ],
    },
    {
      key: ROUTES.SETTINGS,
      icon: <SettingOutlined />,
      label: 'Settings',
      onClick: () => router.push(ROUTES.SETTINGS),
    },
  ], [router]);

  // Memoize user menu items
  const userMenuItems: MenuProps['items'] = useMemo(() => [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile',
      onClick: () => router.push(ROUTES.SETTINGS_PROFILE),
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Settings',
      onClick: () => router.push(ROUTES.SETTINGS),
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: () => {
        dispatch(logout());
        router.push(ROUTES.LOGIN);
      },
    },
  ], [router, dispatch]);

  // Memoize selected menu key calculation
  const selectedKeys = useMemo((): string[] => {
    if (pathname.startsWith(ROUTES.SCORECARDS)) return [ROUTES.SCORECARDS];
    if (pathname.startsWith(ROUTES.KPIS)) return [ROUTES.KPIS];
    if (pathname.startsWith(ROUTES.MEASURE_DATA)) return [ROUTES.MEASURE_DATA];
    if (pathname.startsWith(ROUTES.REPORTS)) return [ROUTES.REPORTS];
    if (pathname.startsWith('/employees')) return ['admin'];
    if (pathname.startsWith('/organizations')) return ['admin'];
    if (pathname.startsWith(ROUTES.SETTINGS)) return [ROUTES.SETTINGS];
    return [ROUTES.DASHBOARD];
  }, [pathname]);

  // Memoize toggle sidebar handler
  const handleToggleSidebar = useCallback(() => {
    dispatch(toggleSidebar());
  }, [dispatch]);

  // Memoize breadcrumb click handler
  const handleBreadcrumbClick = useCallback((path: string) => {
    router.push(path);
  }, [router]);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={sidebarCollapsed}
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
        }}
      >
        <div
          className="logo"
          style={{
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: 20,
            fontWeight: 'bold',
          }}
        >
          {sidebarCollapsed ? 'HF' : 'Hillfog'}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={selectedKeys}
          items={menuItems}
        />
      </Sider>
      <Layout style={{ marginLeft: sidebarCollapsed ? 80 : 200, transition: 'all 0.2s' }}>
        <Header
          style={{
            padding: '0 24px',
            background: colorBgContainer,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'sticky',
            top: 0,
            zIndex: 1,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}
        >
          <Button
            type="text"
            icon={sidebarCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={handleToggleSidebar}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Avatar
                size="default"
                icon={<UserOutlined />}
                style={{ backgroundColor: '#1890ff' }}
              />
              <span>{user?.name || 'Guest User'}</span>
            </div>
          </Dropdown>
        </Header>
        <Layout style={{ margin: '0 16px' }}>
          <Breadcrumb
            style={{ margin: '16px 0' }}
            items={breadcrumbs.map((crumb) => ({
              title: crumb.path ? (
                <a onClick={() => handleBreadcrumbClick(crumb.path!)}>{crumb.title}</a>
              ) : (
                crumb.title
              ),
            }))}
          />
          <Content
            style={{
              padding: 24,
              minHeight: 280,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            {children}
          </Content>
          <Footer style={{ textAlign: 'center' }}>
            Hillfog ©{new Date().getFullYear()} - Enterprise Performance Management
          </Footer>
        </Layout>
      </Layout>
    </Layout>
  );
}

export default React.memo(MainLayout);