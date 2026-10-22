import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, CalendarDays, Wallet, LogOut, Globe } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { lang, setLang, t } = useLanguage(); // Panggil fungsi bahasa

  const menuItems = [
    { path: '/', label: t('dashboard'), icon: LayoutDashboard },
    { path: '/employees', label: t('employees'), icon: Users },
    { path: '/leaves', label: t('leaves'), icon: CalendarDays },
    { path: '/compensation', label: t('compensation'), icon: Wallet },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="w-64 bg-neu-base min-h-screen p-6 flex flex-col justify-between border-r border-white/40 shadow-[8px_0_24px_rgba(163,177,198,0.3)]">
      <div>
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-2xl font-black text-blue-600 tracking-tighter">HR System</h1>
          {/* Tombol Ganti Bahasa */}
          <button 
            onClick={() => setLang(lang === 'id' ? 'en' : 'id')}
            className="neumorphic-btn p-2 flex items-center gap-1 text-sm font-bold text-blue-600"
            title="Change Language"
          >
            <Globe size={16} /> {lang.toUpperCase()}
          </button>
        </div>
        
        <ul className="space-y-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${
                    isActive
                      ? 'neumorphic-inset text-blue-600 font-bold'
                      : 'text-gray-500 hover:text-blue-500 hover:neumorphic-btn'
                  }`}
                >
                  <Icon size={20} className={isActive ? 'text-blue-600' : 'text-gray-400'} />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
      
      <button 
        onClick={handleLogout}
        className="flex items-center gap-3 text-red-500 hover:text-red-600 p-3 rounded-xl hover:neumorphic-btn transition-all duration-300 w-full text-left font-semibold"
      >
        <LogOut size={20} />
        {t('logout')}
      </button>
    </div>
  );
}