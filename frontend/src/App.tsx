import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { NotificationProvider } from './contexts/NotificationContext'
import ErrorBoundary from './components/ErrorBoundary'
import LoadingSpinner from './components/LoadingSpinner'
import NotificationContainer from './components/NotificationContainer'
import Login from './components/Login.tsx'
import Register from './components/Register.tsx'
import Dashboard from './components/Dashboard.tsx'
import ApplicationForm from './components/ApplicationForm.tsx'
import ApplicationList from './components/ApplicationList.tsx'
import Navbar from './components/Navbar.tsx'

function App() {
  return (
    <ErrorBoundary>
      <NotificationProvider>
        <AuthProvider>
          <Router>
            <div className="min-h-screen bg-gray-50">
              <Navbar />
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/applications" element={<ProtectedRoute><ApplicationList /></ProtectedRoute>} />
                <Route path="/applications/new" element={<ProtectedRoute><ApplicationForm /></ProtectedRoute>} />
                <Route path="/applications/:id/edit" element={<ProtectedRoute><ApplicationForm /></ProtectedRoute>} />
              </Routes>
              <NotificationContainer />
            </div>
          </Router>
        </AuthProvider>
      </NotificationProvider>
    </ErrorBoundary>
  )
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" text="Loading..." />
      </div>
    )
  }

  return user ? <>{children}</> : <Navigate to="/login" />
}

export default App