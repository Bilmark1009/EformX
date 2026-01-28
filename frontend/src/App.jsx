import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import FormBuilderPage from './pages/FormBuilderPage';
import PublicFormPage from './pages/PublicFormPage';
import ResponsesPage from './pages/ResponsesPage';
import ResponseDetailPage from './pages/ResponseDetailPage';
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
    return (
        <ToastProvider>
            <AuthProvider>
                <Router>
                    <Routes>
                        {/* Public routes */}
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/f/:id" element={<PublicFormPage />} />

                        {/* Protected routes */}
                        <Route path="/dashboard" element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        } />
                        <Route path="/forms/new" element={
                            <ProtectedRoute>
                                <FormBuilderPage />
                            </ProtectedRoute>
                        } />
                        <Route path="/forms/:id/edit" element={
                            <ProtectedRoute>
                                <FormBuilderPage />
                            </ProtectedRoute>
                        } />
                        <Route path="/responses" element={
                            <ProtectedRoute>
                                <ResponsesPage />
                            </ProtectedRoute>
                        } />
                        <Route path="/responses/:id" element={
                            <ProtectedRoute>
                                <ResponseDetailPage />
                            </ProtectedRoute>
                        } />

                        {/* Default redirect */}
                        <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    </Routes>
                </Router>
            </AuthProvider>
        </ToastProvider>
    );
}

export default App;
