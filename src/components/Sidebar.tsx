import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Home,
  Map,
  Plus,
  User,
  Cog,
  Users,
  Settings,
  HelpCircle,
  ChevronDown,
  ShoppingCart,
  Cpu,
  Building
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, isCollapsed, onToggleCollapse }) => {
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();
  const [isCadastroOpen, setIsCadastroOpen] = useState(location.pathname.startsWith('/cadastro'));
  const [isEstoqueOpen, setIsEstoqueOpen] = useState(location.pathname.startsWith('/estoque'));

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  const toggleCadastro = () => {
    setIsCadastroOpen(!isCadastroOpen);
  };

  const toggleEstoque = () => {
    setIsEstoqueOpen(!isEstoqueOpen);
  };

  // Abrir menu automaticamente quando estiver na rota correspondente
  useEffect(() => {
    setIsCadastroOpen(location.pathname.startsWith('/cadastro'));
    setIsEstoqueOpen(location.pathname.startsWith('/estoque'));
  }, [location.pathname]);

  const getIcon = (iconName: string, size: number = 20) => {
    const iconProps = { size, className: "sidebar-icon" };

    switch (iconName) {
      case 'home':
        return <Home {...iconProps} />;
      case 'map':
        return <Map {...iconProps} />;
      case 'plus':
        return <Plus {...iconProps} />;
      case 'user':
        return <User {...iconProps} />;
      case 'cog':
        return <Cog {...iconProps} />;
      case 'users':
        return <Users {...iconProps} />;
      case 'settings':
        return <Settings {...iconProps} />;
      case 'help':
        return <HelpCircle {...iconProps} />;
      case 'shopping-cart':
        return <ShoppingCart {...iconProps} />;
      case 'cpu':
        return <Cpu {...iconProps} />;
      case 'building':
        return <Building {...iconProps} />;
      default:
        return <div className="sidebar-icon" style={{ width: size, height: size }}></div>;
    }
  };

  const menuItems = [
    {
      name: 'Dashboard',
      path: '/',
      icon: 'home',
      protected: true
    },
    {
      name: 'Mapa',
      path: '/mapa',
      icon: 'map',
      protected: true
    },
    {
      name: 'Cadastro',
      icon: 'plus',
      protected: true,
      submenu: [
        {
          name: 'Cliente',
          path: '/cadastro/cliente',
          icon: 'user'
        },
        {
          name: 'Máquina',
          path: '/cadastro/maquina',
          icon: 'cog'
        },
        {
          name: 'Rastreador',
          path: '/cadastro/rastreador',
          icon: 'map'
        },
        {
          name: 'Colaborador',
          path: '/cadastro/colaborador',
          icon: 'users'
        }
      ]
    },
    {
      name: 'Estoque',
      icon: 'shopping-cart',
      protected: true,
      submenu: [
        {
          name: 'Chip GSM',
          path: '/estoque/chip-gsm',
          icon: 'cpu'
        },
        {
          name: 'Equipamento',
          path: '/estoque/equipamento',
          icon: 'cog'
        },
        {
          name: 'Forn. Chip GSM',
          path: '/estoque/fornecedor-chip-gsm',
          icon: 'building'
        }
      ]
    },
    {
      name: 'Perfil',
      path: '/profile',
      icon: 'user',
      protected: true
    },
    {
      name: 'Configurações',
      path: '/settings',
      icon: 'settings',
      protected: true
    },
    {
      name: 'Ajuda',
      path: '/help',
      icon: 'help',
      protected: false
    }
  ];

  const filteredMenuItems = isAuthenticated
    ? menuItems
    : menuItems.filter(item => !item.protected);

  return (
    <>
      {/* Overlay para mobile */}
      {isOpen && (
        <div
          className="sidebar-overlay"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`sidebar ${isOpen ? 'sidebar-open' : ''} ${isCollapsed ? 'sidebar-collapsed' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <span className="logo-icon"></span>
            {!isCollapsed && <span className="logo-text">Rastrevix</span>}
          </div>
          <button
            className="sidebar-collapse-btn"
            onClick={onToggleCollapse}
            aria-label={isCollapsed ? "Expandir sidebar" : "Colapsar sidebar"}
          >
            <span className={`collapse-icon ${isCollapsed ? 'collapsed' : ''}`}>‹</span>
          </button>
        </div>

        <nav className="sidebar-nav">
          <ul className="sidebar-menu">
            {filteredMenuItems.map((item) => (
              <li key={item.path || item.name} className="sidebar-item">
                {item.submenu ? (
                  <div className="sidebar-submenu">
                    <div
                      className="sidebar-link sidebar-submenu-header"
                      onClick={item.name === 'Cadastro' ? toggleCadastro : item.name === 'Estoque' ? toggleEstoque : undefined}
                      style={{ cursor: 'pointer' }}
                      title={isCollapsed ? item.name : undefined}
                    >
                      {getIcon(item.icon)}
                      {!isCollapsed && <span className="sidebar-text">{item.name}</span>}
                      {!isCollapsed && <ChevronDown size={16} className={`sidebar-arrow ${(item.name === 'Cadastro' && isCadastroOpen) || (item.name === 'Estoque' && isEstoqueOpen) ? 'open' : ''}`} />}
                    </div>
                    {((item.name === 'Cadastro' && isCadastroOpen) || (item.name === 'Estoque' && isEstoqueOpen)) && (
                      <ul className="sidebar-submenu-list">
                        {item.submenu.map((subItem) => (
                          <li key={subItem.path} className="sidebar-subitem">
                            <Link
                              to={subItem.path}
                              className={`sidebar-sublink ${location.pathname === subItem.path ? 'active' : ''
                                }`}
                              onClick={onClose}
                            >
                              {getIcon(subItem.icon, 16)}
                              {!isCollapsed && <span className="sidebar-text">{subItem.name}</span>}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ) : (
                  <Link
                    to={item.path}
                    className={`sidebar-link ${location.pathname === item.path ? 'active' : ''
                      }`}
                    onClick={onClose}
                    title={isCollapsed ? item.name : undefined}
                  >
                    {getIcon(item.icon)}
                    {!isCollapsed && <span className="sidebar-text">{item.name}</span>}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className="sidebar-footer">
          {isAuthenticated ? (
            <div className="user-info">
              <div className="user-avatar">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              {!isCollapsed && (
                <div className="user-details">
                  <div className="user-name">
                    {user?.name || 'Usuário'}
                  </div>
                  <div className="user-email">
                    {user?.email || 'user@email.com'}
                  </div>
                </div>
              )}
              <button
                className="logout-btn"
                onClick={handleLogout}
                aria-label="Sair"
                title={isCollapsed ? "Sair" : undefined}
              >
                {!isCollapsed ? "Sair" : "↗"}
              </button>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="auth-link login-link">
                {!isCollapsed ? "Entrar" : "→"}
              </Link>
              <Link to="/register" className="auth-link register-link">
                {!isCollapsed ? "Cadastrar" : "+"}
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
