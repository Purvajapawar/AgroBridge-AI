import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Form, Input, Button, Card, Typography, message, Radio } from 'antd'
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons'
import { login } from '../services/api'

const { Title, Text } = Typography

const Login = () => {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const onFinish = async (values) => {
    setLoading(true)
    try {
      const response = await login(values)
      if (response.success) {
        localStorage.setItem('token', response.token)
        localStorage.setItem('userRole', response.user.role)
        localStorage.setItem('userName', response.user.name)
        localStorage.setItem('userId', response.user._id)
        localStorage.setItem('userState', response.user.state || '')
        localStorage.setItem('userDistrict', response.user.district || '')
        localStorage.setItem('contactNumber', response.user.contact_number || '')
        localStorage.setItem('gstNumber', response.user.gst_number || '')
        
        message.success('Login successful!')
        
        // Redirect based on role
        if (response.user.role === 'farmer') {
          navigate('/farmer-dashboard')
        } else if (response.user.role === 'trader') {
          navigate('/trader-dashboard')
        } else if (response.user.role === 'mill') {
          navigate('/mill-dashboard')
        } else {
          navigate('/')
        }
      } else {
        message.error(response.message || 'Login failed')
      }
    } catch (error) {
      message.error(error.response?.data?.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      padding: '24px'
    }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Link to="/">
            <Title level={2} style={{ color: 'white', marginBottom: 8 }}>
              🌾 AgroBridgeAI
            </Title>
          </Link>
          <Text style={{ color: 'rgba(255,255,255,0.7)' }}>
            AI Powered Agri Supply Chain Platform
          </Text>
        </div>

        <Card 
          style={{ 
            borderRadius: 16,
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
          }}
          bodyStyle={{ padding: 32 }}
        >
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <Title level={3} style={{ marginBottom: 8 }}>Welcome Back</Title>
            <Text type="secondary">Login to your account</Text>
          </div>

          <Form
            name="login"
            onFinish={onFinish}
            layout="vertical"
            size="large"
          >
            <Form.Item
              name="email"
              rules={[
                { required: true, message: 'Please enter your email!' },
                { type: 'email', message: 'Please enter a valid email!' }
              ]}
            >
              <Input 
                prefix={<MailOutlined />} 
                placeholder="Email Address" 
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Please enter your password!' }]}
            >
              <Input.Password 
                prefix={<LockOutlined />} 
                placeholder="Password" 
              />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading} block>
                Login
              </Button>
            </Form.Item>
          </Form>

          <div style={{ textAlign: 'center' }}>
            <Text type="secondary">Don't have an account? </Text>
            <Link to="/register">Register now</Link>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default Login

