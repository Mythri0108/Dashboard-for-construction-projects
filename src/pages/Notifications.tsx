import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';

interface Notification {
  id: number;
  type: 'warning' | 'success' | 'info';
  message: string;
  time: string;
}

interface Project {
  id: number;
  name: string;
  deadline: string;
  progress: number;
  status: string;
}

interface Material {
  name: string;
  status: 'In Stock' | 'Out of Stock';
  quantity: number;
}

function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [readNotifications, setReadNotifications] = useState<number[]>([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const newNotifications: Notification[] = [];
    const now = new Date();

    const storedProjects = localStorage.getItem('projects');
    if (storedProjects) {
      const projects: Project[] = JSON.parse(storedProjects);

      projects.forEach((project) => {
        const createdAt = new Date(project.id); // Assuming project ID is timestamp
        const timeDiff = now.getTime() - createdAt.getTime();
        if (timeDiff < 24 * 60 * 60 * 1000) {
          newNotifications.push({
            id: project.id + 1000,
            type: 'success',
            message: `New project added: ${project.name}`,
            time: 'Just now',
          });
        }

        const deadlineDate = new Date(project.deadline);
        const daysLeft = (deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
        if (daysLeft >= 0 && daysLeft <= 3) {
          newNotifications.push({
            id: project.id + 2000,
            type: 'warning',
            message: `Deadline approaching for ${project.name} (${Math.ceil(daysLeft)} days left)`,
            time: 'Today',
          });
        }
      });
    }

    const storedMaterials = localStorage.getItem('materials');
    if (storedMaterials) {
      const materials: Material[] = JSON.parse(storedMaterials);
      materials.forEach((material, index) => {
        if (material.status === 'Out of Stock') {
          newNotifications.push({
            id: index + 3000,
            type: 'warning',
            message: `Out of stock: ${material.name}`,
            time: 'Today',
          });
        }
      });
    }

    setNotifications(newNotifications);
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="text-yellow-500" size={20} />;
      case 'success':
        return <CheckCircle className="text-green-500" size={20} />;
      case 'info':
        return <Info className="text-blue-500" size={20} />;
      default:
        return null;
    }
  };

  const handleMarkAllAsRead = () => {
    const allIds = notifications.map((n) => n.id);
    setReadNotifications(allIds);
  };

  const handleViewAll = () => {
    setShowAll((prev) => !prev);
  };

  const filteredNotifications = showAll
    ? notifications
    : notifications.filter((n) => !readNotifications.includes(n.id));

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-white">Notifications</h2>
            <span className="bg-netflix-red text-white text-sm px-2 py-1 rounded-full">
              {notifications.length - readNotifications.length} New
            </span>
          </div>
          <button
            onClick={handleMarkAllAsRead}
            className="text-gray-400 hover:text-white transition-colors"
          >
            Mark all as read
          </button>
        </div>

        <div className="space-y-4">
          {filteredNotifications.length === 0 && (
            <p className="text-gray-400 text-sm">No new notifications</p>
          )}
          {filteredNotifications.map((notification) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-netflix-dark p-6 rounded-lg flex items-start gap-4"
            >
              {getIcon(notification.type)}
              <div className="flex-1">
                <p className="text-white">{notification.message}</p>
                <span className="text-gray-400 text-sm">{notification.time}</span>
              </div>
              <button className="text-gray-400 hover:text-white transition-colors">
                <Bell size={20} />
              </button>
            </motion.div>
          ))}
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleViewAll}
            className="text-netflix-red hover:text-red-700 transition-colors"
          >
            {showAll ? 'Hide Read Notifications' : 'View All Notifications'}
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Notifications;
