import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '../components/DashboardLayout';
import Map from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const MAPBOX_TOKEN = 'YOUR_MAPBOX_TOKEN'; // Replace with actual token

function Materials() {
  const [materials, setMaterials] = useState([]);
  const [viewState, setViewState] = useState({
    longitude: 78.9629,
    latitude: 20.5937,
    zoom: 4
  });

  const [showModal, setShowModal] = useState(false);
  const [newMaterial, setNewMaterial] = useState({
    name: '',
    status: 'In Stock',
    quantity: ''
  });

  // Load materials from localStorage ONCE when component mounts
  useEffect(() => {
    const savedMaterials = JSON.parse(localStorage.getItem('materials'));
    if (savedMaterials && Array.isArray(savedMaterials)) {
      setMaterials(savedMaterials);
    } else {
      // First time only: set default materials
      const defaultMaterials = [
        { name: 'Cement', status: 'In Stock', quantity: 200 },
        { name: 'Steel', status: 'Out of Stock', quantity: 0 },
        { name: 'Bricks', status: 'In Stock', quantity: 500 },
        { name: 'Sand', status: 'In Stock', quantity: 300 }
      ];
      setMaterials(defaultMaterials);
      localStorage.setItem('materials', JSON.stringify(defaultMaterials));
    }
  }, []);

  // Save to localStorage every time `materials` changes
  useEffect(() => {
    if (materials.length > 0) {
      localStorage.setItem('materials', JSON.stringify(materials));
    }
  }, [materials]);

  const handleAddMaterial = () => {
    if (!newMaterial.name || newMaterial.quantity === '') return;

    const updated = [...materials, newMaterial];
    setMaterials(updated);
    setNewMaterial({ name: '', status: 'In Stock', quantity: '' });
    setShowModal(false);
  };

  const handleStatusToggle = (index) => {
    const updated = [...materials];
    updated[index].status = updated[index].status === 'In Stock' ? 'Out of Stock' : 'In Stock';
    setMaterials(updated);
  };

  const handleQuantityChange = (index, quantity) => {
    const updated = [...materials];
    updated[index].quantity = quantity;
    setMaterials(updated);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">Materials Management</h2>
          <button
            onClick={() => setShowModal(true)}
            className="bg-netflix-red text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
          >
            Add Material
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-netflix-dark p-6 rounded-lg"
          >
            <h3 className="text-white text-lg font-semibold mb-4">Material Stock Map</h3>
            <div className="h-[400px] rounded-md overflow-hidden">
              <Map
                {...viewState}
                onMove={(evt) => setViewState(evt.viewState)}
                mapStyle="mapbox://styles/mapbox/dark-v10"
                mapboxAccessToken={MAPBOX_TOKEN}
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-netflix-dark p-6 rounded-lg"
          >
            <h3 className="text-white text-lg font-semibold mb-4">Material List</h3>
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
              {materials.map((material, index) => (
                <div
                  key={index}
                  className="bg-netflix-gray p-4 rounded-md flex flex-col md:flex-row justify-between items-start md:items-center"
                >
                  <div>
                    <h4 className="text-white font-medium">{material.name}</h4>
                    <p className="text-gray-400 text-sm">Status: {material.status}</p>
                    <p className="text-gray-400 text-sm mt-1">
                      Quantity:{' '}
                      <input
                        type="number"
                        value={material.quantity}
                        onChange={(e) => handleQuantityChange(index, e.target.value)}
                        className="ml-2 bg-transparent text-white border-b border-white focus:outline-none w-20"
                      />
                    </p>
                  </div>
                  <div className="mt-2 md:mt-0 flex items-center space-x-4">
                    <span
                      className={`${
                        material.status === 'In Stock' ? 'text-green-500' : 'text-red-500'
                      }`}
                    >
                      ●
                    </span>
                    <button
                      onClick={() => handleStatusToggle(index)}
                      className="text-sm text-netflix-red hover:text-red-700 transition"
                    >
                      Toggle Status
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Add Material Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center">
            <div className="bg-netflix-gray p-6 rounded-md w-full max-w-md">
              <h3 className="text-white text-lg font-semibold mb-4">Add Material</h3>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Material Name"
                  value={newMaterial.name}
                  onChange={(e) =>
                    setNewMaterial({ ...newMaterial, name: e.target.value })
                  }
                  className="w-full p-2 rounded bg-netflix-dark text-white"
                />
                <input
                  type="number"
                  placeholder="Quantity"
                  value={newMaterial.quantity}
                  onChange={(e) =>
                    setNewMaterial({ ...newMaterial, quantity: e.target.value })
                  }
                  className="w-full p-2 rounded bg-netflix-dark text-white"
                />
                <select
                  value={newMaterial.status}
                  onChange={(e) =>
                    setNewMaterial({ ...newMaterial, status: e.target.value })
                  }
                  className="w-full p-2 rounded bg-netflix-dark text-white"
                >
                  <option>In Stock</option>
                  <option>Out of Stock</option>
                </select>
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => setShowModal(false)}
                    className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-500"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddMaterial}
                    className="bg-netflix-red text-white px-4 py-2 rounded hover:bg-red-700"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default Materials;
