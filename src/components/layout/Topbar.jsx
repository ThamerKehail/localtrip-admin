import { Search, Bell, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLang } from '../../context/LanguageContext';

export default function Topbar({ title }) {
  const { user } = useAuth();
  const { t, toggle } = useLang();

  const name = user?.fullName || t('admin');
  const initials = name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <header className="fixed top-0 start-60 end-0 h-16 bg-white border-b border-gray-100 z-30 flex items-center px-6 gap-4">
      {/* Page title */}
      <h1 className="text-lg font-semibold text-gray-900 me-auto">{title}</h1>

      {/* Search */}
      <div className="relative hidden md:flex items-center">
        <Search size={15} className="absolute start-3 text-gray-400" />
        <input
          type="text"
          placeholder={t('search')}
          className="ps-9 pe-4 py-2 text-sm bg-gray-100 rounded-xl border-0 outline-none focus:ring-2 focus:ring-primary/20 w-52 placeholder:text-gray-400"
        />
      </div>

      {/* Language toggle */}
      <button
        onClick={toggle}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors px-3 py-2 rounded-xl hover:bg-gray-100 font-medium"
      >
        {t('language')}
        <ChevronDown size={13} />
      </button>

      {/* Notifications */}
      <button className="relative p-2 rounded-xl hover:bg-gray-100 transition-colors">
        <Bell size={18} className="text-gray-500" />
        <span className="absolute top-1.5 end-1.5 w-2 h-2 bg-red-500 rounded-full" />
      </button>

      {/* Profile */}
      <button className="flex items-center gap-2.5 ps-2 hover:opacity-80 transition-opacity">
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
          {initials}
        </div>
        <div className="hidden sm:block text-start">
          <p className="text-sm font-medium text-gray-800 leading-tight">{name}</p>
          <p className="text-[11px] text-gray-400">{t('admin')}</p>
        </div>
        <ChevronDown size={14} className="text-gray-400" />
      </button>
    </header>
  );
}
