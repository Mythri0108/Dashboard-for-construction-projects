import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Package,
  Users,
  FolderKanban,
  Bell,
  LogOut,
} from 'lucide-react';
import { useAuthStore } from '../stores/authStore';

const navItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/materials', icon: Package, label: 'Materials' },
  { path: '/labour', icon: Users, label: 'Labour' },
  { path: '/projects', icon: FolderKanban, label: 'Projects' },
  { path: '/notifications', icon: Bell, label: 'Notifications' },
];

function Sidebar() {
  const logout = useAuthStore((state) => state.logout);

  return (
    <motion.div
      initial={{ x: -280 }}
      animate={{ x: 0 }}
      className="w-64 h-screen bg-netflix-dark fixed left-0 top-0 p-4 flex flex-col"
    >
      <div className="flex items-center justify-center mb-8">
        <h1 className="text-2xl font-bold text-netflix-red">Construction Hub</h1>
      </div>

      <nav className="flex-1">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-netflix-red text-white'
                      : 'text-gray-400 hover:bg-netflix-hover hover:text-white'
                  }`
                }
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <button
        onClick={logout}
        className="flex items-center space-x-3 px-4 py-3 text-gray-400 hover:bg-netflix-hover hover:text-white rounded-lg transition-colors mt-auto"
      >
        <LogOut size={20} />
        <span>Logout</span>
      </button>
    </motion.div>
  );
}

export default Sidebar;