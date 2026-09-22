import { useState, useEffect, useCallback } from 'react';
import { Search, Loader2, Pencil, Trash2, Star, SlidersHorizontal, RotateCcw, ChevronDown, AlertCircle } from 'lucide-react';
import Pagination from '../components/ui/Pagination';
import Badge from '../components/ui/Badge';
import EditTripModal from '../components/trips/EditTripModal';
import { fetchTrips, fetchCategories, deleteTrip } from '../services/admin.service';
import { useLang } from '../context/LanguageContext';
import { formatSAR } from '../utils/format';
import { getErrorMessage } from '../utils/errors';

const LIMIT = 12;

// `key` is the value sent as ?city= (backend matches iLike %city%). Keys match
// the city names the Guide app writes, so they must stay in English.
const CITIES = [
  { key: 'all', labelKey: 'allTrips' },
  { key: 'Riyadh', labelKey: 'cityRiyadh' },
  { key: 'Jeddah', labelKey: 'cityJeddah' },
  { key: 'Mecca', labelKey: 'cityMecca' },
  { key: 'Medina', labelKey: 'cityMedina' },
  { key: 'Dammam', labelKey: 'cityDammam' },
  { key: 'Khobar', labelKey: 'cityKhobar' },
  { key: 'Abha', labelKey: 'cityAbha' },
  { key: 'Tabuk', labelKey: 'cityTabuk' },
  { key: 'Al Ula', labelKey: 'cityAlUla' },
  { key: 'Hail', labelKey: 'cityHail' },
  { key: 'Yanbu', labelKey: 'cityYanbu' },
  { key: 'Najran', labelKey: 'cityNajran' },
  { key: 'Jizan', labelKey: 'cityJizan' },
  { key: 'Qassim', labelKey: 'cityQassim' },
  { key: 'Taif', labelKey: 'cityTaif' },
];

