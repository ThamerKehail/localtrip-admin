import { useState, useEffect } from 'react';
import { Plus, Trash2, X, Upload } from 'lucide-react';
import Modal from '../ui/Modal';
import { fetchTripById, updateTrip, uploadImage } from '../../services/admin.service';

export default function EditTripModal({ isOpen, onClose, onSave, tripId }) {
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!isOpen || !tripId) return;
    setLoading(true);
    fetchTripById(tripId)
      .then(({ trip }) => {
        setForm({
          titleEn: trip.titleEn || '',
          titleAr: trip.titleAr || '',
          city: trip.city || '',
          description: trip.description || '',
          priceAdult: trip.priceAdult ?? '',
          priceChild: trip.priceChild ?? 0,
          meetingTime: trip.meetingTime || '',
          meetingLocation: trip.meetingLocation || '',
          status: trip.status || 'draft',
          coverPhoto: trip.coverPhoto || null,
          imageFile: null,
          // itinerary: [{time, activity}]
          itinerary: Array.isArray(trip.itinerary) ? trip.itinerary : [],
          // activities: [{title, duration, description, image}]
          activities: Array.isArray(trip.activities)
            ? trip.activities.map((a) => ({ ...a, imageFile: null }))
            : [],
          // included: string[]
          included: Array.isArray(trip.included) ? trip.included : [],
        });
        setErrors({});
      })
      .catch(() => alert('Failed to load trip details'))
      .finally(() => setLoading(false));
  }, [isOpen, tripId]);

  const set = (field, value) => setForm((p) => ({ ...p, [field]: value }));

  const handleImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    set('imageFile', file);
    set('coverPhoto', URL.createObjectURL(file));
  };

  // ── Itinerary helpers ──────────────────────────────────────────────────────
  const addItinerary = () =>
    set('itinerary', [...form.itinerary, { time: '', activity: '' }]);

  const updateItinerary = (i, field, value) => {
    const updated = form.itinerary.map((item, idx) =>
      idx === i ? { ...item, [field]: value } : item
    );
    set('itinerary', updated);
  };

  const removeItinerary = (i) =>
    set('itinerary', form.itinerary.filter((_, idx) => idx !== i));

  // ── Activities helpers ─────────────────────────────────────────────────────
  const addActivity = () =>
    set('activities', [...form.activities, { title: '', duration: '', description: '', location: '', image: null, imageFile: null }]);

  const updateActivity = (i, field, value) => {
    const updated = form.activities.map((item, idx) =>
      idx === i ? { ...item, [field]: value } : item
    );
    set('activities', updated);
  };

  const removeActivity = (i) =>
    set('activities', form.activities.filter((_, idx) => idx !== i));

  const handleActivityImage = (i, file) => {
    if (!file) return;
    const updated = form.activities.map((item, idx) =>
      idx === i ? { ...item, imageFile: file, image: URL.createObjectURL(file) } : item
    );
    set('activities', updated);
  };

  const clearActivityImage = (i) => {
    const updated = form.activities.map((item, idx) =>
      idx === i ? { ...item, imageFile: null, image: null } : item
    );
    set('activities', updated);
  };

  // ── Included helpers ───────────────────────────────────────────────────────
  const addIncluded = () => set('included', [...form.included, '']);

  const updateIncluded = (i, value) => {
    const updated = form.included.map((item, idx) => (idx === i ? value : item));
    set('included', updated);
  };

  const removeIncluded = (i) =>
    set('included', form.included.filter((_, idx) => idx !== i));

  const validate = () => {
    const errs = {};
    if (!form.titleEn.trim()) errs.titleEn = 'Title (English) is required';
    if (!form.city.trim()) errs.city = 'City is required';
    if (!form.priceAdult && form.priceAdult !== 0) errs.priceAdult = 'Price is required';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setSaving(true);
    try {
      let coverPhoto = form.imageFile
        ? await uploadImage(form.imageFile, 'localtrip/tours')
        : (form.coverPhoto || null);

      const activities = await Promise.all(
        form.activities
          .filter((a) => a.title.trim())
          .map(async (a) => {
            const image = a.imageFile
              ? await uploadImage(a.imageFile, 'localtrip/activities')
              : (a.image || null);
            return {
              title: a.title.trim(),
              duration: a.duration?.trim() || null,
              description: a.description?.trim() || null,
              location: a.location?.trim() || null,
              image,
            };
          })
      );

      await updateTrip(tripId, {
        titleEn: form.titleEn.trim(),
        titleAr: form.titleAr.trim() || form.titleEn.trim(),
        city: form.city.trim(),
        description: form.description.trim() || null,
        priceAdult: parseFloat(form.priceAdult) || 0,
        priceChild: parseFloat(form.priceChild) || 0,
        meetingTime: form.meetingTime.trim() || null,
        meetingLocation: form.meetingLocation.trim() || null,
        status: form.status,
        coverPhoto,
        itinerary: form.itinerary.filter((s) => s.activity.trim()),
        activities,
        included: form.included.filter((s) => s.trim()),
      });
      onSave();
    } catch {
      alert('Failed to save trip. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => { setErrors({}); onClose(); };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Edit Trip" size="lg">
      {loading || !form ? (
        <div className="flex items-center justify-center py-16 text-sm text-gray-400">Loading…</div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Cover Image */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">Cover Image</label>
            {form.coverPhoto ? (
              <div className="relative rounded-xl overflow-hidden h-40 bg-gray-100">
                <img src={form.coverPhoto} alt="preview" className="w-full h-full object-cover" />
                <button type="button" onClick={() => { set('coverPhoto', null); set('imageFile', null); }}
                  className="absolute top-2 end-2 p-1.5 bg-white rounded-lg shadow text-gray-600 hover:text-red-500">
                  <X size={14} />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 hover:border-primary/50 cursor-pointer transition-colors">
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
              <input type="text" value={form.titleEn} onChange={(e) => set('titleEn', e.target.value)}
                placeholder="e.g. Old Jeddah Walking Tour"
                className={`w-full px-3 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 ${errors.titleEn ? 'border-red-300 bg-red-50' : 'border-gray-200'}`} />
              {errors.titleEn && <p className="text-xs text-red-500 mt-1">{errors.titleEn}</p>}
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">Title (Arabic)</label>
              <input type="text" value={form.titleAr} onChange={(e) => set('titleAr', e.target.value)}
                placeholder="مثال: جولة جدة القديمة" dir="rtl"
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" />
            </div>
          </div>

          {/* City + Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">
                City <span className="text-red-500">*</span>
              </label>
              <input type="text" value={form.city} onChange={(e) => set('city', e.target.value)}
                placeholder="e.g. Riyadh"
                className={`w-full px-3 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 ${errors.city ? 'border-red-300 bg-red-50' : 'border-gray-200'}`} />
              {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city}</p>}
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">Status</label>
              <select value={form.status} onChange={(e) => set('status', e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-gray-700">
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="paused">Paused</option>
              </select>
            </div>
          </div>

          {/* Price Adult + Child */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">
                Price (Adult) SAR <span className="text-red-500">*</span>
              </label>
              <input type="number" min="0" value={form.priceAdult}
                onChange={(e) => set('priceAdult', e.target.value)}
                placeholder="e.g. 250"
                className={`w-full px-3 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 ${errors.priceAdult ? 'border-red-300 bg-red-50' : 'border-gray-200'}`} />
              {errors.priceAdult && <p className="text-xs text-red-500 mt-1">{errors.priceAdult}</p>}
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">Price (Child) SAR</label>
              <input type="number" min="0" value={form.priceChild}
                onChange={(e) => set('priceChild', e.target.value)}
                placeholder="e.g. 150"
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" />
            </div>
          </div>

          {/* Meeting Time + Location */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">Meeting Time</label>
              <input type="text" value={form.meetingTime}
                onChange={(e) => set('meetingTime', e.target.value)}
                placeholder="e.g. 09:00 AM"
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">Meeting Location</label>
              <input type="text" value={form.meetingLocation}
                onChange={(e) => set('meetingLocation', e.target.value)}
                placeholder="e.g. Al Balad Gate, Jeddah"
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">Description</label>
            <textarea value={form.description} onChange={(e) => set('description', e.target.value)}
              placeholder="Describe what makes this tour special…" rows={3}
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none" />
          </div>

          {/* ── Itinerary ─────────────────────────────────────────────────── */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-semibold text-gray-800">Schedule / Itinerary</label>
              <button type="button" onClick={addItinerary}
                className="flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80">
                <Plus size={14} /> Add Stop
              </button>
            </div>
            {form.itinerary.length === 0 && (
              <p className="text-xs text-gray-400 italic">No itinerary yet. Add stops to show the schedule.</p>
            )}
            <div className="space-y-3">
              {form.itinerary.map((item, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <input type="text" value={item.time}
                    onChange={(e) => updateItinerary(i, 'time', e.target.value)}
                    placeholder="09:00 AM"
                    className="w-28 px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 shrink-0" />
                  <input type="text" value={item.activity}
                    onChange={(e) => updateItinerary(i, 'activity', e.target.value)}
                    placeholder="Activity description"
                    className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" />
                  <button type="button" onClick={() => removeItinerary(i)}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors mt-0.5">
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* ── Activities ────────────────────────────────────────────────── */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-semibold text-gray-800">Activities (What you'll do)</label>
              <button type="button" onClick={addActivity}
                className="flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80">
                <Plus size={14} /> Add Activity
              </button>
            </div>
            {form.activities.length === 0 && (
              <p className="text-xs text-gray-400 italic">No activities yet. Add detailed activity cards for the app.</p>
            )}
            <div className="space-y-4">
              {form.activities.map((item, i) => (
                <div key={i} className="border border-gray-100 rounded-xl p-4 space-y-3 bg-gray-50/50">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Activity {i + 1}</span>
                    <button type="button" onClick={() => removeActivity(i)}
                      className="p-1 text-gray-400 hover:text-red-500 transition-colors">
                      <Trash2 size={13} />
                    </button>
                  </div>
                  {/* Activity image upload */}
                  {item.image ? (
                    <div className="relative rounded-xl overflow-hidden h-32 bg-gray-100">
                      <img src={item.image} alt="activity" className="w-full h-full object-cover" />
                      <button type="button" onClick={() => clearActivityImage(i)}
                        className="absolute top-2 end-2 p-1 bg-white rounded-lg shadow text-gray-500 hover:text-red-500">
                        <X size={13} />
                      </button>
                    </div>
                  ) : (
                    <label className="flex items-center justify-center gap-2 h-16 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 hover:border-primary/50 cursor-pointer transition-colors">
                      <Upload size={16} className="text-gray-400" />
                      <span className="text-sm text-gray-400">Upload activity image</span>
                      <input type="file" accept="image/*" className="hidden"
                        onChange={(e) => handleActivityImage(i, e.target.files[0])} />
                    </label>
                  )}

                  <div className="grid grid-cols-2 gap-3">
                    <input type="text" value={item.title}
                      onChange={(e) => updateActivity(i, 'title', e.target.value)}
                      placeholder="Activity title"
                      className="px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white" />
                    <input type="text" value={item.duration || ''}
                      onChange={(e) => updateActivity(i, 'duration', e.target.value)}
                      placeholder="Duration (e.g. 2hr)"
                      className="px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white" />
                  </div>
                  <input type="text" value={item.location || ''}
                    onChange={(e) => updateActivity(i, 'location', e.target.value)}
                    placeholder="Location (e.g. Al Thumairi St, Riyadh)"
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white" />
                  <textarea value={item.description || ''}
                    onChange={(e) => updateActivity(i, 'description', e.target.value)}
                    placeholder="Brief description shown in the app"
                    rows={2}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none bg-white" />
                </div>
              ))}
            </div>
          </div>

          {/* ── What's Included ───────────────────────────────────────────── */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-semibold text-gray-800">What's Included</label>
              <button type="button" onClick={addIncluded}
                className="flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80">
                <Plus size={14} /> Add Item
              </button>
            </div>
            {form.included.length === 0 && (
              <p className="text-xs text-gray-400 italic">No inclusions yet. e.g. Traditional Dinner, Hotel Pickup</p>
            )}
            <div className="space-y-2">
              {form.included.map((item, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <input type="text" value={item}
                    onChange={(e) => updateIncluded(i, e.target.value)}
                    placeholder="e.g. Traditional Dinner"
                    className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" />
                  <button type="button" onClick={() => removeIncluded(i)}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={handleClose}
              className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={saving}
              className="flex-1 py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary/90 disabled:opacity-60 transition-colors">
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
}
