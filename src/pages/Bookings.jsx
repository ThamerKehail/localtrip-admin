import { useState, useEffect, useCallback } from 'react';
import { Search, Loader2 } from 'lucide-react';
import Badge from '../components/ui/Badge';
import Pagination from '../components/ui/Pagination';
import EmptyState from '../components/ui/EmptyState';
import { fetchBookings } from '../services/admin.service';
import { useLang } from '../context/LanguageContext';
import { formatSAR, formatDate } from '../utils/format';

const LIMIT = 10;

export default function Bookings() {
  const { t, lang } = useLang();

  const statusTabs = [
    { key: 'all', label: t('all') },
    { key: 'pending', label: t('pending') },
    { key: 'confirmed', label: t('confirmed') },
    { key: 'started', label: t('started') },
    { key: 'completed', label: t('completed') },
    { key: 'declined', label: t('declined') },
    { key: 'cancelled', label: t('cancelled') },
  ];

  const [bookings, setBookings] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const load = useCallback(() => {
    setLoading(true);
    const params = { page, limit: LIMIT };
    if (tab !== 'all') params.status = tab;
    // Server-side search where supported; the client-side filter below
    // remains as a fallback for backends that ignore `search`.
    if (search.trim()) params.search = search.trim();
    fetchBookings(params)
      .then(({ bookings: rows, pagination: pg }) => { setBookings(rows); setPagination(pg); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [page, tab, search]);

  useEffect(() => { load(); }, [load]);

  const q = search.trim().toLowerCase();
  const filtered = q
    ? bookings.filter((b) =>
        b.bookingNumber?.toLowerCase().includes(q) ||
        b.user?.fullName?.toLowerCase().includes(q) ||
        b.tour?.titleEn?.toLowerCase().includes(q)
      )
    : bookings;

  const tableHeaders = ['bookingId', 'user', 'guide', 'tour', 'date', 'guests', 'total', 'status'];

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900">{t('bookingsTitle')}</h2>
        <p className="text-sm text-gray-400 mt-0.5">{t('bookingsDesc')}</p>
      </div>

      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 border-b border-gray-100">
          <div className="flex gap-1 flex-wrap">
            {statusTabs.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => { setTab(key); setPage(1); }}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  tab === key ? 'bg-primary text-white' : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="relative">
            <Search size={15} className="absolute start-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={t('searchBooking')}
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="ps-9 pe-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 w-56 placeholder:text-gray-400"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24"><Loader2 size={24} className="animate-spin text-primary" /></div>
        ) : filtered.length === 0 ? (
          <EmptyState title={t('noBookingsFound')} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {tableHeaders.map((key) => (
                    <th key={key} className="px-4 py-3 text-start text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                      {t(key)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((b) => (
                  <tr key={b.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-gray-600">{b.bookingNumber}</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-800 whitespace-nowrap"><bdi>{b.user?.fullName || '—'}</bdi></td>
                    <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap"><bdi>{b.guide?.user?.fullName || '—'}</bdi></td>
                    <td className="px-4 py-3 text-sm text-gray-600 max-w-40 truncate"><bdi>{b.tour?.titleEn || '—'}</bdi></td>
                    <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">{formatDate(b.date, lang)}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{(b.adultsCount || 0) + (b.childrenCount || 0)}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-gray-800 whitespace-nowrap">{formatSAR(b.totalPrice, lang)}</td>
                    <td className="px-4 py-3"><Badge status={b.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {pagination.total > 0 && (
          <div className="px-4 border-t border-gray-100">
            <Pagination page={pagination.page} pages={pagination.pages} total={pagination.total} limit={LIMIT} onPageChange={setPage} />
          </div>
        )}
      </div>
    </div>
  );
}
