import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, CalendarDays, LogOut } from 'lucide-react';

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  // 1. Tambahkan properti `icon` di sini
  const menuItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/employees', label: 'Data Karyawan', icon: Users },
    { path: '/leaves', label: 'Manajemen Cuti', icon: CalendarDays },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="w-64 bg-slate-900 text-white min-h-screen p-5 flex flex-col justify-between">
      <div>
        <h1 className="text-2xl font-bold mb-10 text-blue-400">HR System</h1>
        <ul className="space-y-2">
          {/* 2. Render ikonnya di sini */}
          {menuItems.map((item) => {
            const Icon = item.icon; // Panggil komponen ikonnya
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 p-3 rounded-lg transition ${
                    location.pathname === item.path
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-slate-800'
                  }`}
                >
                  <Icon size={20} /> {/* Tampilkan ikonnya */}
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
      
      {/* Tombol Logout */}
      <button 
        onClick={handleLogout}
        className="flex items-center gap-3 text-gray-400 hover:text-white hover:bg-slate-800 p-3 rounded-lg transition w-full text-left"
      >
        <LogOut size={20} />
        Logout
      </button>
    </div>
  );
}