import { useState, useEffect, useCallback } from 'react';
import { Search, Plus, Pencil, Trash2, ChevronDown, RotateCcw, Loader2 } from 'lucide-react';
import Badge from '../components/ui/Badge';
import Pagination from '../components/ui/Pagination';
import EmptyState from '../components/ui/EmptyState';
import AddDestinationModal from '../components/destinations/AddDestinationModal';
import { fetchDestinations, deleteDestination as apiDelete, updateDestination as apiUpdate } from '../services/admin.service';
import { useLang } from '../context/LanguageContext';

const CATEGORIES_EN = ['All Categories', 'Heritage', 'Coastal', 'Adventure', 'Nature', 'Desert', 'Culture', 'City', 'Food'];
const CATEGORIES_AR = ['جميع التصنيفات', 'تراث', 'ساحلي', 'مغامرة', 'طبيعة', 'صحراء', 'ثقافة', 'مدينة', 'طعام'];
const LIMIT = 12;

export default function Destinations() {
  const { t, lang } = useLang();
  const categories = lang === 'ar' ? CATEGORIES_AR : CATEGORIES_EN;

  const [destinations, setDestinations] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState(categories[0]);
  const [page, setPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    const params = { page, limit: LIMIT };
    if (search) params.search = search;
    if (filterCategory !== categories[0]) params.category = CATEGORIES_EN[CATEGORIES_AR.indexOf(filterCategory)] || filterCategory;

    fetchDestinations(params)
      .then(({ destinations: rows, pagination: pg }) => { setDestinations(rows); setPagination(pg); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [page, search, filterCategory]);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (id) => {
    setDeleteLoading(true);
    try { await apiDelete(id); load(); }
    catch { alert(t('failedToLoad')); }
    finally { setDeleteLoading(false); setDeleteId(null); }
  };

  const togglePublish = async (dest) => {
    try { await apiUpdate(dest.id, { isFeatured: !dest.isFeatured }); load(); }
    catch { alert(t('failedToLoad')); }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">{t('destinationsTitle')}</h2>
          <p className="text-sm text-gray-400 mt-0.5">{t('destinationsDesc')}</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-600 transition-colors shadow-sm"
        >
          <Plus size={16} />
          {t('addNew')}
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 p-4 border-b border-gray-100">
          <div className="relative flex-1 min-w-48">
            <Search size={15} className="absolute start-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={t('searchCity')}
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full ps-9 pe-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-gray-400"
            />
          </div>
          <div className="relative">
            <select
              value={filterCategory}
              onChange={(e) => { setFilterCategory(e.target.value); setPage(1); }}
              className="appearance-none ps-3 pe-8 py-2 text-sm bg-white border border-gray-200 rounded-xl text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
            >
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <ChevronDown size={13} className="absolute end-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
          <button
            onClick={() => { setSearch(''); setFilterCategory(categories[0]); setPage(1); }}
            className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-500 hover:text-gray-800 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <RotateCcw size={13} />
            {t('reset')}
          </button>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex items-center justify-center py-24"><Loader2 size={24} className="animate-spin text-primary" /></div>
        ) : destinations.length === 0 ? (
          <EmptyState title={t('noDestinations')} description={t('noDestinationsDesc')} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {['image', 'city', 'category', 'status', 'featured', 'action'].map((key) => (
                    <th key={key} className="px-4 py-3 text-start text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                      {t(key)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {destinations.map((dest) => (
                  <tr key={dest.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-4 py-3">
                      {dest.coverPhoto
                        ? <img src={dest.coverPhoto} alt={dest.city} className="w-14 h-10 object-cover rounded-lg bg-gray-100" />
                        : <div className="w-14 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-300 text-xs">—</div>
                      }
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm font-semibold text-gray-800">{dest.city}</p>
                      <p className="text-xs text-gray-400">{dest.nameEn}</p>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">{dest.category || '—'}</td>
                    <td className="px-4 py-3"><Badge status={dest.isActive ? 'active' : 'inactive'} /></td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => togglePublish(dest)}
                        className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                          dest.isFeatured ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                        }`}
                      >
                        {dest.isFeatured ? t('featured') : t('draft')}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1.5 rounded-lg hover:bg-primary/10 text-primary transition-colors" title={t('action')}>
                          <Pencil size={14} />
                        </button>
                        <button className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors" onClick={() => setDeleteId(dest.id)}>
                          <Trash2 size={14} />
                        </button>
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

      <AddDestinationModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} onAdd={() => { setShowAddModal(false); load(); }} />

      {/* Delete confirm */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setDeleteId(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <Trash2 size={20} className="text-red-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">{t('deleteDestination')}</h3>
            <p className="text-sm text-gray-500 mb-6">{t('deleteDestinationDesc')}</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50">
                {t('cancel')}
              </button>
              <button onClick={() => handleDelete(deleteId)} disabled={deleteLoading} className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-medium hover:bg-red-600 disabled:opacity-60">
                {deleteLoading ? t('deleting') : t('delete')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
