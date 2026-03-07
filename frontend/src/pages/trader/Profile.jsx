import React from 'react'
import { Card, Descriptions, Avatar, Typography } from 'antd'
import { UserOutlined, ShopOutlined, PhoneOutlined, EnvironmentOutlined, BankOutlined } from '@ant-design/icons'

const { Title, Text } = Typography

const TraderProfile = () => {
  const userName = localStorage.getItem('userName') || 'Trader'
  const userRole = localStorage.getItem('userRole') || 'trader'
  const userState = localStorage.getItem('userState') || 'Not specified'
  const userDistrict = localStorage.getItem('userDistrict') || 'Not specified'
  const contactNumber = localStorage.getItem('contactNumber') || 'Not specified'
  const gstNumber = localStorage.getItem('gstNumber') || 'Not specified'

  return (
    <div className="fade-in">
      <Card>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Avatar size={100} icon={<UserOutlined />} style={{ background: '#1890ff' }} />
          <Title level={2} style={{ marginTop: 16, marginBottom: 4 }}>{userName}</Title>
          <Text type="secondary" style={{ textTransform: 'capitalize' }}>{userRole}</Text>
        </div>

        <Descriptions bordered column={1}>
          <Descriptions.Item label="Name">{userName}</Descriptions.Item>
          <Descriptions.Item label="Role">
            <ShopOutlined /> Trader
          </Descriptions.Item>
          <Descriptions.Item label="Contact Number">
            <PhoneOutlined /> {contactNumber}
          </Descriptions.Item>
          <Descriptions.Item label="GST Number">
            <BankOutlined /> {gstNumber}
          </Descriptions.Item>
          <Descriptions.Item label="Location">
            <EnvironmentOutlined /> {userDistrict}, {userState}
          </Descriptions.Item>
          <Descriptions.Item label="Account Type">Registered User</Descriptions.Item>
          <Descriptions.Item label="Status">Active</Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  )
}

export default TraderProfile

