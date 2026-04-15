import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import ProtectedRoute from './components/layout/ProtectedRoute';
import AdminLayout from './components/layout/AdminLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Destinations from './pages/Destinations';
import Guides from './pages/Guides';
import Bookings from './pages/Bookings';
import ExploreScreen from './pages/ExploreScreen';
import Placeholder from './pages/Placeholder';

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route element={<ProtectedRoute />}>
              <Route element={<AdminLayout />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/destinations" element={<Destinations />} />
                <Route path="/guides" element={<Guides />} />
                <Route path="/bookings" element={<Bookings />} />
                <Route path="/trips" element={<Placeholder name="Trips" />} />
                <Route path="/messages" element={<Placeholder name="Messages" />} />
                <Route path="/payments" element={<Placeholder name="Payments" />} />
                <Route path="/pages/explore" element={<ExploreScreen />} />
                <Route path="/pages/eat-drink" element={<Placeholder name="Eat & Drink" />} />
                <Route path="/pages/events" element={<Placeholder name="Events" />} />
              </Route>
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </LanguageProvider>
  );
}
