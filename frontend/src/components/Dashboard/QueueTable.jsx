// src/components/Dashboard/QueueTable.jsx
import React from 'react';

export function QueueTable({ data }) {
  return (
    <table className="min-w-full text-sm">
      <thead>
        <tr className="border-b">
          <th className="py-2 text-left">Machine</th>
          <th className="py-2 text-left">Priority</th>
          <th className="py-2 text-left">Assigned To</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <tr key={item.id} className="border-b">
            <td className="py-2">{item.machine}</td>
            <td className="py-2">
              <span
                className={`px-2 py-1 rounded ${
                  item.priority === 'High'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}
              >
                {item.priority}
              </span>
            </td>
            <td className="py-2">{item.assignedTo || 'Unassigned'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
