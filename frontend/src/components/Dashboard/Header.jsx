// src/components/Dashboard/Header.jsx
import React from 'react';

export default function Header({ onMenuClick }) {
  return (
    <header className="bg-white shadow-md p-4 md:ml-0 flex items-center justify-between">
      <button
        className="md:hidden p-2 text-gray-600 hover:text-gray-800"
        onClick={onMenuClick}
      >
        ☰
      </button>
      <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>
      <div>
        {/* Place for user profile icon or logout button */}
        <button className="text-sm text-blue-600 hover:underline">Logout</button>
      </div>
    </header>
  );
}
