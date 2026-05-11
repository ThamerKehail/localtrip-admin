import { useState, useEffect, useCallback } from 'react';
import { Search, Loader2, Pencil, Trash2, Star, SlidersHorizontal, RotateCcw, ChevronDown } from 'lucide-react';
import Pagination from '../components/ui/Pagination';
import EditTripModal from '../components/trips/EditTripModal';
import { fetchTrips, fetchCategories, deleteTrip } from '../services/admin.service';

const LIMIT = 12;

const CITIES = [
  { key: 'all', label: 'All Trips' },
  { key: 'Al Riyadh', label: 'Al Riyadh' },
  { key: 'Jeddah', label: 'Jeddah' },
  { key: 'Dammam', label: 'Dammam' },
  { key: 'Khobar', label: 'Khobar' },
  { key: 'Mecca', label: 'Mecca' },
  { key: 'Medina', label: 'Medina' },
  { key: 'Abha', label: 'Abha' },
  { key: 'Tabuk', label: 'Tabuk' },
  { key: 'Najran', label: 'Najran' },
  { key: 'Hail', label: 'Hail' },
  { key: 'Qassim', label: 'Qassim' },
  { key: 'Al Khobar', label: 'Al Khobar' },
  { key: 'Al Jubail', label: 'Al Jubail' },
];

