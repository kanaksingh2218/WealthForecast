import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { Import } from './pages/Import';
import { Transactions } from './pages/Transactions';
import { Forecast } from './pages/Forecast';
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';
import { AuthGuard } from './components/ui/AuthGuard';
import { useAuthStore } from './store/auth.store';
import { Toaster } from 'sonner';


const queryClient = new QueryClient();

function App() {
  const { clearAuth } = useAuthStore();

  React.useEffect(() => {
    const handleSessionExpired = () => {
      clearAuth();
    };
    window.addEventListener('auth:session-expired', handleSessionExpired);
    return () => window.removeEventListener('auth:session-expired', handleSessionExpired);
  }, [clearAuth]);

  return (
    <QueryClientProvider client={queryClient}>
      <Toaster richColors position="top-right" theme="dark" />
      <Router>

        <Routes>
          <Route path="/login" element={<Login />} />
<Route path="/register" element={<Register />} />
          <Route 
            path="/" 
            element={
              <AuthGuard>
                <Layout />
              </AuthGuard>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="import" element={<Import />} />
            <Route path="transactions" element={<Transactions />} />
            <Route path="forecast" element={<Forecast />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
