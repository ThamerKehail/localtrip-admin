import { NavLink, useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import {
  IconDashboard, IconDestinations, IconBookings, IconTrips,
  IconGuides, IconMessages, IconPayments, IconExplore, IconEatDrink, IconEvents, IconUsers,
  IconCategories, IconCarousel,
} from '../../assets/icons/SidebarIcons';
import { useAuth } from '../../context/AuthContext';
import { useLang } from '../../context/LanguageContext';
import logoIcon from '../../assets/logo-icon.svg';
import logoText from '../../assets/logo-text.svg';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const { t } = useLang();
  const navigate = useNavigate();

  const navMain = [
    { labelKey: 'dashboard', icon: IconDashboard, to: '/' },
    { labelKey: 'destinations', icon: IconDestinations, to: '/destinations' },
    { labelKey: 'bookings', icon: IconBookings, to: '/bookings' },
    { labelKey: 'trips', icon: IconTrips, to: '/trips' },
    { labelKey: 'tourGuides', icon: IconGuides, to: '/guides' },
    { labelKey: 'messages', icon: IconMessages, to: '/messages' },
    { labelKey: 'payments', icon: IconPayments, to: '/payments' },
    { labelKey: 'users', icon: IconUsers, to: '/users' },
  ];

  const navPages = [
    { labelKey: 'exploreScreen', icon: IconExplore, to: '/pages/explore' },
    { labelKey: 'eatDrink', icon: IconEatDrink, to: '/pages/eat-drink' },
    { labelKey: 'events', icon: IconEvents, to: '/pages/events' },
    { labelKey: 'categories', icon: IconCategories, to: '/pages/categories' },
    { labelKey: 'carousel', icon: IconCarousel, to: '/pages/carousel' },
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
      <div className="flex items-center gap-2 px-4 py-4 border-b border-gray-100">
        <img src={logoText} alt="Local Trip" style={{ height: '22px', width: 'auto' }} />
        <img src={logoIcon} alt="Logo" style={{ height: '36px', width: 'auto' }} />
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
