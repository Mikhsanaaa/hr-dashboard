import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

export default function MainLayout() {
  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar />
      <div className="flex-1 p-10 overflow-y-auto">
        <Outlet /> {/* Tempat halaman dirender */}
      </div>
    </div>
  );
}