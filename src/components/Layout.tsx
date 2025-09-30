import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useAuth } from '../contexts/AuthContext';

const Layout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebarCollapsed');
    return saved ? JSON.parse(saved) : true;
  });
  const location = useLocation();
  const { isAuthenticated, loading } = useAuth();

  // Salvar estado da sidebar no localStorage
  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', JSON.stringify(sidebarCollapsed));
  }, [sidebarCollapsed]);

  // Forçar atualização do layout quando a rota mudar
  useEffect(() => {
    // Pequeno delay para garantir que o DOM seja atualizado
    const timer = setTimeout(() => {
      // Força reflow do layout
      const mainContainer = document.querySelector('.main-container') as HTMLElement;
      if (mainContainer) {
        mainContainer.style.marginLeft = sidebarCollapsed ? '80px' : '280px';
      }
    }, 10);

    return () => clearTimeout(timer);
  }, [location.pathname, sidebarCollapsed]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Carregando...</p>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const toggleSidebarCollapse = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };


  return (
    <div className="app-layout">
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={closeSidebar}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={toggleSidebarCollapse}
      />

      <div className={`main-container ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
