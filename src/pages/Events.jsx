import { useState, useEffect, useCallback } from 'react';
import { Search, Loader2, Pencil, Trash2, Plus, SlidersHorizontal, RotateCcw, ChevronDown } from 'lucide-react';
import Pagination from '../components/ui/Pagination';
import { fetchEvents, deleteEvent } from '../services/admin.service';
import AddEventModal from '../components/events/AddEventModal';
import EditEventModal from '../components/events/EditEventModal';

const LIMIT = 12;

function StatusBadge({ isActive }) {
  return isActive ? (
    <span className="inline-block px-2 py-0.5 rounded-[3px] text-[12px] font-semibold bg-[#00b69b]/20 text-[#00b69b]">
      Published
    </span>
  ) : (
    <span className="inline-block px-2 py-0.5 rounded-[3px] text-[12px] font-semibold bg-gray-100 text-gray-500">
      Inactive
    </span>
  );
}

function ActionButtons({ onEdit, onDelete }) {
  return (
    <div className="inline-flex items-center bg-[#fafbfd] border border-[#d5d5d5] rounded-[8px] h-[32px] overflow-hidden">
      <button onClick={onEdit} className="flex items-center justify-center w-[46px] h-full hover:bg-gray-100 transition-colors">
        <Pencil size={13} className="text-[#202224] opacity-60" />
      </button>
      <div className="w-px h-full bg-[#d5d5d5]" />
      <button onClick={onDelete} className="flex items-center justify-center w-[46px] h-full hover:bg-red-50 transition-colors group">
        <Trash2 size={13} className="text-[#202224] opacity-60 group-hover:text-red-500" />
      </button>
    </div>
  );
}

