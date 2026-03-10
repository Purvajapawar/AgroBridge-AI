import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from 'antd'
import LandingPage from './pages/LandingPage'
import Login from './pages/Login'
import Register from './pages/Register'
import FarmerDashboard from './pages/farmer/FarmerDashboard'
import UploadCrop from './pages/farmer/UploadCrop'
import MyCrops from './pages/farmer/MyCrops'
import FarmerAnalytics from './pages/farmer/Analytics'
import FarmerProfile from './pages/farmer/Profile'
import TraderDashboard from './pages/trader/TraderDashboard'
import FarmerCrops from './pages/trader/FarmerCrops'
import Inventory from './pages/trader/Inventory'
import CreateListing from './pages/trader/CreateListing'
import TraderAnalytics from './pages/trader/Analytics'
import TraderProfile from './pages/trader/Profile'
import MillDashboard from './pages/mill/MillDashboard'
import Products from './pages/mill/Products'
import Orders from './pages/mill/Orders'
import MillProfile from './pages/mill/Profile'
import FarmerLayout from './layouts/FarmerLayout'
import TraderLayout from './layouts/TraderLayout'
import MillLayout from './layouts/MillLayout'

const { Content } = Layout

// Protected Route Component
const ProtectedRoute = ({ children, allowedRole }) => {
  const userRole = localStorage.getItem('userRole')
  const token = localStorage.getItem('token')

  if (!token) {
    return <Navigate to="/login" replace />
  }

  if (allowedRole && userRole !== allowedRole) {
    return <Navigate to={`/${userRole}-dashboard`} replace />
  }

  return children
}

function App() {
  return (
    <Router>
      <Layout style={{ minHeight: '100vh' }}>
        <Content>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Farmer Routes */}
            <Route path="/farmer-dashboard" element={
              <ProtectedRoute allowedRole="farmer">
                <FarmerLayout><FarmerDashboard /></FarmerLayout>
              </ProtectedRoute>
            } />
            <Route path="/farmer-dashboard/upload" element={
              <ProtectedRoute allowedRole="farmer">
                <FarmerLayout><UploadCrop /></FarmerLayout>
              </ProtectedRoute>
            } />
            <Route path="/farmer-dashboard/my-crops" element={
              <ProtectedRoute allowedRole="farmer">
                <FarmerLayout><MyCrops /></FarmerLayout>
              </ProtectedRoute>
            } />
            <Route path="/farmer-dashboard/analytics" element={
              <ProtectedRoute allowedRole="farmer">
                <FarmerLayout><FarmerAnalytics /></FarmerLayout>
              </ProtectedRoute>
            } />
            <Route path="/farmer-dashboard/profile" element={
              <ProtectedRoute allowedRole="farmer">
                <FarmerLayout><FarmerProfile /></FarmerLayout>
              </ProtectedRoute>
            } />

            {/* Trader Routes */}
            <Route path="/trader-dashboard" element={
              <ProtectedRoute allowedRole="trader">
                <TraderLayout><TraderDashboard /></TraderLayout>
              </ProtectedRoute>
            } />
            <Route path="/trader-dashboard/farmer-crops" element={
              <ProtectedRoute allowedRole="trader">
                <TraderLayout><FarmerCrops /></TraderLayout>
              </ProtectedRoute>
            } />
            <Route path="/trader-dashboard/inventory" element={
              <ProtectedRoute allowedRole="trader">
                <TraderLayout><Inventory /></TraderLayout>
              </ProtectedRoute>
            } />
            <Route path="/trader-dashboard/create-listing" element={
              <ProtectedRoute allowedRole="trader">
                <TraderLayout><CreateListing /></TraderLayout>
              </ProtectedRoute>
            } />
            <Route path="/trader-dashboard/analytics" element={
              <ProtectedRoute allowedRole="trader">
                <TraderLayout><TraderAnalytics /></TraderLayout>
              </ProtectedRoute>
            } />
            <Route path="/trader-dashboard/profile" element={
              <ProtectedRoute allowedRole="trader">
                <TraderLayout><TraderProfile /></TraderLayout>
              </ProtectedRoute>
            } />

            {/* Mill Routes */}
            <Route path="/mill-dashboard" element={
              <ProtectedRoute allowedRole="mill">
                <MillLayout><MillDashboard /></MillLayout>
              </ProtectedRoute>
            } />
            <Route path="/mill-dashboard/products" element={
              <ProtectedRoute allowedRole="mill">
                <MillLayout><Products /></MillLayout>
              </ProtectedRoute>
            } />
            <Route path="/mill-dashboard/orders" element={
              <ProtectedRoute allowedRole="mill">
                <MillLayout><Orders /></MillLayout>
              </ProtectedRoute>
            } />
            <Route path="/mill-dashboard/profile" element={
              <ProtectedRoute allowedRole="mill">
                <MillLayout><MillProfile /></MillLayout>
              </ProtectedRoute>
            } />

            {/* Default redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Content>
      </Layout>
    </Router>
  )
}

export default App