export default function Trips() {
  const [trips, setTrips] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [cityTab, setCityTab] = useState('all');
  const [filterCity, setFilterCity] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [categories, setCategories] = useState([]);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchCategories()
      .then((data) => setCategories(data.categories || []))
      .catch(() => setCategories([]));
  }, []);

  const load = useCallback(() => {
    setLoading(true);
    const params = { page, limit: LIMIT };
    const activeCity = filterCity !== 'all' ? filterCity : cityTab !== 'all' ? cityTab : undefined;
    if (activeCity) params.city = activeCity;
    if (filterCategory !== 'all') params.categorySlug = filterCategory;
    if (search.trim()) params.search = search.trim();

    fetchTrips(params)
      .then(({ trips: rows, pagination: pg }) => {
        setTrips(rows);
        setPagination(pg);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [page, cityTab, filterCity, filterCategory, search]);

  useEffect(() => { load(); }, [load]);

  const handleCityTab = (key) => { setCityTab(key); setFilterCity('all'); setPage(1); };

  const handleReset = () => {
    setFilterCity('all'); setFilterCategory('all'); setCityTab('all'); setSearch(''); setPage(1);
  };

  const handleDelete = async (id) => {
    if (!confirm('Remove this trip? It will be set to inactive.')) return;
    try { await deleteTrip(id); load(); }
    catch { alert('Failed to delete trip.'); }
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
          <h1 className="text-[32px] font-bold text-[#202224] tracking-[-0.1px]">Trips</h1>
          <div className="relative">
            <Search size={15} className="absolute start-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search for a Trip"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="ps-9 pe-4 py-2 text-sm bg-white border border-[#d5d5d5] rounded-[19px] focus:outline-none focus:ring-2 focus:ring-primary/20 w-64 placeholder:text-[#202224]/50"
            />
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white border border-[#d5d5d5] rounded-[10px] h-[70px] flex items-center divide-x divide-[#d5d5d5]">
          <div className="px-6 flex items-center gap-2 shrink-0">
            <SlidersHorizontal size={18} className="text-[#202224]" />
          </div>
          <div className="px-6 shrink-0">
            <span className="text-[14px] font-bold text-[#202224]">Filter By</span>
          </div>
          <div className="px-6 flex items-center gap-2 shrink-0 cursor-pointer">
            <span className="text-[14px] font-bold text-[#202224]">City</span>
            <ChevronDown size={16} className="text-[#202224]" />
          </div>
          <div className="px-6 flex items-center gap-2 shrink-0 cursor-pointer">
            <span className="text-[14px] font-bold text-[#202224]">Date Added</span>
            <ChevronDown size={16} className="text-[#202224]" />
          </div>
          <div className="px-6 shrink-0">
            <select
              value={filterCategory}
              onChange={(e) => { setFilterCategory(e.target.value); setPage(1); }}
              className="text-[14px] font-bold text-[#202224] bg-transparent border-none outline-none cursor-pointer appearance-none pr-5"
            >
              <option value="all">Category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.slug}>{c.titleEn}</option>
              ))}
            </select>
          </div>
          <div className="px-6 flex items-center gap-2 shrink-0 cursor-pointer" onClick={handleReset}>
            <RotateCcw size={16} className="text-[#ea0234]" />
            <span className="text-[14px] font-semibold text-[#ea0234]">Reset Filters</span>
          </div>
        </div>

        {/* City Tabs */}
        <div className="relative">
          <div className="overflow-x-auto scrollbar-none">
            <div className="flex gap-8 whitespace-nowrap pb-[1px]">
              {CITIES.map(({ key, label }) => {
                const isActive = cityTab === key;
                return (
                  <button
                    key={key}
                    onClick={() => handleCityTab(key)}
                    className={`relative pb-2 text-[14px] transition-colors shrink-0 ${
                      isActive ? 'font-bold text-[#101010]' : 'font-semibold text-[#202224] hover:text-primary'
                    }`}
                  >
                    {label}
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

        {/* Table */}
        <div className="bg-white border border-[#b9b9b9]/30 rounded-[14px] overflow-hidden">
          <div className="grid grid-cols-[120px_1fr_120px_180px_90px_130px_110px_110px] bg-white border-b border-[#d5d5d5]">
            {['Image', 'Tour Name', 'City', 'Tour Guide', 'Booked', 'Rating', 'Price', 'Action'].map((h) => (
              <div key={h} className="px-4 py-3 text-[14px] font-bold text-[#202224]">{h}</div>
            ))}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-24">
              <Loader2 size={24} className="animate-spin text-primary" />
            </div>
          ) : trips.length === 0 ? (
            <div className="flex items-center justify-center py-24">
              <p className="text-sm text-gray-500">No trips found</p>
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
  const guideName = trip.guide?.user?.fullName || '—';
  const rating = trip.rating ? Number(trip.rating).toFixed(1) : '0.0';
  const reviews = trip.totalReviews || 0;
  const bookingCount = trip.dataValues?.bookingCount ?? trip.bookingCount ?? 0;
  const price = Number(trip.priceAdult).toLocaleString();

  return (
    <div className="grid grid-cols-[120px_1fr_120px_180px_90px_130px_110px_110px] items-center px-0 py-3">
      {/* Image */}
      <div className="px-4">
        {trip.coverPhoto ? (
          <img src={trip.coverPhoto} alt={trip.titleEn} className="w-[60px] h-[60px] rounded-[8px] object-cover" />
        ) : (
          <div className="w-[60px] h-[60px] rounded-[8px] bg-gray-100 flex items-center justify-center text-gray-400 text-xs">
            No img
          </div>
        )}
      </div>

      {/* Tour Name */}
      <div className="px-4">
        <p className="text-[14px] font-semibold text-[#202224] opacity-90 truncate">{trip.titleEn}</p>
        {trip.status && trip.status !== 'published' && (
          <span className="text-[11px] text-gray-400 capitalize">{trip.status}</span>
        )}
      </div>

      {/* City */}
      <div className="px-4">
        <p className="text-[14px] font-semibold text-[#202224] opacity-90">{trip.city}</p>
      </div>

      {/* Tour Guide */}
      <div className="px-4">
        <p className="text-[14px] font-semibold text-[#202224] opacity-90 truncate">{guideName}</p>
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
        <span className="text-[14px] font-semibold text-[#202224] opacity-90">SAR</span>
        <span className="text-[14px] font-semibold text-[#202224] opacity-90">{price}</span>
      </div>

      {/* Action */}
      <div className="px-4">
        <div className="inline-flex items-center bg-[#fafbfd] border border-[#d5d5d5] rounded-[8px] h-[32px] overflow-hidden">
          <button
            onClick={onEdit}
            className="flex items-center justify-center w-[46px] h-full hover:bg-gray-100 transition-colors"
          >
            <Pencil size={13} className="text-[#202224] opacity-60" />
          </button>
          <div className="w-px h-full bg-[#d5d5d5]" />
          <button
            onClick={onDelete}
            className="flex items-center justify-center w-[46px] h-full hover:bg-red-50 transition-colors"
          >
            <Trash2 size={13} className="text-red-400 opacity-70 hover:opacity-100" />
          </button>
        </div>
      </div>
    </div>
  );
}