export default function Trips() {
  const { t, lang } = useLang();
  const [trips, setTrips] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [cityTab, setCityTab] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterCategorySlug, setFilterCategorySlug] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [categories, setCategories] = useState([]);
  const [editId, setEditId] = useState(null);
  const [actionError, setActionError] = useState('');

  useEffect(() => {
    fetchCategories()
      .then((data) => setCategories(data.categories || []))
      .catch(() => setCategories([]));
  }, []);

  const load = useCallback(() => {
    setLoading(true);
    const params = { page, limit: LIMIT };
    if (cityTab !== 'all') params.city = cityTab;
    if (filterCategory !== 'all') {
      // Send both forms: backends differ in which category param they accept.
      params.categoryId = filterCategory;
      if (filterCategorySlug) params.categorySlug = filterCategorySlug;
    }
    if (search.trim()) params.search = search.trim();

    fetchTrips(params)
      .then(({ trips: rows, pagination: pg }) => {
        setTrips(rows);
        setPagination(pg);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [page, cityTab, filterCategory, filterCategorySlug, search]);

  useEffect(() => { load(); }, [load]);

  const handleCityTab = (key) => { setCityTab(key); setPage(1); };

  const handleReset = () => {
    setFilterCategory('all'); setFilterCategorySlug(''); setCityTab('all'); setSearch(''); setPage(1);
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t('confirmDeleteTrip'))) return;
    setActionError('');
    try { await deleteTrip(id); load(); }
    catch (err) { setActionError(getErrorMessage(err, t)); }
  };

  return (
    <>
      <EditTripModal
        isOpen={!!editId}
        tripId={editId}
        onClose={() => setEditId(null)}
        onSave={() => { setEditId(null); load(); }}
      />

      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-[32px] font-bold text-[#202224] tracking-[-0.1px]">{t('trips')}</h1>
          <div className="relative">
            <Search size={15} className="absolute start-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={t('searchTrip')}
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="ps-9 pe-4 py-2 text-sm bg-white border border-[#d5d5d5] rounded-[19px] focus:outline-none focus:ring-2 focus:ring-primary/20 w-64 placeholder:text-[#202224]/50"
            />
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white border border-[#d5d5d5] rounded-[10px] h-[70px] flex items-center divide-x rtl:divide-x-reverse divide-[#d5d5d5]">
          <div className="px-6 flex items-center gap-2 shrink-0">
            <SlidersHorizontal size={18} className="text-[#202224]" />
          </div>
          <div className="px-6 shrink-0">
            <span className="text-[14px] font-bold text-[#202224]">{t('filterBy')}</span>
          </div>
          <div className="px-6 flex items-center gap-2 shrink-0">
            <select
              value={cityTab}
              onChange={(e) => handleCityTab(e.target.value)}
              aria-label={t('city')}
              className="text-[14px] font-bold text-[#202224] bg-transparent border-none outline-none cursor-pointer appearance-none"
            >
              <option value="all">{t('city')}</option>
              {CITIES.filter((c) => c.key !== 'all').map(({ key, labelKey }) => (
                <option key={key} value={key}>{t(labelKey)}</option>
              ))}
            </select>
            <ChevronDown size={16} className="text-[#202224] pointer-events-none" />
          </div>
          <div className="px-6 flex items-center gap-2 shrink-0">
            <select
              value={filterCategory}
              onChange={(e) => {
                const id = e.target.value;
                setFilterCategory(id);
                setFilterCategorySlug(categories.find((c) => String(c.id) === id)?.slug || '');
                setPage(1);
              }}
              aria-label={t('category')}
              className="text-[14px] font-bold text-[#202224] bg-transparent border-none outline-none cursor-pointer appearance-none"
            >
              <option value="all">{t('category')}</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{lang === 'ar' ? (c.titleAr || c.titleEn) : c.titleEn}</option>
              ))}
            </select>
            <ChevronDown size={16} className="text-[#202224] pointer-events-none" />
          </div>
          <button type="button" className="px-6 flex items-center gap-2 shrink-0 cursor-pointer" onClick={handleReset}>
            <RotateCcw size={16} className="text-[#ea0234]" />
            <span className="text-[14px] font-semibold text-[#ea0234]">{t('resetFilters')}</span>
          </button>
        </div>

        {/* City Tabs */}
        <div className="relative">
          <div className="overflow-x-auto scrollbar-none">
            <div className="flex gap-8 whitespace-nowrap pb-[1px]">
              {CITIES.map(({ key, labelKey }) => {
                const isActive = cityTab === key;
                return (
                  <button
                    key={key}
                    onClick={() => handleCityTab(key)}
                    className={`relative pb-2 text-[14px] transition-colors shrink-0 ${
                      isActive ? 'font-bold text-[#101010]' : 'font-semibold text-[#202224] hover:text-primary'
                    }`}
                  >
                    {t(labelKey)}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-primary rounded-t-full" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-px bg-[#d5d5d5]" />
        </div>

        {actionError && (
          <div role="alert" className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">
            <AlertCircle size={16} className="flex-shrink-0" />
            {actionError}
          </div>
        )}

        {/* Table */}
        <div className="bg-white border border-[#b9b9b9]/30 rounded-[14px] overflow-hidden">
          <div className="grid grid-cols-[120px_1fr_120px_180px_90px_130px_110px_110px] bg-white border-b border-[#d5d5d5]">
            {['image', 'tourName', 'city', 'tourGuide', 'booked', 'rating', 'price', 'action'].map((h) => (
              <div key={h} className="px-4 py-3 text-[14px] font-bold text-[#202224]">{t(h)}</div>
            ))}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-24">
              <Loader2 size={24} className="animate-spin text-primary" />
            </div>
          ) : trips.length === 0 ? (
            <div className="flex items-center justify-center py-24">
              <p className="text-sm text-gray-500">{t('noTripsFound')}</p>
            </div>
          ) : (
            <div className="divide-y divide-[#d5d5d5]/40">
              {trips.map((trip) => (
                <TripRow
                  key={trip.id}
                  trip={trip}
                  onEdit={() => setEditId(trip.id)}
                  onDelete={() => handleDelete(trip.id)}
                />
              ))}
            </div>
          )}

          {pagination.total > 0 && (
            <div className="px-4 border-t border-gray-100">
              <Pagination
                page={pagination.page}
                pages={pagination.pages}
                total={pagination.total}
                limit={LIMIT}
                onPageChange={setPage}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function TripRow({ trip, onEdit, onDelete }) {
  const { t, lang } = useLang();
  const guideName = trip.guide?.user?.fullName || '—';
  const rating = trip.rating ? Number(trip.rating).toFixed(1) : '0.0';
  const reviews = trip.totalReviews || 0;
  const bookingCount = trip.dataValues?.bookingCount ?? trip.bookingCount ?? 0;
  const price = formatSAR(trip.priceAdult, lang);

  return (
    <div className="grid grid-cols-[120px_1fr_120px_180px_90px_130px_110px_110px] items-center px-0 py-3">
      {/* Image */}
      <div className="px-4">
        {trip.coverPhoto ? (
          <img src={trip.coverPhoto} alt={trip.titleEn} className="w-[60px] h-[60px] rounded-[8px] object-cover" />
        ) : (
          <div className="w-[60px] h-[60px] rounded-[8px] bg-gray-100 flex items-center justify-center text-gray-400 text-xs">
            {t('noImage')}
          </div>
        )}
      </div>

      {/* Tour Name */}
      <div className="px-4">
        <p className="text-[14px] font-semibold text-[#202224] opacity-90 truncate"><bdi>{trip.titleEn}</bdi></p>
        {trip.status && trip.status !== 'published' && (
          <Badge status={trip.status} />
        )}
      </div>

      {/* City */}
      <div className="px-4">
        <p className="text-[14px] font-semibold text-[#202224] opacity-90"><bdi>{trip.city}</bdi></p>
      </div>

      {/* Tour Guide */}
      <div className="px-4">
        <p className="text-[14px] font-semibold text-[#202224] opacity-90 truncate"><bdi>{guideName}</bdi></p>
      </div>

      {/* Booked */}
      <div className="px-4">
        <p className="text-[14px] font-semibold text-[#202224] opacity-90">{bookingCount}</p>
      </div>

      {/* Rating */}
      <div className="px-4 flex items-center gap-1">
        <Star size={13} className="text-yellow-400 fill-yellow-400 shrink-0" />
        <span className="text-[14px] font-medium text-[#1f1f1f]">{rating}</span>
        <span className="text-[12px] font-medium text-[#4e637f]">({reviews})</span>
      </div>

      {/* Price */}
      <div className="px-4 flex items-center gap-1">
        <span className="text-[14px] font-semibold text-[#202224] opacity-90 whitespace-nowrap">{price}</span>
      </div>

      {/* Action */}
      <div className="px-4">
        <div className="inline-flex items-center bg-[#fafbfd] border border-[#d5d5d5] rounded-[8px] h-[32px] overflow-hidden">
          <button
            onClick={onEdit}
            title={t('edit')}
            aria-label={t('edit')}
            className="flex items-center justify-center w-[46px] h-full hover:bg-gray-100 transition-colors"
          >
            <Pencil size={13} className="text-[#202224] opacity-60" />
          </button>
          <div className="w-px h-full bg-[#d5d5d5]" />
          <button
            onClick={onDelete}
            title={t('delete')}
            aria-label={t('delete')}
            className="flex items-center justify-center w-[46px] h-full hover:bg-red-50 transition-colors"
          >
            <Trash2 size={13} className="text-red-400 opacity-70 hover:opacity-100" />
          </button>
        </div>
      </div>
    </div>
  );
}
