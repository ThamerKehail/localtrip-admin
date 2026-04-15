import { useState, useEffect, useCallback } from 'react';
import { Search, Eye, CheckCircle, XCircle, RotateCcw, Star, MapPin, Calendar, Loader2 } from 'lucide-react';
import Badge from '../components/ui/Badge';
import Pagination from '../components/ui/Pagination';
import EmptyState from '../components/ui/EmptyState';
import GuideDetailModal from '../components/guides/GuideDetailModal';
import { fetchGuides, updateGuideStatus } from '../services/admin.service';
import { useLang } from '../context/LanguageContext';

const LIMIT = 10;
const initials = (name = '') => name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();

export default function Guides() {
  const { t } = useLang();
  const statusTabs = [
    { key: 'all', label: t('all') },
    { key: 'pending', label: t('pending') },
    { key: 'active', label: t('active') },
    { key: 'rejected', label: t('rejected') },
  ];

  const [guides, setGuides] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    const params = { page, limit: LIMIT };
    if (tab !== 'all') params.status = tab;
    if (search) params.search = search;
    fetchGuides(params)
      .then(({ guides: rows, pagination: pg }) => { setGuides(rows); setPagination(pg); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [page, tab, search]);

  useEffect(() => { load(); }, [load]);

  const handleStatus = async (id, status) => {
    setActionLoading(true);
    try { await updateGuideStatus(id, status); setSelectedGuide(null); load(); }
    catch { alert(t('failedToLoad')); }
    finally { setActionLoading(false); }
  };

  const tableHeaders = ['name', 'city', 'specializations', 'experience', 'rating', 'license', 'status', 'action'];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">{t('guideApproval')}</h2>
          <p className="text-sm text-gray-400 mt-0.5">{t('guideApprovalDesc')}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 border-b border-gray-100">
          <div className="flex gap-1">
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
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search size={15} className="absolute start-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder={t('searchGuide')}
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="ps-9 pe-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 w-52 placeholder:text-gray-400"
              />
            </div>
            {search && (
              <button onClick={() => setSearch('')} className="p-2 rounded-xl hover:bg-gray-100 text-gray-400">
                <RotateCcw size={14} />
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24"><Loader2 size={24} className="animate-spin text-primary" /></div>
        ) : guides.length === 0 ? (
          <EmptyState title={t('noGuides')} description={t('noGuidesDesc')} />
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
                {guides.map((guide) => (
                  <tr key={guide.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-primary/10 text-primary font-semibold text-sm flex items-center justify-center flex-shrink-0">
                          {initials(guide.user?.fullName)}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-800">{guide.user?.fullName}</p>
                          <p className="text-xs text-gray-400">{guide.user?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <MapPin size={12} />{guide.operatingCity || '—'}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1 max-w-40">
                        {(guide.specializations || []).slice(0, 2).map((s) => (
                          <span key={s} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">{s}</span>
                        ))}
                        {(guide.specializations || []).length > 2 && (
                          <span className="px-2 py-0.5 bg-gray-100 text-gray-400 rounded-full text-xs">+{guide.specializations.length - 2}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-gray-700">{guide.experienceYears || 0} {t('yrs')}</span>
                    </td>
                    <td className="px-4 py-3">
                      {guide.rating > 0 ? (
                        <div className="flex items-center gap-1">
                          <Star size={13} className="text-yellow-400 fill-yellow-400" />
                          <span className="text-sm font-medium text-gray-700">{Number(guide.rating).toFixed(1)}</span>
                        </div>
                      ) : <span className="text-xs text-gray-400">{t('noReviews')}</span>}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Calendar size={11} />{guide.licenseExpiry || '—'}
                      </div>
                    </td>
                    <td className="px-4 py-3"><Badge status={guide.status} /></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button onClick={() => setSelectedGuide(guide)} className="p-1.5 rounded-lg hover:bg-primary/10 text-primary transition-colors">
                          <Eye size={14} />
                        </button>
                        {guide.status === 'pending' && (
                          <>
                            <button onClick={() => handleStatus(guide.id, 'active')} className="p-1.5 rounded-lg hover:bg-green-50 text-green-600 transition-colors">
                              <CheckCircle size={14} />
                            </button>
                            <button onClick={() => handleStatus(guide.id, 'rejected')} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors">
                              <XCircle size={14} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
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

      {selectedGuide && (
        <GuideDetailModal
          guide={{ ...selectedGuide, name: selectedGuide.user?.fullName, email: selectedGuide.user?.email, phone: selectedGuide.user?.phone, city: selectedGuide.operatingCity }}
          onClose={() => setSelectedGuide(null)}
          onApprove={() => handleStatus(selectedGuide.id, 'active')}
          onReject={() => handleStatus(selectedGuide.id, 'rejected')}
          loading={actionLoading}
        />
      )}
    </div>
  );
}
