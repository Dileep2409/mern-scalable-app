import { createContext, useContext, useEffect, useState } from "react";
import { Navigate, Route, BrowserRouter as Router, Routes, useLocation } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { TaskProvider } from './contexts/TaskContext';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';

// Layout component for public routes (login/signup)
const PublicLayout = ({ children }) => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
    <div className="w-full max-w-md">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Task Manager</h1>
          <p className="text-gray-600">Manage your tasks efficiently</p>
        </div>
        {children}
      </div>
    </div>
  </div>
);

// Component to handle page titles and scroll to top on route change
const PageWrapper = ({ children }) => {
  const location = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
    // Update page title based on route
    const routeName = location.pathname.split('/')[1] || 'home';
    document.title = `Task Manager | ${routeName.charAt(0).toUpperCase() + routeName.slice(1)}`;
  }, [location]);

  return children;
};

function AppContent() {
  const { user } = useAuth();

  return (
    <PageWrapper>
      <Routes>
        <Route 
          path="/" 
          element={
            <PublicLayout>
              {user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />}
            </PublicLayout>
          } 
        />
        
        <Route 
          path="/login" 
          element={
            user ? 
              <Navigate to="/dashboard" /> : 
              <PublicLayout><Login /></PublicLayout>
          } 
        />
        
        <Route 
          path="/signup" 
          element={
            user ? 
              <Navigate to="/dashboard" /> : 
              <PublicLayout><Signup /></PublicLayout>
          } 
        />
        
        <Route 
          path="/dashboard/*" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="*" 
          element={
            <PublicLayout>
              <Navigate to="/" />
            </PublicLayout>
          } 
        />
      </Routes>
    </PageWrapper>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <TaskProvider>
          <div className="min-h-screen bg-gray-50">
            <AppContent />
            <NotificationContainer />
          </div>
        </TaskProvider>
      </AuthProvider>
    </Router>
  );
}

// Custom Notification Component
const Notification = ({ message, type, onClose }) => (
  <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg ${type === 'error' ? 'bg-red-100 border-l-4 border-red-500' : 'bg-green-100 border-l-4 border-green-500'}`}>
    <div className="flex items-center">
      <div className="flex-shrink-0">
        {type === 'error' ? (
          <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        ) : (
          <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        )}
      </div>
      <div className="ml-3">
        <p className={`text-sm font-medium ${type === 'error' ? 'text-red-800' : 'text-green-800'}`}>
          {message}
        </p>
      </div>
      <div className="ml-4 flex-shrink-0 flex">
        <button
          onClick={onClose}
          className="inline-flex text-gray-400 focus:outline-none focus:text-gray-500 transition ease-in-out duration-150"
        >
          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  </div>
);

// Notification Context and Provider
const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState(null);
  const [show, setShow] = useState(false);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setShow(true);
    setTimeout(() => {
      setShow(false);
      // Small delay before removing the notification to allow for fade out
      setTimeout(() => setNotification(null), 300);
    }, 3000);
  };

  const closeNotification = () => {
    setShow(false);
    setTimeout(() => setNotification(null), 300);
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      {notification && (
        <div className={`fixed top-4 right-4 transition-opacity duration-300 ${show ? 'opacity-100' : 'opacity-0'}`}>
          <Notification 
            message={notification.message} 
            type={notification.type} 
            onClose={closeNotification} 
          />
        </div>
      )}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

// Update App component to use NotificationProvider
const NotificationContainer = () => null;

const AppWithNotifications = () => (
  <NotificationProvider>
    <App />
  </NotificationProvider>
);

export default AppWithNotifications;
