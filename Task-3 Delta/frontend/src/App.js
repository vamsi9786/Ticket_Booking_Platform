import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import EventList from './pages/EventList';
import Navbar from './pages/Navbar';
import EventDetail from './pages/EventDetail';
import ForgotPassword from './pages/ForgotPassword';
import Summary from './pages/Summary';
import DashboardPage from './pages/DashboardPage';
import AdminPanel from './pages/AdminPanel';
import ProfilePage from './pages/ProfilePage';
import BookingHistory from './pages/BookingHistory';

function App() {
  return (
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={ <><Navbar /><Login /></>} />
            <Route path="/register" element={ <><Navbar /><Register /></>} />
            <Route path="/forgot-password" element={<><Navbar/><ForgotPassword/></>}/>
            {/* <Route path="/reset-password" element={<ResetPassword/>}/> */}
            <Route path="/events" element={<><Navbar /><EventList /></>} />
            <Route path="/events/:id" element={<ProtectedRoute><Navbar /><EventDetail/></ProtectedRoute>} />
            <Route path="/summary/:id" element={<ProtectedRoute allowedRoles={['user']}><Navbar /><Summary /></ProtectedRoute>} />
            <Route path="/bookings" element={<ProtectedRoute allowedRoles={['user']}><Navbar /><BookingHistory /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute ><Navbar /><ProfilePage /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute allowedRoles={['vendor']}><Navbar /><DashboardPage /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><Navbar /><AdminPanel /></ProtectedRoute>} />
          </Routes>
        </Router>
      </AuthProvider>
  );
}

export default App;
