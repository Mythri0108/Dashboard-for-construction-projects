import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '../components/DashboardLayout';

interface Project {
  id: number;
  name: string;
  deadline: string;
  progress: number;
  status: string;
}

function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [newProject, setNewProject] = useState({
    name: '',
    deadline: '',
    progress: 0,
    status: 'In Progress'
  });

  // Load from localStorage once
  useEffect(() => {
    try {
      const stored = localStorage.getItem('projects');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setProjects(parsed);
        }
      }
    } catch (error) {
      console.error('Error loading projects from localStorage:', error);
    }
  }, []);

  // Save to localStorage only if projects array is not empty
  useEffect(() => {
    try {
      if (projects && projects.length > 0) {
        localStorage.setItem('projects', JSON.stringify(projects));
      }
    } catch (error) {
      console.error('Error saving projects to localStorage:', error);
    }
  }, [projects]);

  const addProject = () => {
    if (!newProject.name.trim()) return;
    const project: Project = {
      id: Date.now(),
      name: newProject.name,
      deadline: newProject.deadline || 'No deadline',
      progress: newProject.progress,
      status: newProject.status
    };
    const updated = [...projects, project];
    setProjects(updated);
    localStorage.setItem('projects', JSON.stringify(updated)); // save immediately
    setNewProject({ name: '', deadline: '', progress: 0, status: 'In Progress' });
  };

  const deleteProject = (id: number) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      const updated = projects.filter(p => p.id !== id);
      setProjects(updated);
      localStorage.setItem('projects', JSON.stringify(updated));
    }
  };

  const updateProject = (id: number, updated: Partial<Project>) => {
    const updatedProjects = projects.map(p => p.id === id ? { ...p, ...updated } : p);
    setProjects(updatedProjects);
    localStorage.setItem('projects', JSON.stringify(updatedProjects));
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">Projects</h2>
        </div>

        {/* Add New Project */}
        <motion.div className="bg-netflix-dark p-6 rounded-lg space-y-4">
          <h3 className="text-white font-semibold text-lg">Add New Project</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Project Name"
              className="p-2 rounded-md bg-netflix-gray text-white"
              value={newProject.name}
              onChange={e => setNewProject({ ...newProject, name: e.target.value })}
            />
            <input
              type="date"
              className="p-2 rounded-md bg-netflix-gray text-white"
              value={newProject.deadline}
              onChange={e => setNewProject({ ...newProject, deadline: e.target.value })}
            />
            <input
              type="number"
              min="0"
              max="100"
              placeholder="Progress %"
              className="p-2 rounded-md bg-netflix-gray text-white"
              value={newProject.progress}
              onChange={e => setNewProject({ ...newProject, progress: parseInt(e.target.value) || 0 })}
            />
            <button
              onClick={addProject}
              className="bg-netflix-red text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
            >
              Add Project
            </button>
          </div>
        </motion.div>

        {/* Project List */}
        <div className="grid grid-cols-1 gap-6">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-netflix-dark p-6 rounded-lg"
            >
              <div className="flex justify-between items-start">
                <div className="flex flex-col gap-1">
                  <input
                    type="text"
                    value={project.name}
                    className="bg-transparent text-white font-semibold text-lg border-none outline-none"
                    onChange={e => updateProject(project.id, { name: e.target.value })}
                  />
                  <input
                    type="date"
                    value={project.deadline}
                    className="bg-transparent text-gray-400 text-sm border-none outline-none"
                    onChange={e => updateProject(project.id, { deadline: e.target.value })}
                  />
                </div>
                <span className="bg-green-500/20 text-green-500 px-3 py-1 rounded-full text-sm">
                  {project.status}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="mt-4">
                <div className="flex justify-between text-sm text-gray-400 mb-2">
                  <span>Progress</span>
                  <span>{project.progress}%</span>
                </div>
                <div className="h-2 bg-netflix-gray rounded-full">
                  <div
                    className="h-full bg-netflix-red rounded-full"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={project.progress}
                  onChange={e => updateProject(project.id, { progress: parseInt(e.target.value) })}
                  className="mt-2 w-full"
                />
              </div>

              {/* Delete Button */}
              <div className="flex justify-end mt-4">
                <button
                  onClick={() => deleteProject(project.id)}
                  className="text-red-400 hover:text-red-600 text-sm"
                >
                  Delete Project
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Projects;
