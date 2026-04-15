import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, MapPin, CalendarCheck, Route, Users,
  MessageSquare, CreditCard, Compass, Utensils, CalendarDays, LogOut,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLang } from '../../context/LanguageContext';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const { t } = useLang();
  const navigate = useNavigate();

  const navMain = [
    { labelKey: 'dashboard', icon: LayoutDashboard, to: '/' },
    { labelKey: 'destinations', icon: MapPin, to: '/destinations' },
    { labelKey: 'bookings', icon: CalendarCheck, to: '/bookings' },
    { labelKey: 'trips', icon: Route, to: '/trips' },
    { labelKey: 'tourGuides', icon: Users, to: '/guides' },
    { labelKey: 'messages', icon: MessageSquare, to: '/messages' },
    { labelKey: 'payments', icon: CreditCard, to: '/payments' },
  ];

  const navPages = [
    { labelKey: 'exploreScreen', icon: Compass, to: '/pages/explore' },
    { labelKey: 'eatDrink', icon: Utensils, to: '/pages/eat-drink' },
    { labelKey: 'events', icon: CalendarDays, to: '/pages/events' },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const initials = user?.fullName
    ? user.fullName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : 'A';

  return (
    <aside className="fixed top-0 start-0 h-screen w-60 bg-white shadow-sidebar z-40 flex flex-col">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-6 py-5 border-b border-gray-100">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
          <MapPin size={16} className="text-white" strokeWidth={2} />
        </div>
        <div>
          <span className="text-base font-bold text-gray-900 leading-tight block">Local Trip</span>
          <span className="text-[10px] text-gray-400 uppercase tracking-wide">{t('admin')}</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto scrollbar-thin px-3 py-4 space-y-1">
        {navMain.map(({ labelKey, icon: Icon, to }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800'
              }`
            }
          >
            <Icon size={18} strokeWidth={1.8} />
            <span>{t(labelKey)}</span>
          </NavLink>
        ))}

        <div className="pt-4 pb-1 px-1">
          <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
            {t('pages')}
          </span>
        </div>

        {navPages.map(({ labelKey, icon: Icon, to }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800'
              }`
            }
          >
            <Icon size={18} strokeWidth={1.8} />
            <span>{t(labelKey)}</span>
          </NavLink>
        ))}
      </nav>

      {/* Bottom — user + logout */}
      <div className="px-3 py-4 border-t border-gray-100 space-y-1">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-gray-50">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm flex-shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-800 truncate">{user?.fullName || t('admin')}</p>
            <p className="text-[11px] text-gray-400">{t('admin')}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <LogOut size={16} strokeWidth={1.8} />
          {t('signOut')}
        </button>
      </div>
    </aside>
  );
}
