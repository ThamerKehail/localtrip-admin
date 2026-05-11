import { useState, useEffect, useCallback } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { fetchCategories, deleteCategory } from '../services/admin.service';
import CategoryModal from '../components/categories/CategoryModal';

function StatusBadge({ isActive }) {
  return isActive ? (
    <span className="inline-block px-2 py-0.5 rounded-[3px] text-[12px] font-semibold bg-[#00b69b]/20 text-[#00b69b]">
      Active
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

function CategoryRow({ item, onEdit, onDelete }) {
  return (
    <div className="bg-white rounded-[20px] flex items-center px-4 h-[80px] gap-4">
      {/* Image */}
      <div className="w-[52px] h-[52px] rounded-[10px] overflow-hidden flex-shrink-0 bg-gray-100">
        {item.imageUrl ? (
          <img src={item.imageUrl} alt={item.titleEn} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">No img</div>
        )}
      </div>

      {/* Titles */}
      <div className="flex-1 min-w-0">
        <p className="text-[14px] font-semibold text-[#202224] truncate">{item.titleEn}</p>
        <p className="text-[12px] text-gray-400 truncate" dir="rtl">{item.titleAr}</p>
      </div>

      {/* Slug */}
      <div className="w-[130px] flex-shrink-0">
        <code className="text-[12px] bg-gray-100 text-gray-600 px-2 py-1 rounded-lg">
          {item.slug}
        </code>
      </div>

      {/* Tour count */}
      <div className="w-[80px] flex-shrink-0 text-center">
        <span className="text-[13px] font-semibold text-[#202224]">{item.tourCount ?? 0}</span>
        <p className="text-[11px] text-gray-400">tours</p>
      </div>

      {/* Order */}
      <span className="text-[13px] text-gray-500 w-10 text-center flex-shrink-0">#{item.order}</span>

      {/* Status */}
      <div className="flex-shrink-0">
        <StatusBadge isActive={item.isActive} />
      </div>

      {/* Actions */}
      <div className="flex-shrink-0">
        <ActionButtons onEdit={() => onEdit(item)} onDelete={() => onDelete(item)} />
      </div>
    </div>
  );
}

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchCategories();
      setCategories(data.categories || []);
    } catch {
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleEdit = (item) => { setEditing(item); setModalOpen(true); };

  const handleDelete = async (item) => {
    if (!window.confirm(`Delete "${item.titleEn}"? Tours in this category will become uncategorised.`)) return;
    try {
      await deleteCategory(item.id);
      load();
    } catch {
      alert('Failed to delete category.');
    }
  };

  const handleSave = () => { setModalOpen(false); setEditing(null); load(); };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[24px] font-bold text-[#202224]">Trip Categories</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Categories created here appear as filter chips in the app. Each tour is linked to one category.
          </p>
        </div>
        <button
          onClick={() => { setEditing(null); setModalOpen(true); }}
          className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <Plus size={16} />
          Add Category
        </button>
      </div>

      {/* Column headers */}
      <div className="grid grid-cols-[52px_1fr_130px_80px_60px_80px_100px] gap-4 px-4 text-[12px] font-semibold text-[#b5b7c0] uppercase tracking-wide">
        <span>Image</span>
        <span>Name</span>
        <span>Slug</span>
        <span className="text-center">Tours</span>
        <span className="text-center">Order</span>
        <span>Status</span>
        <span className="text-center">Actions</span>
      </div>

      {/* Rows */}
      {loading ? (
        <div className="flex justify-center py-16 text-gray-400 text-sm">Loading…</div>
      ) : categories.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-gray-400">
          <p className="text-sm">No categories yet.</p>
          <button
            onClick={() => { setEditing(null); setModalOpen(true); }}
            className="mt-3 text-sm text-primary hover:underline"
          >
            Add your first category
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {categories.map((cat) => (
            <CategoryRow key={cat.id} item={cat} onEdit={handleEdit} onDelete={handleDelete} />
          ))}
        </div>
      )}

      <CategoryModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditing(null); }}
        onSave={handleSave}
        editing={editing}
      />
    </div>
  );
}
