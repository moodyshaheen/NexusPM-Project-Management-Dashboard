import { MemberProvider } from '@/integrations';
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom';
import { ScrollToTop } from '@/lib/scroll-to-top';
import ErrorPage from '@/integrations/errorHandlers/ErrorPage';
import HomePage from '@/components/pages/HomePage';
import ProjectsPage from '@/components/pages/ProjectsPage';
import ProjectDetailPage from '@/components/pages/ProjectDetailPage';
import ProjectFormPage from '@/components/pages/ProjectFormPage';
import AuthPage from '@/components/pages/AuthPage';
import ProtectedRoute from '@/components/ui/protected-route';

function Layout() {
  return (
    <>
      <ScrollToTop />
      <Outlet />
    </>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "login", element: <AuthPage /> },
      {
        path: "projects",
        element: <ProtectedRoute><ProjectsPage /></ProtectedRoute>,
      },
      {
        path: "projects/new",
        element: <ProtectedRoute><ProjectFormPage /></ProtectedRoute>,
      },
      {
        path: "projects/:id/edit",
        element: <ProtectedRoute><ProjectFormPage /></ProtectedRoute>,
      },
      {
        path: "projects/:id",
        element: <ProtectedRoute><ProjectDetailPage /></ProtectedRoute>,
      },
      { path: "*", element: <Navigate to="/" replace /> },
    ],
  },
]);

export default function AppRouter() {
  return (
    <MemberProvider>
      <RouterProvider router={router} />
    </MemberProvider>
  );
}
