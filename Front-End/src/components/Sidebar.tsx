import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, ClipboardList, Dumbbell, Wallet, LogOut, CalendarClock, CalendarCheck, Activity } from 'lucide-react';

export const Sidebar: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const menuItems = [
    { path: '/', icon: <LayoutDashboard size={20} />, label: 'Inicio' },
    { path: '/clients', icon: <Users size={20} />, label: 'Clientes' },
    { path: '/employees', icon: <Users size={20} />, label: 'Empleados' },
    { path: '/shifts', icon: <CalendarClock size={20} />, label: 'Turnos' },
    { path: '/my-reservations', icon: <CalendarCheck size={20} />, label: 'Reservas' },
    { path: '/my-progress', icon: <Activity size={20} />, label: 'Mi Progreso' },
    { path: '/routines', icon: <ClipboardList size={20} />, label: 'Rutinas' },
    { path: '/exercises', icon: <Dumbbell size={20} />, label: 'Ejercicios' },
    { path: '/accounting', icon: <Wallet size={20} />, label: 'Caja' },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>LeanCG</h2>
        <span className="subtitle">Pilates Studio</span>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="nav-item logout-btn" onClick={handleLogout}>
          <LogOut size={20} />
          <span>Cerrar sesión</span>
        </button>
      </div>

      <style>{`
        .sidebar {
          width: 260px;
          height: 100vh;
          position: fixed;
          top: 0;
          left: 0;
          background: rgba(15, 10, 26, 0.6);
          backdrop-filter: blur(16px);
          border-right: 1px solid var(--glass-border);
          display: flex;
          flex-direction: column;
          z-index: 100;
        }

        .sidebar-header {
          padding: 2rem;
          text-align: center;
          border-bottom: 1px solid var(--glass-border);
        }

        .sidebar-header h2 {
          color: var(--primary);
          margin-bottom: 0.2rem;
          font-weight: 700;
          letter-spacing: 1px;
        }

        .subtitle {
          color: var(--text-muted);
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 2px;
        }

        .sidebar-nav {
          flex: 1;
          padding: 1.5rem 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border-radius: var(--radius-md);
          color: var(--text-secondary);
          text-decoration: none;
          transition: all 0.2s ease;
          border: 1px solid transparent;
          background: transparent;
          width: 100%;
          cursor: pointer;
          font-family: inherit;
          font-size: 1rem;
        }

        .nav-item:hover {
          color: var(--text-primary);
          background: rgba(157, 78, 221, 0.1);
          border-color: rgba(157, 78, 221, 0.2);
        }

        .nav-item.active {
          color: white;
          background: linear-gradient(90deg, rgba(157, 78, 221, 0.2), transparent);
          border-left: 3px solid var(--primary);
          border-radius: 0 var(--radius-md) var(--radius-md) 0;
        }

        .sidebar-footer {
          padding: 1rem;
          border-top: 1px solid var(--glass-border);
        }

        .logout-btn {
          color: var(--error);
        }
        
        .logout-btn:hover {
          background: rgba(255, 77, 77, 0.1);
          border-color: rgba(255, 77, 77, 0.2);
          color: var(--error);
        }

        @media (max-width: 768px) {
          .sidebar {
            width: 100%;
            height: 60px;
            top: auto;
            bottom: 0;
            flex-direction: row;
            border-right: none;
            border-top: 1px solid var(--glass-border);
          }

          .sidebar-header, .sidebar-footer {
            display: none;
          }

          .sidebar-nav {
            flex-direction: row;
            justify-content: space-around;
            padding: 0;
          }

          .nav-item {
            flex-direction: column;
            gap: 4px;
            padding: 8px;
            font-size: 0.7rem;
            border: none;
          }

          .nav-item.active {
            border-left: none;
            border-bottom: 3px solid var(--primary);
            border-radius: var(--radius-sm) var(--radius-sm) 0 0;
            background: linear-gradient(0deg, rgba(157, 78, 221, 0.2), transparent);
          }
        }
      `}</style>
    </aside>
  );
};
