import { useState, useEffect, useCallback } from 'react';
import { Plus, Pencil, Trash2, ImageIcon } from 'lucide-react';
import { fetchCarousel, createCarouselItem, updateCarouselItem, deleteCarouselItem, uploadImage } from '../services/admin.service';

function StatusBadge({ isActive }) {
  return isActive ? (
    <span className="inline-block px-2 py-0.5 rounded-[3px] text-[12px] font-semibold bg-[#00b69b]/20 text-[#00b69b]">Active</span>
  ) : (
    <span className="inline-block px-2 py-0.5 rounded-[3px] text-[12px] font-semibold bg-gray-100 text-gray-500">Inactive</span>
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

function CarouselRow({ item, onEdit, onDelete }) {
  return (
    <div className="bg-white rounded-[20px] flex items-center px-4 h-[88px] gap-4">
      <div className="w-[120px] h-[64px] rounded-[10px] overflow-hidden flex-shrink-0 bg-gray-100">
        {item.imageUrl ? (
          <img src={item.imageUrl} alt="carousel" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            <ImageIcon size={20} />
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-[14px] font-semibold text-[#202224] truncate">
          {item.description || <span className="text-gray-400 italic">No description</span>}
        </p>
      </div>

      <span className="text-[13px] text-gray-500 w-10 text-center flex-shrink-0">#{item.order}</span>

      <div className="flex-shrink-0">
        <StatusBadge isActive={item.isActive} />
      </div>

      <div className="flex-shrink-0">
        <ActionButtons onEdit={() => onEdit(item)} onDelete={() => onDelete(item)} />
      </div>
    </div>
  );
}

function CarouselModal({ isOpen, onClose, onSave, editing }) {
  const [form, setForm] = useState({ imageUrl: '', description: '', isActive: true, order: 0 });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editing) {
      setForm({
        imageUrl: editing.imageUrl || '',
        description: editing.description || '',
        isActive: editing.isActive ?? true,
        order: editing.order ?? 0,
      });
    } else {
      setForm({ imageUrl: '', description: '', isActive: true, order: 0 });
    }
  }, [editing, isOpen]);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file, 'carousel');
      setForm((f) => ({ ...f, imageUrl: url }));
    } catch {
      alert('Image upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.imageUrl) { alert('Please upload an image.'); return; }
    setSaving(true);
    try {
      if (editing) {
        await updateCarouselItem(editing.id, form);
      } else {
        await createCarouselItem(form);
      }
      onSave();
    } catch {
      alert('Failed to save carousel item.');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6">
        <h2 className="text-lg font-bold text-[#202224] mb-5">
          {editing ? 'Edit Carousel Item' : 'Add Carousel Item'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Image upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
            {form.imageUrl && (
              <div className="mb-2 rounded-xl overflow-hidden h-40 bg-gray-100">
                <img src={form.imageUrl} alt="preview" className="w-full h-full object-cover" />
              </div>
            )}
            <label className="flex items-center gap-2 cursor-pointer border-2 border-dashed border-gray-200 rounded-xl px-4 py-3 hover:border-primary transition-colors text-sm text-gray-500">
              <ImageIcon size={16} />
              {uploading ? 'Uploading…' : 'Click to upload image'}
              <input type="file" accept="image/*" className="hidden" onChange={handleFile} disabled={uploading} />
            </label>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              rows={3}
              placeholder="Enter a short description shown on the carousel…"
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary resize-none"
            />
          </div>

          {/* Order + Active */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
              <input
                type="number"
                min={0}
                value={form.order}
                onChange={(e) => setForm((f) => ({ ...f, order: parseInt(e.target.value) || 0 }))}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary"
              />
            </div>
            <div className="flex items-end pb-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
                  className="w-4 h-4 accent-primary"
                />
                <span className="text-sm text-gray-700">Active</span>
              </label>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50">
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || uploading}
              className="flex-1 py-2.5 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary/90 disabled:opacity-60"
            >
              {saving ? 'Saving…' : editing ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Carousel() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchCarousel();
      setItems(data.items || []);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (item) => {
    if (!window.confirm(`Delete this carousel item?`)) return;
    try {
      await deleteCarouselItem(item.id);
      load();
    } catch {
      alert('Failed to delete carousel item.');
    }
  };

  const handleSave = () => { setModalOpen(false); setEditing(null); load(); };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[24px] font-bold text-[#202224]">Home Carousel</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Manage the image carousel shown at the top of the user app home screen.
          </p>
        </div>
        <button
          onClick={() => { setEditing(null); setModalOpen(true); }}
          className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <Plus size={16} />
          Add Slide
        </button>
      </div>

      <div className="grid grid-cols-[120px_1fr_60px_80px_100px] gap-4 px-4 text-[12px] font-semibold text-[#b5b7c0] uppercase tracking-wide">
        <span>Image</span>
        <span>Description</span>
        <span className="text-center">Order</span>
        <span>Status</span>
        <span className="text-center">Actions</span>
      </div>

      {loading ? (
        <div className="flex justify-center py-16 text-gray-400 text-sm">Loading…</div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-gray-400">
          <ImageIcon size={40} className="mb-3 opacity-30" />
          <p className="text-sm">No carousel slides yet.</p>
          <button
            onClick={() => { setEditing(null); setModalOpen(true); }}
            className="mt-3 text-sm text-primary hover:underline"
          >
            Add your first slide
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <CarouselRow key={item.id} item={item} onEdit={setEditing} onDelete={handleDelete} />
          ))}
        </div>
      )}

      <CarouselModal
        isOpen={modalOpen || !!editing}
        onClose={() => { setModalOpen(false); setEditing(null); }}
        onSave={handleSave}
        editing={editing}
      />
    </div>
  );
}
