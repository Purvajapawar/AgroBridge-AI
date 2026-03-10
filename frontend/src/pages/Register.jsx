import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card, Typography, Select, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined, BankOutlined, ShopOutlined, HomeOutlined } from '@ant-design/icons';
import { register } from '../services/api';

const { Title, Text } = Typography;
const { Option } = Select;

// State to District mapping
const stateDistrictMap = {
  'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Kolhapur', 'Satara', 'Solapur', 'Aurangabad', 'Thane', 'Raigad'],
  'Punjab': ['Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Bathinda', 'Hoshiarpur', 'Pathankot', 'Moga', 'Firozpur', 'Kapurthala'],
  'Haryana': ['Gurgaon', 'Faridabad', 'Panipat', 'Rohtak', 'Karnal', 'Hisar', 'Sonipat', 'Rewari', 'Sirsa', 'Panchkula'],
  'Uttar Pradesh': ['Lucknow', 'Agra', 'Varanasi', 'Allahabad', 'Kanpur', 'Ghaziabad', 'Aligarh', 'Bareilly', 'Meerut', 'Moradabad'],
  'Madhya Pradesh': ['Bhopal', 'Indore', 'Gwalior', 'Jabalpur', 'Ujjain', 'Sagar', 'Dewas', 'Satna', 'Ratlam', 'Rewa'],
  'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar', 'Jamnagar', 'Junagadh', 'Gandhinagar', 'Anand', 'Patan'],
  'Rajasthan': ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Bikaner', 'Ajmer', 'Pilani', 'Alwar', 'Bhilwara', 'Sikar'],
  'Karnataka': ['Bangalore', 'Mysore', 'Hubli', 'Mangalore', 'Belgaum', 'Dharwad', 'Gulbarga', 'Bellary', 'Tumkur', 'Shimoga'],
  'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Tiruppur', 'Vellore', 'Erode', 'Tirunelveli', 'Thoothukudi'],
  'West Bengal': ['Kolkata', 'Howrah', 'Asansol', 'Siliguri', 'Durgapur', 'Bardhaman', 'Malda', 'Kharagpur', 'Berhampore', 'Haldia']
};

const states = Object.keys(stateDistrictMap);

const Register = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [districts, setDistricts] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedState, setSelectedState] = useState(null);

  // Handle state change - load districts dynamically
  const handleStateChange = (value) => {
    setSelectedState(value);
    form.setFieldValue('district', undefined);
    
    // Get districts from the map
    const districtList = stateDistrictMap[value] || [];
    setDistricts(districtList);
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const userData = {
        name: values.name,
        email: values.email,
        password: values.password,
        role: values.role,
        contact_number: values.contact_number,
        gst_number: values.gst_number,
        state: values.state,
        district: values.district
      };

      const response = await register(userData);
      if (response.success) {
        message.success('Registration successful! Please login.');
        navigate('/login');
      } else {
        message.error(response.message || 'Registration failed');
      }
    } catch (error) {
      message.error(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const roleOptions = [
    { value: 'farmer', label: 'Farmer', icon: <BankOutlined />, description: 'Sell your crops directly to traders' },
    { value: 'trader', label: 'Trader', icon: <ShopOutlined />, description: 'Buy from farmers and sell to mills' },
    { value: 'mill', label: 'Mill', icon: <HomeOutlined />, description: 'Purchase crops from traders' }
  ];

  // GST validation pattern: 22ABCDE1234F1Z5 format
  const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
  // Contact number: 10 digits starting with 6-9
  const contactRegex = /^[6-9][0-9]{9}$/;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)', padding: '24px' }}>
      <div style={{ width: '100%', maxWidth: 600 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Link to="/"><Title level={2} style={{ color: 'white', marginBottom: 8 }}>AgroBridgeAI</Title></Link>
          <Text style={{ color: 'rgba(255,255,255,0.7)' }}>AI Powered Agri Supply Chain Platform</Text>
        </div>
        <Card style={{ borderRadius: 16, boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }} bodyStyle={{ padding: 32 }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <Title level={3} style={{ marginBottom: 8 }}>Create Account</Title>
            <Text type="secondary">Join our agricultural network</Text>
          </div>
          <Form form={form} name="register" onFinish={onFinish} layout="vertical" size="large">
            <Form.Item name="name" rules={[{ required: true, message: 'Please enter your name!' }]}>
              <Input prefix={<UserOutlined />} placeholder="Full Name" />
            </Form.Item>
            <Form.Item name="email" rules={[{ required: true, message: 'Please enter your email!' }, { type: 'email', message: 'Please enter a valid email!' }]}>
              <Input prefix={<MailOutlined />} placeholder="Email Address" />
            </Form.Item>
            <Form.Item name="contact_number" rules={[{ required: true, message: 'Please enter your contact number!' }, { pattern: contactRegex, message: 'Contact must be 10 digits starting with 6-9!' }]}>
              <Input prefix={<PhoneOutlined />} placeholder="Contact Number (10 digits, e.g., 9876543210)" maxLength={10} />
            </Form.Item>
            <Form.Item name="password" rules={[{ required: true, message: 'Please enter a password!' }, { min: 6, message: 'Password must be at least 6 characters!' }]}>
              <Input.Password prefix={<LockOutlined />} placeholder="Password (min 6 characters)" />
            </Form.Item>
            <Form.Item name="role" rules={[{ required: true, message: 'Please select your role!' }]}>
              <Select placeholder="Select your role" onChange={(value) => setSelectedRole(value)}>
                {roleOptions.map(opt => (
                  <Option key={opt.value} value={opt.value}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 18 }}>{opt.icon}</span>
                      <div><div style={{ fontWeight: 500 }}>{opt.label}</div><div style={{ fontSize: 12, color: '#888' }}>{opt.description}</div></div>
                    </div>
                  </Option>
                ))}
              </Select>
            </Form.Item>
            {(selectedRole === 'trader' || selectedRole === 'mill') && (
              <Form.Item name="gst_number" rules={[{ required: true, message: 'GST number is required for traders/mills!' }, { pattern: gstRegex, message: 'Invalid GST format (e.g., 22ABCDE1234F1Z5)' }]}>
                <Input placeholder="GST Number (e.g., 22ABCDE1234F1Z5)" maxLength={15} style={{ textTransform: 'uppercase' }} />
              </Form.Item>
            )}
            <Form.Item name="state" rules={[{ required: true, message: 'Please select your state!' }]}>
              <Select placeholder="Select State" onChange={handleStateChange} showSearch>
                {states.map(state => (<Option key={state} value={state}>{state}</Option>))}
              </Select>
            </Form.Item>
            <Form.Item name="district" rules={[{ required: true, message: 'Please select your district!' }]}>
              <Select placeholder="Select District" disabled={!selectedState} showSearch>
                {districts.map(district => (<Option key={district} value={district}>{district}</Option>))}
              </Select>
            </Form.Item>
            <Form.Item><Button type="primary" htmlType="submit" loading={loading} block>Register</Button></Form.Item>
          </Form>
          <div style={{ textAlign: 'center' }}><Text type="secondary">Already have an account? </Text><Link to="/login">Login here</Link></div>
        </Card>
      </div>
    </div>
  );
};

export default Register;

