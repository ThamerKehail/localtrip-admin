import { useState, useEffect } from 'react';
import { Upload, X } from 'lucide-react';
import Modal from '../ui/Modal';
import { useLang } from '../../context/LanguageContext';
import { updateDestination, uploadImage } from '../../services/admin.service';

export default function EditDestinationModal({ dest, onClose, onSave }) {
  const { t } = useLang();
  const [form, setForm] = useState({ nameAr: '', category: '', description: '', descriptionAr: '', sortOrder: 0, imageFile: null, imagePreview: null });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (dest) {
      setForm({
        nameAr: dest.nameAr || '',
        category: dest.category || '',
        description: dest.description || '',
        descriptionAr: dest.descriptionAr || '',
        sortOrder: dest.sortOrder ?? 0,
        imageFile: null,
        imagePreview: dest.coverPhoto || null,
      });
    }
  }, [dest]);

  const set = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      set('imageFile', file);
      set('imagePreview', URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      let coverPhoto = dest.coverPhoto;
      if (form.imageFile) coverPhoto = await uploadImage(form.imageFile, 'localtrip/destinations');
      await updateDestination(dest.id, {
        nameAr: form.nameAr || dest.city,
        category: form.category || null,
        description: form.description || null,
        descriptionAr: form.descriptionAr || null,
        sortOrder: parseInt(form.sortOrder) || 0,
        coverPhoto,
      });
      onSave();
    } catch {
      alert(t('failedToLoad'));
    } finally {
      setSaving(false);
    }
  };

  if (!dest) return null;

  return (
    <Modal isOpen={!!dest} onClose={onClose} title={`${t('edit')} — ${dest.city}`} size="lg">
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Image */}
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-2">{t('coverImage')}</label>
          {form.imagePreview ? (
            <div className="relative rounded-xl overflow-hidden h-40 bg-gray-100">
              <img src={form.imagePreview} alt="preview" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => { set('imagePreview', null); set('imageFile', null); }}
                className="absolute top-2 end-2 p-1.5 bg-white rounded-lg shadow text-gray-600 hover:text-red-500"
              >
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

        {/* City (read-only) */}
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1.5">{t('city')}</label>
          <div className="px-3 py-2.5 text-sm border border-gray-100 rounded-xl bg-gray-50 text-gray-500">
            {dest.city}
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1.5">{t('category')}</label>
          <select
            value={form.category}
            onChange={(e) => set('category', e.target.value)}
            className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="">{t('selectCategory')}</option>
            <option value="heritage">Heritage</option>
            <option value="desert">Desert</option>
            <option value="coastal">Coastal</option>
            <option value="city">City</option>
          </select>
        </div>

        {/* Arabic name */}
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1.5">{t('cityNameAr')}</label>
          <input
            type="text"
            value={form.nameAr}
            onChange={(e) => set('nameAr', e.target.value)}
            placeholder={t('cityPlaceholderAr')}
            dir="rtl"
            className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {/* Sort Order */}
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1.5">{t('sortOrder')}</label>
          <input
            type="number"
            min="0"
            value={form.sortOrder}
            onChange={(e) => set('sortOrder', e.target.value)}
            className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <p className="text-xs text-gray-400 mt-1">{t('sortOrderHint')}</p>
        </div>

        {/* Description EN */}
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1.5">{t('descriptionEn')}</label>
          <textarea
            value={form.description}
            onChange={(e) => set('description', e.target.value)}
            placeholder={t('descPlaceholderEn')}
            rows={3}
            className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
          />
        </div>

        {/* Description AR */}
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1.5">{t('descriptionAr')}</label>
          <textarea
            value={form.descriptionAr}
            onChange={(e) => set('descriptionAr', e.target.value)}
            placeholder={t('descPlaceholderAr')}
            rows={3}
            dir="rtl"
            className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50">
            {t('cancel')}
          </button>
          <button type="submit" disabled={saving} className="flex-1 py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-600 disabled:opacity-60">
            {saving ? '...' : t('save')}
          </button>
        </div>
      </form>
    </Modal>
  );
}
