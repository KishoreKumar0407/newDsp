import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'

// Pages
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import FarmerDashboardPage from './pages/FarmerDashboardPage'
import FarmersManagementPage from './pages/FarmersManagementPage'
import AdminLandEditorPage from './pages/AdminLandEditorPage'
import DashboardPage from './pages/DashboardPage'
import ProjectDetailPage from './pages/ProjectDetailPage'
import MapViewPage from './pages/MapViewPage'
import IoTDashboardPage from './pages/IoTDashboardPage'
import DataToolsPage from './pages/DataToolsPage'
import UsersPage from './pages/UsersPage'
import MarketplacePage from './pages/MarketplacePage'
import SurveyorsManagementPage from './pages/SurveyorsManagementPage'
import FarmerSellPage from './pages/FarmerSellPage'
import SurveyorSellPage from './pages/SurveyorSellPage'

// Consumer Portal Pages
import ConsumerHomepage from './pages/consumer/ConsumerHomepage'
import ConsumerProductsPage from './pages/consumer/ConsumerProductsPage'
import ProductDetailPage from './pages/consumer/ProductDetailPage'
import BulkBuyingPage from './pages/consumer/BulkBuyingPage'
import CartPage from './pages/consumer/CartPage'
import CheckoutPage from './pages/consumer/CheckoutPage'
import OrdersPage from './pages/consumer/OrdersPage'

// Dealer Portal Pages
import DealerHomepage from './pages/dealer/DealerHomepage'
import DealerProductsPage from './pages/dealer/DealerProductsPage'
import DealerProductDetailPage from './pages/dealer/DealerProductDetailPage'
import DealerBulkBuyingPage from './pages/dealer/DealerBulkBuyingPage'
import DealerCartPage from './pages/dealer/DealerCartPage'
import DealerCheckoutPage from './pages/dealer/DealerCheckoutPage'
import DealerOrdersPage from './pages/dealer/DealerOrdersPage'

import { NavigationLoaderProvider } from './contexts/NavigationLoaderContext'

// Layout
import AppLayout from './components/layout/AppLayout'
import ProtectedRoute from './components/layout/ProtectedRoute'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <NavigationLoaderProvider>
        <Routes>
          {/* Public Gateway & Showcase */}
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<LoginPage />} />
          <Route path="/showcase" element={<LandingPage />} />

          {/* Consumer Portal Routes - Public for testing */}
          <Route element={<AppLayout />}>
            <Route path="/consumer" element={<ConsumerHomepage />} />
            <Route path="/consumer/products" element={<ConsumerProductsPage />} />
            <Route path="/consumer/product/:id" element={<ProductDetailPage />} />
            <Route path="/consumer/bulk-buying" element={<BulkBuyingPage />} />
            <Route path="/consumer/cart" element={<CartPage />} />
            <Route path="/consumer/checkout" element={<CheckoutPage />} />
            <Route path="/consumer/orders" element={<OrdersPage />} />

            {/* Dealer Portal Routes - Public for testing */}
            <Route path="/dealer" element={<DealerHomepage />} />
            <Route path="/dealer/products" element={<DealerProductsPage />} />
            <Route path="/dealer/product/:id" element={<DealerProductDetailPage />} />
            <Route path="/dealer/bulk-buying" element={<DealerBulkBuyingPage />} />
            <Route path="/dealer/cart" element={<DealerCartPage />} />
            <Route path="/dealer/checkout" element={<DealerCheckoutPage />} />
            <Route path="/dealer/orders" element={<DealerOrdersPage />} />
          </Route>

          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route path="/marketplace" element={<MarketplacePage />} />
              {/* Farmer Portal: Dedicated interactive farmland map (farmer, admin, verifier) */}
              <Route path="/farmer" element={<FarmerDashboardPage />} />
              <Route path="/farmer/sell" element={<FarmerSellPage />} />
              <Route path="/surveyor/sell" element={<SurveyorSellPage />} />

              {/* Admin & Verifier Management Console (blocked for farmer) */}
              <Route element={<ProtectedRoute allowedRoles={['admin', 'verifier']} />}>
                <Route path="/admin/farmers" element={<FarmersManagementPage />} />
                <Route path="/admin/editor/:fieldId" element={<AdminLandEditorPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/projects/:projectId" element={<ProjectDetailPage />} />
                <Route path="/map/:fieldId" element={<MapViewPage />} />
                <Route path="/iot" element={<IoTDashboardPage />} />
                <Route path="/iot/:fieldId" element={<IoTDashboardPage />} />
                <Route path="/data-tools" element={<DataToolsPage />} />
              </Route>

              {/* Admin only (Surveyor Creation & Management) */}
              <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                <Route path="/admin/surveyors" element={<SurveyorsManagementPage />} />
                <Route path="/users" element={<UsersPage />} />
              </Route>
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </NavigationLoaderProvider>
      </BrowserRouter>
    </AuthProvider>
  )
}


