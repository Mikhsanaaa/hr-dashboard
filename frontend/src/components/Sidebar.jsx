import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react'; // Kita akan install icon library ini

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { path: '/', label: 'Dashboard' },
    { path: '/employees', label: 'Data Karyawan' },
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
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`block p-3 rounded-lg transition ${
                  location.pathname === item.path
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-slate-800'
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      
      {/* Tombol Logout */}
      <button 
        onClick={handleLogout}
        className="flex items-center gap-2 text-gray-400 hover:text-white hover:bg-slate-800 p-3 rounded-lg transition w-full text-left"
      >
        <LogOut size={18} />
      </button>
    </div>
  );
}