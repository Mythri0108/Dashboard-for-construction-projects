import React, { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '../components/DashboardLayout';
import {
  Users,
  UserPlus,
  UserCheck,
  UserX,
  Info,
  MinusCircle,
  CheckCircle2,
} from 'lucide-react';

interface Worker {
  id: number;
  name: string;
  role: string;
  status: 'available' | 'assigned' | 'on-leave';
  project: string | null;
  isAbsent: boolean;
  month: string;
}

function Labour() {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [newWorker, setNewWorker] = useState({
    name: '',
    role: '',
    status: 'available',
    project: '',
  });

  // Load from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('workers');
      if (saved) {
        const parsed: Worker[] = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setWorkers(parsed);
        }
      }
    } catch (err) {
      console.error('Failed to load workers from localStorage:', err);
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    try {
      if (workers.length > 0) {
        localStorage.setItem('workers', JSON.stringify(workers));
      }
    } catch (err) {
      console.error('Failed to save workers:', err);
    }
  }, [workers]);

  const addWorker = () => {
    if (!newWorker.name.trim() || !newWorker.role.trim()) {
      alert('Please fill in both Name and Role.');
      return;
    }

    const month = new Date().toLocaleString('default', { month: 'short' });

    const newEntry: Worker = {
      id: Date.now(),
      name: newWorker.name.trim(),
      role: newWorker.role.trim(),
      status: newWorker.status as Worker['status'],
      project: newWorker.project?.trim() || null,
      isAbsent: false,
      month,
    };

    setWorkers((prev) => [...prev, newEntry]);
    setNewWorker({ name: '', role: '', status: 'available', project: '' });
  };

  const toggleAbsent = useCallback((id: number) => {
    setWorkers((prev) =>
      prev.map((worker) =>
        worker.id === id ? { ...worker, isAbsent: !worker.isAbsent } : worker
      )
    );
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available':
        return <UserCheck className="text-green-500" />;
      case 'assigned':
        return <Users className="text-blue-500" />;
      case 'on-leave':
        return <UserX className="text-red-500" />;
      default:
        return <Users className="text-gray-500" />;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">Labour Management</h2>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-netflix-red text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors flex items-center gap-2"
            onClick={addWorker}
          >
            <UserPlus size={20} />
            Add Worker
          </motion.button>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            label="Available Workers"
            icon={<UserCheck className="text-green-500" />}
            count={workers.filter((w) => w.status === 'available').length}
          />
          <StatCard
            label="Assigned Workers"
            icon={<Users className="text-blue-500" />}
            count={workers.filter((w) => w.status === 'assigned').length}
          />
          <StatCard
            label="On Leave"
            icon={<UserX className="text-red-500" />}
            count={workers.filter((w) => w.status === 'on-leave').length}
          />
          <StatCard
            label="Absent"
            icon={<MinusCircle className="text-yellow-400" />}
            count={workers.filter((w) => w.isAbsent).length}
          />
        </div>

        {/* Add Form */}
        <motion.div className="bg-netflix-dark p-6 rounded-lg space-y-4">
          <h3 className="text-white font-semibold text-lg">Add New Worker</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Name"
              className="p-2 rounded-md bg-netflix-gray text-white"
              value={newWorker.name}
              onChange={(e) =>
                setNewWorker({ ...newWorker, name: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Role"
              className="p-2 rounded-md bg-netflix-gray text-white"
              value={newWorker.role}
              onChange={(e) =>
                setNewWorker({ ...newWorker, role: e.target.value })
              }
            />
            <select
              className="p-2 rounded-md bg-netflix-gray text-white"
              value={newWorker.status}
              onChange={(e) =>
                setNewWorker({
                  ...newWorker,
                  status: e.target.value as Worker['status'],
                })
              }
            >
              <option value="available">Available</option>
              <option value="assigned">Assigned</option>
              <option value="on-leave">On Leave</option>
            </select>
            <input
              type="text"
              placeholder="Project (optional)"
              className="p-2 rounded-md bg-netflix-gray text-white"
              value={newWorker.project}
              onChange={(e) =>
                setNewWorker({ ...newWorker, project: e.target.value })
              }
            />
          </div>
        </motion.div>

        {/* Worker List */}
        <motion.div className="bg-netflix-dark p-6 rounded-lg space-y-4">
          <h3 className="text-white text-lg font-semibold mb-4">Worker List</h3>
          {workers.map((worker) => (
            <motion.div
              key={worker.id}
              className="bg-netflix-gray p-4 rounded-md flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                {getStatusIcon(worker.status)}
                <div>
                  <h4 className="text-white font-medium">{worker.name}</h4>
                  <p className="text-gray-400 text-sm">{worker.role}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span
                  className={`text-sm ${
                    worker.status === 'available'
                      ? 'text-green-500'
                      : worker.status === 'assigned'
                      ? 'text-blue-500'
                      : 'text-red-500'
                  }`}
                >
                  {worker.status.charAt(0).toUpperCase() +
                    worker.status.slice(1)}
                </span>
                {worker.project && (
                  <span className="text-gray-400 text-sm">{worker.project}</span>
                )}

                <button className="text-white hover:text-blue-300 flex items-center gap-1">
                  <Info size={16} /> View Details
                </button>

                <button
                  onClick={() => toggleAbsent(worker.id)}
                  className={`text-sm px-2 py-1 rounded ${
                    worker.isAbsent
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : 'bg-yellow-400 hover:bg-yellow-500 text-black'
                  }`}
                >
                  {worker.isAbsent ? (
                    <span className="flex items-center gap-1">
                      <CheckCircle2 size={14} /> Mark Present
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <MinusCircle size={14} /> Mark Absent
                    </span>
                  )}
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </DashboardLayout>
  );
}

const StatCard = ({
  label,
  icon,
  count,
}: {
  label: string;
  icon: JSX.Element;
  count: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-netflix-dark p-6 rounded-lg"
  >
    <h3 className="text-white text-lg font-semibold mb-4 flex items-center gap-2">
      {icon}
      {label}
    </h3>
    <p className="text-3xl font-bold text-white">{count}</p>
  </motion.div>
);

export default Labour;
