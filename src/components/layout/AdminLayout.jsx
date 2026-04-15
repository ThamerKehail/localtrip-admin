import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { useLang } from '../../context/LanguageContext';

const pageTitleKeys = {
  '/': 'dashboard',
  '/destinations': 'destinations',
  '/bookings': 'bookings',
  '/trips': 'trips',
  '/guides': 'tourGuides',
  '/messages': 'messages',
  '/payments': 'payments',
  '/pages/explore': 'exploreScreen',
  '/pages/eat-drink': 'eatDrink',
  '/pages/events': 'events',
};

export default function AdminLayout() {
  const { pathname } = useLocation();
  const { t } = useLang();
  const titleKey = pageTitleKeys[pathname] || 'dashboard';

  return (
    <div className="min-h-screen bg-[#F5F6FA]">
      <Sidebar />
      <Topbar title={t(titleKey)} />
      {/* ms-60 = margin-start: works as ml-60 in LTR, mr-60 in RTL */}
      <main className="ms-60 pt-16 min-h-screen">
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
