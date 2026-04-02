import React, { useEffect, useState } from 'react';
import { API_BASE } from './config';

export default function VehicleList({ onRent }) {
  const [vehicles, setVehicles] = useState([]);
  const [filter, setFilter]     = useState('all');
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
 
  useEffect(() => {
    fetch(`${API_BASE}/vehicles/`)
      .then(async (res) => {
        const payload = await res.json();
        if (!res.ok) {
          throw new Error(payload?.message || payload?.error || 'Failed to fetch vehicles.');
        }
        if (!Array.isArray(payload)) {
          throw new Error('Unexpected response from server while loading vehicles.');
        }
        return payload;
      })
      .then((data) => {
        setVehicles(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(`${err.message} Please make sure backend is running on port 4000.`);
        setLoading(false);
      });
  }, []);
 
  const filtered = filter === 'all'
    ? vehicles
    : vehicles.filter(v => v.type === filter);
 
  if (loading) return (
    <div className="flex items-center justify-center py-12">
      <p className="text-lg text-gray-600">Loading vehicles...</p>
    </div>
  );
  
  if (error) return (
    <div className="p-4 text-red-700 border border-red-200 rounded-lg bg-red-50">
      {error}
    </div>
  );
 
  return (
    <div>
      <div className="mb-8">
        <h2 className="mb-4 text-2xl font-bold text-gray-800">Filter Vehicles</h2>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setFilter('all')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              filter === 'all'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            All Vehicles
          </button>
          <button
            onClick={() => setFilter('car')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              filter === 'car'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Cars Only
          </button>
          <button
            onClick={() => setFilter('bike')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              filter === 'bike'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Bikes Only
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map(vehicle => (
          <div
            key={vehicle.id}
            className="p-6 transition-shadow bg-white border border-gray-100 rounded-lg shadow-md hover:shadow-lg"
          >
            <h3 className="mb-3 text-xl font-bold text-gray-900">{vehicle.name}</h3>
            
            <div className="mb-4 space-y-2 text-gray-600">
              <p><span className="font-semibold text-gray-700">Type:</span> <span className="capitalize">{vehicle.type}</span></p>
              <p><span className="font-semibold text-gray-700">Rate:</span> <span className="text-lg font-bold text-green-600">${vehicle.rate_per_hour}/hr</span></p>
              <p>
                <span className="font-semibold text-gray-700">Status:</span>
                <span className={`ml-2 px-3 py-1 rounded-full text-sm font-medium ${
                  vehicle.status === 'available'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {vehicle.status.charAt(0).toUpperCase() + vehicle.status.slice(1)}
                </span>
              </p>
            </div>

            {vehicle.status === 'available' && (
              <button
                onClick={() => onRent(vehicle)}
                className="w-full px-4 py-2 font-semibold text-white transition-colors bg-indigo-600 rounded-lg hover:bg-indigo-700"
              >
                Rent This Vehicle
              </button>
            )}
            {vehicle.status !== 'available' && (
              <button
                disabled
                className="w-full px-4 py-2 font-semibold text-gray-500 bg-gray-200 rounded-lg cursor-not-allowed"
              >
                Not Available
              </button>
            )}
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-lg text-gray-500">No vehicles found for this filter.</p>
        </div>
      )}
    </div>
  );
}
