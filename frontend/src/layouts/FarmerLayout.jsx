import React, { useState } from 'react'
import { Layout, Menu, Avatar, Dropdown, Typography } from 'antd'
import { 
  DashboardOutlined, 
  UploadOutlined, 
  AppstoreOutlined, 
  BarChartOutlined, 
  UserOutlined,
  LogoutOutlined,
  MenuOutlined
} from '@ant-design/icons'
import { useNavigate, useLocation, Link } from 'react-router-dom'

const { Header, Sider, Content } = Layout
const { Text } = Typography

const FarmerLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  
  const userName = localStorage.getItem('userName') || 'Farmer'

  const menuItems = [
    {
      key: '/farmer-dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard'
    },
    {
      key: '/farmer-dashboard/upload',
      icon: <UploadOutlined />,
      label: 'Upload Crop'
    },
    {
      key: '/farmer-dashboard/my-crops',
      icon: <AppstoreOutlined />,
      label: 'My Crops'
    },
    {
      key: '/farmer-dashboard/analytics',
      icon: <BarChartOutlined />,
      label: 'Analytics'
    },
    {
      key: '/farmer-dashboard/profile',
      icon: <UserOutlined />,
      label: 'Profile'
    }
  ]

  const handleMenuClick = ({ key }) => {
    navigate(key)
  }

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile',
      onClick: () => navigate('/farmer-dashboard/profile')
    },
    {
      type: 'divider'
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: () => {
        localStorage.clear()
        navigate('/login')
      }
    }
  ]

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider 
        collapsible 
        collapsed={collapsed} 
        onCollapse={setCollapsed}
        breakpoint="lg"
        style={{
          background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)',
        }}
      >
        <div style={{ 
          height: 64, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          borderBottom: '1px solid rgba(255,255,255,0.1)'
        }}>
          {collapsed ? (
            <span style={{ fontSize: 24 }}>🌾</span>
          ) : (
            <Link to="/" style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>
              🌾 AgroBridgeAI
            </Link>
          )}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={handleMenuClick}
          style={{ 
            background: 'transparent',
            borderRight: 0
          }}
        />
      </Sider>
      <Layout>
        <Header style={{ 
          background: '#fff', 
          padding: '0 24px', 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <Text strong style={{ fontSize: 18 }}>
            {menuItems.find(item => item.key === location.pathname)?.label || 'Dashboard'}
          </Text>
          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Avatar icon={<UserOutlined />} style={{ background: '#52c41a' }} />
              <span>{userName}</span>
            </div>
          </Dropdown>
        </Header>
        <Content style={{ margin: 24, padding: 24, background: '#fff', borderRadius: 8, minHeight: 280 }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  )
}

export default FarmerLayout

