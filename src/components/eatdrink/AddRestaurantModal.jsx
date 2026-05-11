import { useState, useEffect } from 'react';
import { Upload, X } from 'lucide-react';
import Modal from '../ui/Modal';
import { createRestaurant, uploadImage, fetchDestinations } from '../../services/admin.service';

const EMPTY = { nameEn: '', nameAr: '', description: '', location: '', tips: '', destinationId: '', imageFile: null, imagePreview: null };

export default function AddRestaurantModal({ isOpen, onClose, onAdd }) {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [destinations, setDestinations] = useState([]);

  useEffect(() => {
    fetchDestinations({ limit: 100 })
      .then((d) => setDestinations(d.destinations || []))
      .catch(() => {});
  }, []);

  const set = (field, value) => setForm((p) => ({ ...p, [field]: value }));

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      set('imageFile', file);
      set('imagePreview', URL.createObjectURL(file));
    }
  };

  const validate = () => {
    const errs = {};
    if (!form.nameEn.trim()) errs.nameEn = 'Name (English) is required';
    if (!form.destinationId) errs.destinationId = 'Please select a city destination';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setSaving(true);
    try {
      let coverPhoto = null;
      if (form.imageFile) coverPhoto = await uploadImage(form.imageFile, 'localtrip/restaurants');
      await createRestaurant({
        nameEn: form.nameEn.trim(),
        nameAr: form.nameAr.trim() || form.nameEn.trim(),
        description: form.description.trim() || null,
        location: form.location.trim() || null,
        tips: form.tips.trim() || null,
        destinationId: form.destinationId || null,
        coverPhoto,
      });
      setForm(EMPTY);
      setErrors({});
      onAdd();
    } catch {
      alert('Failed to create restaurant. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    setForm(EMPTY);
    setErrors({});
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Add Eat & Drink" size="lg">
      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Cover Image */}
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-2">Cover Image</label>
          {form.imagePreview ? (
            <div className="relative rounded-xl overflow-hidden h-40 bg-gray-100">
              <img src={form.imagePreview} alt="preview" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => set('imagePreview', null)}
                className="absolute top-2 end-2 p-1.5 bg-white rounded-lg shadow text-gray-600 hover:text-red-500"
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 hover:border-primary/50 hover:bg-primary/5 transition-colors cursor-pointer">
              <Upload size={24} className="text-gray-400 mb-2" />
              <span className="text-sm text-gray-500">Click to upload image</span>
              <span className="text-xs text-gray-400 mt-1">PNG, JPG up to 10MB</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleImage} />
            </label>
          )}
        </div>

        {/* Name EN / AR */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">
              Name (English) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.nameEn}
              onChange={(e) => set('nameEn', e.target.value)}
              placeholder="e.g. Najd Village"
              className={`w-full px-3 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 ${errors.nameEn ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
            />
            {errors.nameEn && <p className="text-xs text-red-500 mt-1">{errors.nameEn}</p>}
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">Name (Arabic)</label>
            <input
              type="text"
              value={form.nameAr}
              onChange={(e) => set('nameAr', e.target.value)}
              placeholder="مثال: قرية نجد"
              dir="rtl"
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        {/* Destination (City) */}
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1.5">
            City Destination <span className="text-red-500">*</span>
          </label>
          <select
            value={form.destinationId}
            onChange={(e) => set('destinationId', e.target.value)}
            className={`w-full px-3 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 ${errors.destinationId ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
          >
            <option value="">Select a city destination</option>
            {destinations.map((d) => (
              <option key={d.id} value={d.id}>{d.city} {d.nameEn !== d.city ? `— ${d.nameEn}` : ''}</option>
            ))}
          </select>
          {errors.destinationId && <p className="text-xs text-red-500 mt-1">{errors.destinationId}</p>}
        </div>

        {/* Location */}
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1.5">Address / Location</label>
          <input
            type="text"
            value={form.location}
            onChange={(e) => set('location', e.target.value)}
            placeholder="e.g. Al Olaya District, Riyadh"
            className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {/* Description */}
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1.5">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => set('description', e.target.value)}
            placeholder="Brief description of the restaurant..."
            rows={3}
            className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
          />
        </div>

        {/* Tips */}
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1.5">Tips</label>
          <textarea
            value={form.tips}
            onChange={(e) => set('tips', e.target.value)}
            placeholder="Useful tips for visitors..."
            rows={2}
            className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
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
            {saving ? 'Saving…' : 'Add Restaurant'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
