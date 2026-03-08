import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/layout/ProtectedRoute';

// Pages
import { Landing } from './pages/Landing';
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';
import { Dashboard } from './pages/features/Dashboard';
import { Predict } from './pages/features/Predict';
import { History } from './pages/features/History';
import { Verify } from './pages/features/Verify';

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    {/* Landing Page */}
                    <Route path="/" element={<Landing />} />

                    {/* Public Routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* Protected Routes */}
                    <Route element={<ProtectedRoute />}>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/predict" element={<Predict />} />
                        <Route path="/history" element={<History />} />
                        <Route path="/verify" element={<Verify />} />
                    </Route>

                    {/* Catch-all */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
