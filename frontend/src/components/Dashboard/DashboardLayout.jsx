// src/components/Dashboard/DashboardLayout.jsx
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { FactoryHeadView, ServiceManagerView, AdjusterView } from './DashboardViews';
import Sidebar from './Sidebar';
import Header from './Header';

export default function DashboardLayout() {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderRoleView = () => {
    switch (user.role) {
      case 'head':
        return <FactoryHeadView />;
      case 'service_manager':
        return <ServiceManagerView />;
      case 'adjuster':
        return <AdjusterView />;
      default:
        return <div>Unauthorized</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <div className="flex flex-col flex-1 md:pl-64">
        <Header onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">{renderRoleView()}</div>
        </main>
      </div>
    </div>
  );
}
