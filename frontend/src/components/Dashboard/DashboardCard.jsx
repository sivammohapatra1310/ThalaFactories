// src/components/Dashboard/DashboardCard.jsx
import React from 'react';

export function DashboardCard({ title, value, trend }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
      <p className="mt-2 text-3xl font-semibold text-gray-900">{value}</p>
      <div className="mt-2 text-sm text-green-600">{trend}</div>
    </div>
  );
}
