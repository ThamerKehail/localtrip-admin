import { useState, useEffect, useCallback } from 'react';
import { Search, Loader2, SlidersHorizontal, RotateCcw, ChevronDown } from 'lucide-react';
import Pagination from '../components/ui/Pagination';
import { fetchUsers } from '../services/admin.service';

const LIMIT = 10;

function Avatar({ user }) {
  if (user.avatar) {
    return <img src={user.avatar} alt={user.fullName} className="w-[44px] h-[44px] rounded-full object-cover" />;
  }
  const initials = user.fullName
    ? user.fullName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : '?';
  return (
    <div className="w-[44px] h-[44px] rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm flex-shrink-0">
      {initials}
    </div>
  );
}

function StatusBadge({ isActive }) {
  return isActive ? (
    <span className="inline-block px-2 py-0.5 rounded-[3px] text-[12px] font-semibold bg-[#00b69b]/20 text-[#00b69b]">
      Active
    </span>
  ) : (
    <span className="inline-block px-2 py-0.5 rounded-[3px] text-[12px] font-semibold bg-red-100 text-red-500">
      Inactive
    </span>
  );
}

function UserRow({ user }) {
  const joined = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    : '—';

  return (
    <div className="bg-white rounded-[20px] flex items-center px-4 h-[80px] gap-4">
      {/* Avatar */}
      <div className="flex-shrink-0">
        <Avatar user={user} />
      </div>

      {/* Name + Email */}
      <div className="w-[220px] shrink-0">
        <p className="text-[15px] font-semibold text-[#232323] truncate">{user.fullName}</p>
        <p className="text-[13px] text-[#4e637f] truncate">{user.email}</p>
      </div>

      {/* Phone */}
      <div className="w-[160px] shrink-0">
        <p className="text-[16px] font-medium text-[#232323]">Phone</p>
        <p className="text-[13px] text-[#4e637f]">{user.phone || '—'}</p>
      </div>

      {/* Joined */}
      <div className="w-[160px] shrink-0">
        <p className="text-[16px] font-medium text-[#232323]">Joined</p>
        <p className="text-[13px] text-[#4e637f]">{joined}</p>
      </div>

      {/* Points */}
      <div className="w-[100px] shrink-0">
        <p className="text-[16px] font-medium text-[#232323]">Points</p>
        <p className="text-[13px] text-[#4e637f]">{user.points ?? 0}</p>
      </div>

      {/* Status */}
      <div className="flex-1">
        <p className="text-[16px] font-medium text-[#232323]">Status</p>
        <div className="mt-0.5">
          <StatusBadge isActive={user.isActive} />
        </div>
      </div>
    </div>
  );
}

export default function Users() {
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const load = useCallback(() => {
    setLoading(true);
    const params = { page, limit: LIMIT };
    if (search.trim()) params.search = search.trim();
    fetchUsers(params)
      .then(({ users: rows, pagination: pg }) => {
        setItems(rows);
        setPagination(pg);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [page, search]);

  useEffect(() => { load(); }, [load]);

  const handleReset = () => { setSearch(''); setPage(1); };

  return (
    <div className="space-y-5">
      {/* Header */}
      <h1 className="text-[32px] font-bold text-[#202224] tracking-[-0.1px]">Users</h1>

      {/* Search */}
      <div className="relative w-[388px]">
        <Search size={14} className="absolute start-3 top-1/2 -translate-y-1/2 text-[#202224] opacity-50" />
        <input
          type="text"
          placeholder="Search by name"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="w-full ps-9 pe-4 py-2 text-[14px] bg-white border border-[#d5d5d5] rounded-[19px] focus:outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-[#202224]/50"
        />
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-[#d5d5d5] rounded-[10px] h-[70px] flex items-center divide-x divide-[#d5d5d5]">
        <div className="px-6 flex items-center shrink-0">
          <SlidersHorizontal size={18} className="text-[#202224]" />
        </div>
        <div className="px-6 shrink-0">
          <span className="text-[14px] font-bold text-[#202224]">Filter By</span>
        </div>
        <div className="px-6 flex items-center gap-2 shrink-0 cursor-pointer">
          <span className="text-[14px] font-bold text-[#202224]">Date Joined</span>
          <ChevronDown size={14} className="text-[#202224]" />
        </div>
        <div className="px-6 flex items-center gap-2 shrink-0 cursor-pointer">
          <span className="text-[14px] font-bold text-[#202224]">Status</span>
          <ChevronDown size={14} className="text-[#202224]" />
        </div>
        <div className="px-6 flex items-center gap-2 shrink-0 cursor-pointer" onClick={handleReset}>
          <RotateCcw size={16} className="text-[#ea0234]" />
          <span className="text-[14px] font-semibold text-[#ea0234]">Reset Filters</span>
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 size={24} className="animate-spin text-primary" />
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-2">
          <p className="text-sm font-medium text-gray-600">No users found</p>
          <p className="text-xs text-gray-400">Users will appear here once they register</p>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((user) => (
            <UserRow key={user.id} user={user} />
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
    </div>
  );
}
