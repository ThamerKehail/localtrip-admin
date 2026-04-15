import { useState } from 'react';
import { Upload, X } from 'lucide-react';
import Modal from '../ui/Modal';
import { useLang } from '../../context/LanguageContext';
import { createDestination } from '../../services/admin.service';

const CATEGORIES = ['Heritage', 'Coastal', 'Adventure', 'Nature', 'Desert', 'Culture', 'City', 'Food'];

export default function AddDestinationModal({ isOpen, onClose, onAdd }) {
  const { t } = useLang();
  const [form, setForm] = useState({ nameEn: '', nameAr: '', city: '', category: '', description: '', descriptionAr: '', imagePreview: null });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const set = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) set('imagePreview', URL.createObjectURL(file));
  };

  const validate = () => {
    const errs = {};
    if (!form.city.trim()) errs.city = t('cityRequired');
    if (!form.category) errs.category = t('categoryRequired');
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setSaving(true);
    try {
      await createDestination({
        nameEn: form.nameEn || form.city,
        nameAr: form.nameAr || form.city,
        city: form.city,
        category: form.category,
        description: form.description || null,
        coverPhoto: form.imagePreview || null,
      });
      setForm({ nameEn: '', nameAr: '', city: '', category: '', description: '', descriptionAr: '', imagePreview: null });
      setErrors({});
      onAdd();
    } catch {
      alert(t('failedToLoad'));
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    setForm({ nameEn: '', nameAr: '', city: '', category: '', description: '', descriptionAr: '', imagePreview: null });
    setErrors({});
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={t('addDestination')} size="lg">
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Image */}
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-2">{t('coverImage')}</label>
          {form.imagePreview ? (
            <div className="relative rounded-xl overflow-hidden h-40 bg-gray-100">
              <img src={form.imagePreview} alt="preview" className="w-full h-full object-cover" />
              <button type="button" onClick={() => set('imagePreview', null)} className="absolute top-2 end-2 p-1.5 bg-white rounded-lg shadow text-gray-600 hover:text-red-500">
                <X size={14} />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 hover:border-primary/50 hover:bg-primary/5 transition-colors cursor-pointer">
              <Upload size={24} className="text-gray-400 mb-2" />
              <span className="text-sm text-gray-500">{t('clickToUpload')}</span>
              <span className="text-xs text-gray-400 mt-1">{t('uploadHint')}</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
            </label>
          )}
        </div>

        {/* City names */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">
              {t('cityNameEn')} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.city}
              onChange={(e) => set('city', e.target.value)}
              placeholder={t('cityPlaceholderEn')}
              className={`w-full px-3 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 ${errors.city ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
            />
            {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city}</p>}
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">{t('cityNameAr')}</label>
            <input type="text" value={form.nameAr} onChange={(e) => set('nameAr', e.target.value)} placeholder={t('cityPlaceholderAr')} dir="rtl" className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" />
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1.5">
            {t('category')} <span className="text-red-500">*</span>
          </label>
          <select
            value={form.category}
            onChange={(e) => set('category', e.target.value)}
            className={`w-full px-3 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 ${errors.category ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
          >
            <option value="">{t('selectCategory')}</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          {errors.category && <p className="text-xs text-red-500 mt-1">{errors.category}</p>}
        </div>

        {/* Descriptions */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">{t('descriptionEn')}</label>
            <textarea value={form.description} onChange={(e) => set('description', e.target.value)} placeholder={t('descPlaceholderEn')} rows={3} className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">{t('descriptionAr')}</label>
            <textarea value={form.descriptionAr} onChange={(e) => set('descriptionAr', e.target.value)} placeholder={t('descPlaceholderAr')} dir="rtl" rows={3} className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none" />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <button type="button" onClick={handleClose} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50">
            {t('cancel')}
          </button>
          <button type="submit" disabled={saving} className="flex-1 py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-600 disabled:opacity-60">
            {saving ? '...' : t('saveAsDraft')}
          </button>
        </div>
      </form>
    </Modal>
  );
}
