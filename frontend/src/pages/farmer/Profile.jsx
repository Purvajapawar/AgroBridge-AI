import React from 'react'
import { Card, Descriptions, Avatar, Typography, Space } from 'antd'
import { UserOutlined, BankOutlined, PhoneOutlined, EnvironmentOutlined } from '@ant-design/icons'

const { Title, Text } = Typography

const FarmerProfile = () => {
  const userName = localStorage.getItem('userName') || 'Farmer'
  const userRole = localStorage.getItem('userRole') || 'farmer'
  const userState = localStorage.getItem('userState') || 'Not specified'
  const userDistrict = localStorage.getItem('userDistrict') || 'Not specified'
  const contactNumber = localStorage.getItem('contactNumber') || 'Not specified'

  return (
    <div className="fade-in">
      <Card>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Avatar size={100} icon={<UserOutlined />} style={{ background: '#52c41a' }} />
          <Title level={2} style={{ marginTop: 16, marginBottom: 4 }}>{userName}</Title>
          <Text type="secondary" style={{ textTransform: 'capitalize' }}>{userRole}</Text>
        </div>

        <Descriptions bordered column={1}>
          <Descriptions.Item label="Name">{userName}</Descriptions.Item>
          <Descriptions.Item label="Role">
            <BankOutlined /> Farmer
          </Descriptions.Item>
          <Descriptions.Item label="Contact Number">
            <PhoneOutlined /> {contactNumber}
          </Descriptions.Item>
          <Descriptions.Item label="Location">
            <Space>
              <EnvironmentOutlined />
              {userDistrict}, {userState}
            </Space>
          </Descriptions.Item>
          <Descriptions.Item label="Account Type">Registered User</Descriptions.Item>
          <Descriptions.Item label="Status">Active</Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  )
}

export default FarmerProfile

