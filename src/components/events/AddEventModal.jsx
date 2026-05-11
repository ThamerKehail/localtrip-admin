import { useState, useEffect } from 'react';
import { Upload, X } from 'lucide-react';
import Modal from '../ui/Modal';
import { createEvent, uploadImage, fetchDestinations } from '../../services/admin.service';

const EVENT_TYPES = ['Concert', 'Festival', 'Exhibition', 'Sports', 'Cultural', 'Food', 'Other'];

const EMPTY = {
  titleEn: '', titleAr: '', description: '', location: '',
  startDate: '', endDate: '', type: '', destinationId: '',
  imageFile: null, imagePreview: null,
};

export default function AddEventModal({ isOpen, onClose, onAdd }) {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [destinations, setDestinations] = useState([]);

  useEffect(() => {
    if (isOpen) {
      fetchDestinations({ limit: 100 })
        .then((res) => setDestinations(res.destinations ?? []))
        .catch(() => {});
    }
  }, [isOpen]);

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
    if (!form.titleEn.trim()) errs.titleEn = 'Title (English) is required';
    if (!form.startDate) errs.startDate = 'Start date is required';
    if (!form.destinationId) errs.destinationId = 'City is required';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setSaving(true);
    try {
      let coverPhoto = null;
      if (form.imageFile) coverPhoto = await uploadImage(form.imageFile, 'localtrip/events');
      await createEvent({
        titleEn: form.titleEn.trim(),
        titleAr: form.titleAr.trim() || form.titleEn.trim(),
        description: form.description.trim() || null,
        location: form.location.trim() || null,
        startDate: form.startDate,
        endDate: form.endDate || null,
        type: form.type || null,
        coverPhoto,
        destinationId: form.destinationId,
      });
      setForm(EMPTY);
      setErrors({});
      onAdd();
    } catch {
      alert('Failed to create event. Please try again.');
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
    <Modal isOpen={isOpen} onClose={handleClose} title="Add Event" size="lg">
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

        {/* Title EN / AR */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">
              Title (English) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.titleEn}
              onChange={(e) => set('titleEn', e.target.value)}
              placeholder="e.g. Live at Riyadh Season"
              className={`w-full px-3 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 ${errors.titleEn ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
            />
            {errors.titleEn && <p className="text-xs text-red-500 mt-1">{errors.titleEn}</p>}
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">Title (Arabic)</label>
            <input
              type="text"
              value={form.titleAr}
              onChange={(e) => set('titleAr', e.target.value)}
              placeholder="مثال: حفل موسيقي"
              dir="rtl"
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        {/* City (Destination) */}
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1.5">
            City <span className="text-red-500">*</span>
          </label>
          <select
            value={form.destinationId}
            onChange={(e) => set('destinationId', e.target.value)}
            className={`w-full px-3 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-gray-700 ${errors.destinationId ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
          >
            <option value="">Select city</option>
            {destinations.map((d) => (
              <option key={d.id} value={d.id}>{d.city} — {d.nameEn}</option>
            ))}
          </select>
          {errors.destinationId && <p className="text-xs text-red-500 mt-1">{errors.destinationId}</p>}
        </div>

        {/* Location + Type */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">Venue / Location</label>
            <input
              type="text"
              value={form.location}
              onChange={(e) => set('location', e.target.value)}
              placeholder="e.g. Boulevard World"
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">Event Type</label>
            <select
              value={form.type}
              onChange={(e) => set('type', e.target.value)}
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-gray-600"
            >
              <option value="">Select type</option>
              {EVENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">
              Start Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={form.startDate}
              onChange={(e) => set('startDate', e.target.value)}
              className={`w-full px-3 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 ${errors.startDate ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
            />
            {errors.startDate && <p className="text-xs text-red-500 mt-1">{errors.startDate}</p>}
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">End Date</label>
            <input
              type="date"
              value={form.endDate}
              min={form.startDate}
              onChange={(e) => set('endDate', e.target.value)}
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1.5">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => set('description', e.target.value)}
            placeholder="Brief description of the event..."
            rows={3}
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
            {saving ? 'Saving…' : 'Add Event'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
