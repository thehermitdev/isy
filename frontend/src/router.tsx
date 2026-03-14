import { createBrowserRouter } from 'react-router-dom';
import { AuthLayout } from '@/templates/AuthLayout';
import { DashboardLayout } from '@/templates/DashboardLayout';
import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { RelationshipsPage } from '@/pages/RelationshipsPage';
import { OpportunitiesPage } from '@/pages/OpportunitiesPage';
import { QuotesPage } from '@/pages/QuotesPage';
import { CampaignsPage } from '@/pages/CampaignsPage';
import { SupportPage } from '@/pages/SupportPage';
import { ProductsPage } from '@/pages/ProductsPage';
import { ActivitiesPage } from '@/pages/ActivitiesPage';
import { Navigate } from 'react-router-dom';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: '/',
    element: <AuthLayout />,
    children: [
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
    ],
  },
  {
    path: '/',
    element: <DashboardLayout />,
    children: [
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'relationships', element: <RelationshipsPage /> },
      { path: 'opportunities', element: <OpportunitiesPage /> },
      { path: 'quotes', element: <QuotesPage /> },
      { path: 'campaigns', element: <CampaignsPage /> },
      { path: 'support', element: <SupportPage /> },
      { path: 'products', element: <ProductsPage /> },
      { path: 'activities', element: <ActivitiesPage /> },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/dashboard" replace />,
  },
]);
