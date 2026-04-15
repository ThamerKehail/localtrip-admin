import { useState, useEffect } from 'react';
import { Users, MapPin, CalendarCheck, CreditCard, Star, Loader2, RefreshCw } from 'lucide-react';
import { fetchStats } from '../services/admin.service';
import { useLang } from '../context/LanguageContext';

const statusClass = {
  confirmed: 'bg-green-100 text-green-700',
  pending: 'bg-yellow-100 text-yellow-700',
  completed: 'bg-purple-100 text-purple-700',
  cancelled: 'bg-red-100 text-red-600',
};

// Empty-state defaults — used when DB has no data yet
const EMPTY_STATS = {
  totalBookings: 0,
  activeGuides: 0,
  pendingGuides: 0,
  totalDestinations: 0,
  totalRevenue: 0,
  avgRating: '0.0',
};

export default function Dashboard() {
  const { t } = useLang();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  const load = () => {
    setLoading(true);
    setErr('');
    fetchStats()
      .then(setData)
      .catch((e) => {
        console.error('Dashboard error:', e);
        setErr(e?.response?.data?.message || e.message || t('failedToLoad'));
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-40">
        <Loader2 size={28} className="animate-spin text-primary" />
      </div>
    );
  }

  if (err) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-4">
        <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center">
          <span className="text-2xl">⚠️</span>
        </div>
        <p className="text-sm font-medium text-gray-700">{err}</p>
        <button
          onClick={load}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-600 transition-colors"
        >
          <RefreshCw size={14} />
          Retry
        </button>
      </div>
    );
  }

  const stats = data?.stats ?? EMPTY_STATS;
  const recentBookings = data?.recentBookings ?? [];

  const statCards = [
    { labelKey: 'totalBookings', value: Number(stats.totalBookings).toLocaleString(), icon: CalendarCheck, color: 'bg-blue-500' },
    { labelKey: 'activeGuides', value: stats.activeGuides, icon: Users, color: 'bg-green-500' },
    { labelKey: 'pendingGuides', value: stats.pendingGuides, icon: Users, color: 'bg-yellow-500' },
    { labelKey: 'totalDestinations', value: stats.totalDestinations, icon: MapPin, color: 'bg-purple-500' },
    { labelKey: 'revenue', value: `${Number(stats.totalRevenue).toLocaleString()}`, icon: CreditCard, color: 'bg-amber-500' },
    { labelKey: 'avgRating', value: stats.avgRating, icon: Star, color: 'bg-yellow-400' },
  ];

  return (
    <div className="space-y-6">
      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statCards.map((stat) => (
          <div key={stat.labelKey} className="bg-white rounded-2xl shadow-card p-4">
            <div className={`w-9 h-9 rounded-xl ${stat.color} flex items-center justify-center mb-3`}>
              <stat.icon size={18} className="text-white" />
            </div>
            <p className="text-xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{t(stat.labelKey)}</p>
          </div>
        ))}
      </div>

      {/* Recent bookings */}
      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-800">{t('recentBookings')}</h3>
          <a href="/bookings" className="text-xs text-primary hover:underline font-medium">{t('viewAll')}</a>
        </div>

        {recentBookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center mb-3">
              <CalendarCheck size={20} className="text-gray-400" />
            </div>
            <p className="text-sm font-medium text-gray-600">{t('noBookings')}</p>
            <p className="text-xs text-gray-400 mt-1">Bookings will appear here once users start booking tours</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {['bookingId', 'user', 'tour', 'date', 'total', 'status'].map((key) => (
                    <th key={key} className="px-4 py-3 text-start text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                      {t(key)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-gray-600">{b.bookingNumber}</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-800">{b.user?.fullName || '—'}</td>
                    <td className="px-4 py-3 text-sm text-gray-500 max-w-48 truncate">{b.tour?.titleEn || '—'}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{b.date}</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-800">{b.totalPrice} SAR</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${statusClass[b.status] || 'bg-gray-100 text-gray-500'}`}>
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