function EventRow({ item, onEdit, onDelete }) {
  const dateLabel = item.startDate
    ? new Date(item.startDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    : '—';

  return (
    <div className="bg-white rounded-[20px] flex items-center px-4 py-0 h-[90px] gap-4">
      {/* Image */}
      <div className="w-[60px] h-[60px] rounded-[10px] overflow-hidden flex-shrink-0 bg-gray-100">
        {item.coverPhoto ? (
          <img src={item.coverPhoto} alt={item.titleEn} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">No img</div>
        )}
      </div>

      {/* Name */}
      <div className="w-[220px] shrink-0">
        <p className="text-[16px] font-medium text-[#232323]">Name</p>
        <p className="text-[15px] text-[#4e637f] truncate">{item.titleEn}</p>
      </div>

      {/* Location */}
      <div className="w-[180px] shrink-0">
        <p className="text-[16px] font-medium text-[#232323]">Location</p>
        <p className="text-[15px] text-[#4e637f] truncate">{item.location || '—'}</p>
      </div>

      {/* Date */}
      <div className="flex-1 min-w-0">
        <p className="text-[16px] font-medium text-[#232323]">Date</p>
        <p className="text-[15px] text-[#4e637f]">{dateLabel}</p>
      </div>

      {/* Status */}
      <div className="w-[130px] shrink-0">
        <p className="text-[16px] font-medium text-[#232323]">Status</p>
        <div className="mt-1">
          <StatusBadge isActive={item.isActive} />
        </div>
      </div>

      {/* Action */}
      <div className="shrink-0">
        <ActionButtons onEdit={onEdit} onDelete={onDelete} />
      </div>
    </div>
  );
}

export default function Events() {
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    const params = { page, limit: LIMIT };
    if (search.trim()) params.search = search.trim();
    fetchEvents(params)
      .then(({ events: rows, pagination: pg }) => {
        setItems(rows);
        setPagination(pg);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [page, search]);

  useEffect(() => { load(); }, [load]);

  const handleReset = () => { setSearch(''); setPage(1); };

  const handleDelete = async () => {
    setDeleteLoading(true);
    try { await deleteEvent(deleteId); load(); }
    catch { alert('Failed to delete event. Please try again.'); }
    finally { setDeleteLoading(false); setDeleteId(null); }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <h1 className="text-[32px] font-bold text-[#202224] tracking-[-0.1px]">Events</h1>

      {/* Search */}
      <div className="relative w-[388px]">
        <Search size={14} className="absolute start-3 top-1/2 -translate-y-1/2 text-[#202224] opacity-50" />
        <input
          type="text"
          placeholder="Search for Events"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="w-full ps-9 pe-4 py-2 text-[14px] bg-white border border-[#d5d5d5] rounded-[19px] focus:outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-[#202224]/50"
        />
      </div>

      {/* Filter Bar + Add Button */}
      <div className="flex items-center gap-4">
        <div className="bg-white border border-[#d5d5d5] rounded-[10px] h-[70px] flex items-center divide-x divide-[#d5d5d5] flex-1">
          <div className="px-6 flex items-center shrink-0">
            <SlidersHorizontal size={18} className="text-[#202224]" />
          </div>
          <div className="px-6 shrink-0">
            <span className="text-[14px] font-bold text-[#202224]">Filter By</span>
          </div>
          <div className="px-6 flex items-center gap-2 shrink-0 cursor-pointer">
            <span className="text-[14px] font-bold text-[#202224]">City</span>
            <ChevronDown size={14} className="text-[#202224]" />
          </div>
          <div className="px-6 flex items-center gap-2 shrink-0 cursor-pointer">
            <span className="text-[14px] font-bold text-[#202224]">Date Added</span>
            <ChevronDown size={14} className="text-[#202224]" />
          </div>
          <div className="px-6 flex items-center gap-2 shrink-0 cursor-pointer">
            <span className="text-[14px] font-bold text-[#202224]">Category</span>
            <ChevronDown size={14} className="text-[#202224]" />
          </div>
          <div className="px-6 flex items-center gap-2 shrink-0 cursor-pointer" onClick={handleReset}>
            <RotateCcw size={16} className="text-[#ea0234]" />
            <span className="text-[14px] font-semibold text-[#ea0234]">Reset Filters</span>
          </div>
        </div>

        {/* Add New */}
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-[10px] text-[16px] font-semibold shrink-0 hover:bg-primary/90 transition-colors"
        >
          Add New
          <Plus size={20} />
        </button>
      </div>

      {/* List */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 size={24} className="animate-spin text-primary" />
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-2">
          <p className="text-sm font-medium text-gray-600">No events found</p>
          <p className="text-xs text-gray-400">Add events to see them here</p>
        </div>
      ) : (
        <div className="space-y-6">
          {items.map((item) => (
            <EventRow
              key={item.id}
              item={item}
              onEdit={() => setEditItem(item)}
              onDelete={() => setDeleteId(item.id)}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.total > 0 && (
        <div className="flex items-center justify-between pt-2">
          <p className="text-[14px] font-semibold text-[#202224] opacity-60">
            Showing {Math.min((pagination.page - 1) * LIMIT + 1, pagination.total)}–{Math.min(pagination.page * LIMIT, pagination.total)} of {pagination.total.toLocaleString()}
          </p>
          <Pagination
            page={pagination.page}
            pages={pagination.pages}
            total={pagination.total}
            limit={LIMIT}
            onPageChange={setPage}
          />
        </div>
      )}

      <AddEventModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onAdd={() => { setShowModal(false); load(); }}
      />

      <EditEventModal
        isOpen={!!editItem}
        event={editItem}
        onClose={() => setEditItem(null)}
        onSave={() => { setEditItem(null); load(); }}
      />

      {/* Delete confirm */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setDeleteId(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <Trash2 size={20} className="text-red-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Delete Event</h3>
            <p className="text-sm text-gray-500 mb-6">This event will be deactivated and hidden from the app.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={handleDelete} disabled={deleteLoading} className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-medium hover:bg-red-600 disabled:opacity-60">
                {deleteLoading ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
