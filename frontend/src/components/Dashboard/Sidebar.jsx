// src/components/Dashboard/Sidebar.jsx
import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

export default function Sidebar({ isOpen, onClose }) {
  const { user } = useAuth();

  return (
    <div
      className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0 transition-transform duration-300 ease-in-out`}
    >
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">TFSS</h2>
          <button
            className="md:hidden p-2 text-gray-600 hover:text-gray-800"
            onClick={onClose}
          >
            X
          </button>
        </div>

        <nav className="mt-6 space-y-1">
          {user.role === 'head' && (
            <>
              <a
                href="#"
                className="block p-2 text-gray-700 hover:bg-gray-100 rounded"
              >
                Overview
              </a>
              <a
                href="#"
                className="block p-2 text-gray-700 hover:bg-gray-100 rounded"
              >
                Financials
              </a>
              <a
                href="#"
                className="block p-2 text-gray-700 hover:bg-gray-100 rounded"
              >
                Reports
              </a>
            </>
          )}

          {user.role === 'service_manager' && (
            <>
              <a
                href="#"
                className="block p-2 text-gray-700 hover:bg-gray-100 rounded"
              >
                Maintenance Queue
              </a>
              <a
                href="#"
                className="block p-2 text-gray-700 hover:bg-gray-100 rounded"
              >
                Adjusters
              </a>
              <a
                href="#"
                className="block p-2 text-gray-700 hover:bg-gray-100 rounded"
              >
                Alerts
              </a>
            </>
          )}

          {user.role === 'adjuster' && (
            <>
              <a
                href="#"
                className="block p-2 text-gray-700 hover:bg-gray-100 rounded"
              >
                My Tasks
              </a>
              <a
                href="#"
                className="block p-2 text-gray-700 hover:bg-gray-100 rounded"
              >
                Performance
              </a>
              <a
                href="#"
                className="block p-2 text-gray-700 hover:bg-gray-100 rounded"
              >
                Messages
              </a>
            </>
          )}
        </nav>
      </div>
    </div>
  );
}
