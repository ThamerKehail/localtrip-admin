import { useState, useEffect } from 'react';
import { Upload, X } from 'lucide-react';
import Modal from '../ui/Modal';
import { createCategory, updateCategory, uploadImage } from '../../services/admin.service';

const EMPTY = {
  titleEn: '', titleAr: '', order: '',
  imageFile: null, imagePreview: null, existingImageUrl: null,
};

function toSlug(str) {
  return str
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_]/g, '');
}

export default function CategoryModal({ isOpen, onClose, onSave, editing }) {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editing) {
      setForm({
        titleEn: editing.titleEn || '',
        titleAr: editing.titleAr || '',
        order: editing.order?.toString() || '0',
        imageFile: null,
        imagePreview: null,
        existingImageUrl: editing.imageUrl || null,
      });
    } else {
      setForm(EMPTY);
    }
    setErrors({});
  }, [editing, isOpen]);

  const set = (field, value) => setForm((p) => ({ ...p, [field]: value }));

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      set('imageFile', file);
      set('imagePreview', URL.createObjectURL(file));
      set('existingImageUrl', null);
    }
  };

  const clearImage = () => {
    set('imageFile', null);
    set('imagePreview', null);
    set('existingImageUrl', null);
  };

  const validate = () => {
    const errs = {};
    if (!form.titleEn.trim()) errs.titleEn = 'Title (English) is required';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setSaving(true);
    try {
      let imageUrl = form.existingImageUrl || null;
      if (form.imageFile) imageUrl = await uploadImage(form.imageFile, 'localtrip/categories');

      const payload = {
        titleEn: form.titleEn.trim(),
        titleAr: form.titleAr.trim() || form.titleEn.trim(),
        imageUrl,
        order: form.order !== '' ? parseInt(form.order) : 0,
      };

      if (editing) {
        await updateCategory(editing.id, payload);
      } else {
        await createCategory(payload);
      }

      setForm(EMPTY);
      setErrors({});
      onSave();
    } catch (err) {
      const msg = err?.response?.data?.message || 'Failed to save category. Please try again.';
      alert(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    setForm(EMPTY);
    setErrors({});
    onClose();
  };

  const previewSrc = form.imagePreview || form.existingImageUrl;
  const slugPreview = form.titleEn ? toSlug(form.titleEn) : '';

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={editing ? 'Edit Category' : 'Add Category'} size="md">
      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Image upload */}
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-2">Category Image</label>
          {previewSrc ? (
            <div className="relative rounded-xl overflow-hidden h-36 bg-gray-100">
              <img src={previewSrc} alt="preview" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={clearImage}
                className="absolute top-2 end-2 p-1.5 bg-white rounded-lg shadow text-gray-600 hover:text-red-500"
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center h-36 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 hover:border-primary/50 hover:bg-primary/5 transition-colors cursor-pointer">
              <Upload size={22} className="text-gray-400 mb-2" />
              <span className="text-sm text-gray-500">Click to upload image</span>
              <span className="text-xs text-gray-400 mt-1">PNG, JPG up to 10MB</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleImage} />
            </label>
          )}
        </div>

        {/* Title EN / AR */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">
              Name (English) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.titleEn}
              onChange={(e) => set('titleEn', e.target.value)}
              placeholder="e.g. Heritage"
              className={`w-full px-3 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 ${errors.titleEn ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
            />
            {errors.titleEn && <p className="text-xs text-red-500 mt-1">{errors.titleEn}</p>}
            {/* Live slug preview */}
            {slugPreview && (
              <p className="text-xs text-gray-400 mt-1">
                Slug: <code className="bg-gray-100 px-1 rounded">{slugPreview}</code>
              </p>
            )}
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">Name (Arabic)</label>
            <input
              type="text"
              value={form.titleAr}
              onChange={(e) => set('titleAr', e.target.value)}
              placeholder="مثال: تراث"
              dir="rtl"
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        {/* Display Order */}
        <div className="w-1/3">
          <label className="text-sm font-medium text-gray-700 block mb-1.5">Display Order</label>
          <input
            type="number"
            min="0"
            value={form.order}
            onChange={(e) => set('order', e.target.value)}
            placeholder="0"
            className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={handleClose}
            className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex-1 py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary/90 disabled:opacity-60 transition-colors"
          >
            {saving ? 'Saving…' : editing ? 'Save Changes' : 'Add Category'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
