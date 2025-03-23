// src/components/Dashboard/DashboardViews.jsx
import React, { useState } from 'react';
import { DashboardCard } from './DashboardCard';
import { QueueTable } from './QueueTable';

// Placeholder chart components
function LineChart({ data }) {
  return (
    <div className="bg-gray-100 h-32 flex items-center justify-center">
      <span className="text-gray-500 text-sm">[Line Chart Placeholder]</span>
    </div>
  );
}
function AdjusterList() {
  return (
    <div className="bg-gray-100 h-32 flex items-center justify-center">
      <span className="text-gray-500 text-sm">[Adjuster List Placeholder]</span>
    </div>
  );
}
function AlertFeed() {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Alerts</h3>
      <p className="text-sm text-gray-600">No new alerts.</p>
    </div>
  );
}
function TaskList({ tasks }) {
  return (
    <table className="min-w-full text-sm">
      <thead>
        <tr>
          <th className="py-2 text-left">Machine</th>
          <th className="py-2 text-left">Status</th>
          <th className="py-2 text-left">Time Elapsed</th>
        </tr>
      </thead>
      <tbody>
        {tasks.map((t) => (
          <tr key={t.id} className="border-t">
            <td className="py-2">{t.machine}</td>
            <td className="py-2">{t.status}</td>
            <td className="py-2">{t.timeElapsed}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
function PerformanceChart() {
  return (
    <div className="bg-gray-100 h-32 flex items-center justify-center">
      <span className="text-gray-500 text-sm">[Performance Chart Placeholder]</span>
    </div>
  );
}

// Demo data
const productionData = [
  { x: 1, y: 80 },
  { x: 2, y: 85 },
  { x: 3, y: 83 },
];

export function FactoryHeadView() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <DashboardCard
        title="Overall Productivity"
        value="82%"
        trend="+2.5% from last week"
      />
      <DashboardCard title="Machine Uptime" value="94.5%" trend="Optimal" />
      <DashboardCard
        title="Avg Repair Time"
        value="1.2h"
        trend="Improved by 15min"
      />

      <div className="col-span-full mt-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Production Trend</h3>
          <LineChart data={productionData} />
        </div>
      </div>
    </div>
  );
}

export function ServiceManagerView() {
  const [queue] = useState([
    { id: 1, machine: 'CNC-001', priority: 'High', assignedTo: 'Adjuster 1' },
    { id: 2, machine: 'Lathe-003', priority: 'Medium', assignedTo: null },
  ]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Maintenance Queue</h3>
          <QueueTable data={queue} />
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Adjuster Availability</h3>
          <AdjusterList />
        </div>
      </div>

      <AlertFeed />
    </div>
  );
}

export function AdjusterView() {
  const [tasks] = useState([
    { id: 1, machine: 'CNC-001', status: 'In Progress', timeElapsed: '35m' },
    { id: 2, machine: 'Press-002', status: 'Pending', timeElapsed: '-' },
  ]);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Assigned Tasks</h2>
        <TaskList tasks={tasks} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Today's Performance</h3>
          <PerformanceChart />
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-2">
            <button className="w-full bg-blue-100 text-blue-800 p-2 rounded hover:bg-blue-200">
              Report Issue
            </button>
            <button className="w-full bg-green-100 text-green-800 p-2 rounded hover:bg-green-200">
              Request Parts
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
