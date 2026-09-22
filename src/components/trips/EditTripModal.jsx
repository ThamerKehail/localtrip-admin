import { useState, useEffect } from 'react';
import { Plus, Trash2, X, Upload, AlertCircle } from 'lucide-react';
import Modal from '../ui/Modal';
import { fetchTripById, updateTrip, uploadImage } from '../../services/admin.service';
import { useLang } from '../../context/LanguageContext';
import { getErrorMessage } from '../../utils/errors';

// Tour.status enum on the backend: draft | published | paused | inactive
const TOUR_STATUSES = ['draft', 'published', 'paused', 'inactive'];

export default function EditTripModal({ isOpen, onClose, onSave, tripId }) {
  const { t } = useLang();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  // { err, fallbackKey } — localized at render time so it follows the language toggle.
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    if (!isOpen || !tripId) return;
    setLoading(true);
    setSubmitError(null);
    fetchTripById(tripId)
      .then(({ trip }) => {
        setForm({
          titleEn: trip.titleEn || '',
          titleAr: trip.titleAr || '',
          city: trip.city || '',
          // Production tours carry bilingual columns; `description` /
          // `meetingLocation` are the legacy English columns.
          descriptionEn: trip.descriptionEn || trip.description || '',
          descriptionAr: trip.descriptionAr || '',
          priceAdult: trip.priceAdult ?? '',
          priceChild: trip.priceChild ?? 0,
          meetingTime: trip.meetingTime || '',
          meetingLocationEn: trip.meetingLocationEn || trip.meetingLocation || '',
          meetingLocationAr: trip.meetingLocationAr || '',
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
      .catch((err) => setSubmitError({ err, fallbackKey: 'errLoadTrip' }))
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
    if (!form.titleEn.trim()) errs.titleEn = t('titleEnRequired');
    if (!form.city.trim()) errs.city = t('cityRequired');
    // The description column is NOT NULL — an empty value used to be sent as null (500).
    if (!form.descriptionEn.trim()) errs.descriptionEn = t('descriptionEnRequired');
    if (!form.priceAdult && form.priceAdult !== 0) errs.priceAdult = t('priceRequired');
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setSubmitError(null);

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

      const descriptionEn = form.descriptionEn.trim();
      const meetingLocationEn = form.meetingLocationEn.trim() || null;

      await updateTrip(tripId, {
        titleEn: form.titleEn.trim(),
        titleAr: form.titleAr.trim() || form.titleEn.trim(),
        city: form.city.trim(),
        // Legacy columns mirror the English values so older clients stay in sync.
        description: descriptionEn,
        descriptionEn,
        descriptionAr: form.descriptionAr.trim() || null,
        priceAdult: parseFloat(form.priceAdult) || 0,
        priceChild: parseFloat(form.priceChild) || 0,
        meetingTime: form.meetingTime.trim() || null,
        meetingLocation: meetingLocationEn,
        meetingLocationEn,
        meetingLocationAr: form.meetingLocationAr.trim() || null,
        status: form.status,
        coverPhoto,
        itinerary: form.itinerary.filter((s) => s.activity.trim()),
        activities,
        included: form.included.filter((s) => s.trim()),
      });
      onSave();
    } catch (err) {
      setSubmitError({ err, fallbackKey: 'errSaveTrip' });
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => { setErrors({}); setSubmitError(null); onClose(); };

  const errorBanner = submitError && (
    <div role="alert" className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">
      <AlertCircle size={16} className="flex-shrink-0" />
      {getErrorMessage(submitError.err, t, submitError.fallbackKey)}
    </div>
  );

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={t('editTrip')} size="lg">
      {loading || !form ? (
        submitError && !loading
          ? errorBanner
          : <div className="flex items-center justify-center py-16 text-sm text-gray-400">{t('loading')}</div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Cover Image */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">{t('coverImage')}</label>
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
                <span className="text-sm text-gray-500">{t('clickToUpload')}</span>
                <span className="text-xs text-gray-400 mt-1">{t('uploadHint')}</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleImage} />
              </label>
            )}
          </div>

          {/* Title EN / AR */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">
                {t('titleEn')} <span className="text-red-500">*</span>
              </label>
              <input type="text" value={form.titleEn} onChange={(e) => set('titleEn', e.target.value)}
                placeholder="e.g. Old Jeddah Walking Tour" dir="ltr"
                className={`w-full px-3 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 ${errors.titleEn ? 'border-red-300 bg-red-50' : 'border-gray-200'}`} />
              {errors.titleEn && <p className="text-xs text-red-500 mt-1">{errors.titleEn}</p>}
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">{t('titleAr')}</label>
              <input type="text" value={form.titleAr} onChange={(e) => set('titleAr', e.target.value)}
                placeholder="مثال: جولة جدة القديمة" dir="rtl"
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" />
            </div>
          </div>

          {/* City + Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">
                {t('city')} <span className="text-red-500">*</span>
              </label>
              <input type="text" value={form.city} onChange={(e) => set('city', e.target.value)}
                placeholder="e.g. Riyadh" dir="ltr"
                className={`w-full px-3 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 ${errors.city ? 'border-red-300 bg-red-50' : 'border-gray-200'}`} />
              {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city}</p>}
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">{t('status')}</label>
              <select value={form.status} onChange={(e) => set('status', e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 text-gray-700">
                {TOUR_STATUSES.map((st) => (
                  <option key={st} value={st}>{t(st)}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Price Adult + Child */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">
                {t('priceAdultSar')} <span className="text-red-500">*</span>
              </label>
              <input type="number" min="0" value={form.priceAdult}
                onChange={(e) => set('priceAdult', e.target.value)}
                placeholder="250"
                className={`w-full px-3 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 ${errors.priceAdult ? 'border-red-300 bg-red-50' : 'border-gray-200'}`} />
              {errors.priceAdult && <p className="text-xs text-red-500 mt-1">{errors.priceAdult}</p>}
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">{t('priceChildSar')}</label>
              <input type="number" min="0" value={form.priceChild}
                onChange={(e) => set('priceChild', e.target.value)}
                placeholder="150"
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" />
            </div>
          </div>

          {/* Meeting Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">{t('meetingTime')}</label>
              <input type="text" value={form.meetingTime}
                onChange={(e) => set('meetingTime', e.target.value)}
                placeholder="e.g. 09:00 AM" dir="ltr"
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" />
            </div>
          </div>

          {/* Meeting Location EN / AR */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">{t('meetingLocationEn')}</label>
              <input type="text" value={form.meetingLocationEn}
                onChange={(e) => set('meetingLocationEn', e.target.value)}
                placeholder="e.g. Al Balad Gate, Jeddah" dir="ltr"
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">{t('meetingLocationAr')}</label>
              <input type="text" value={form.meetingLocationAr}
                onChange={(e) => set('meetingLocationAr', e.target.value)}
                placeholder="مثال: بوابة البلد، جدة" dir="rtl"
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" />
            </div>
          </div>

          {/* Description EN / AR */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">
              {t('descriptionEn')} <span className="text-red-500">*</span>
            </label>
            <textarea value={form.descriptionEn} onChange={(e) => set('descriptionEn', e.target.value)}
              placeholder="Describe what makes this tour special…" rows={3} dir="ltr"
              className={`w-full px-3 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none ${errors.descriptionEn ? 'border-red-300 bg-red-50' : 'border-gray-200'}`} />
            {errors.descriptionEn && <p className="text-xs text-red-500 mt-1">{errors.descriptionEn}</p>}
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1.5">{t('descriptionAr')}</label>
            <textarea value={form.descriptionAr} onChange={(e) => set('descriptionAr', e.target.value)}
              placeholder="صف ما يميز هذه الجولة…" rows={3} dir="rtl"
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none" />
          </div>

          {/* ── Itinerary ─────────────────────────────────────────────────── */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-semibold text-gray-800">{t('itinerary')}</label>
              <button type="button" onClick={addItinerary}
                className="flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80">
                <Plus size={14} /> {t('addStop')}
              </button>
            </div>
            {form.itinerary.length === 0 && (
              <p className="text-xs text-gray-400 italic">{t('noItinerary')}</p>
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
                    placeholder={t('activityDescription')} dir="auto"
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
              <label className="text-sm font-semibold text-gray-800">{t('activities')}</label>
              <button type="button" onClick={addActivity}
                className="flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80">
                <Plus size={14} /> {t('addActivity')}
              </button>
            </div>
            {form.activities.length === 0 && (
              <p className="text-xs text-gray-400 italic">{t('noActivities')}</p>
            )}
            <div className="space-y-4">
              {form.activities.map((item, i) => (
                <div key={i} className="border border-gray-100 rounded-xl p-4 space-y-3 bg-gray-50/50">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{t('activity')} {i + 1}</span>
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
                      <span className="text-sm text-gray-400">{t('uploadActivityImage')}</span>
                      <input type="file" accept="image/*" className="hidden"
                        onChange={(e) => handleActivityImage(i, e.target.files[0])} />
                    </label>
                  )}

                  <div className="grid grid-cols-2 gap-3">
                    <input type="text" value={item.title}
                      onChange={(e) => updateActivity(i, 'title', e.target.value)}
                      placeholder={t('activityTitle')} dir="auto"
                      className="px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white" />
                    <input type="text" value={item.duration || ''}
                      onChange={(e) => updateActivity(i, 'duration', e.target.value)}
                      placeholder={t('durationPlaceholder')} dir="auto"
                      className="px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white" />
                  </div>
                  <input type="text" value={item.location || ''}
                    onChange={(e) => updateActivity(i, 'location', e.target.value)}
                    placeholder={t('locationPlaceholder')} dir="auto"
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white" />
                  <textarea value={item.description || ''}
                    onChange={(e) => updateActivity(i, 'description', e.target.value)}
                    placeholder={t('activityDescPlaceholder')} dir="auto"
                    rows={2}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none bg-white" />
                </div>
              ))}
            </div>
          </div>

          {/* ── What's Included ───────────────────────────────────────────── */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-semibold text-gray-800">{t('whatsIncluded')}</label>
              <button type="button" onClick={addIncluded}
                className="flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80">
                <Plus size={14} /> {t('addItem')}
              </button>
            </div>
            {form.included.length === 0 && (
              <p className="text-xs text-gray-400 italic">{t('noInclusions')}</p>
            )}
            <div className="space-y-2">
              {form.included.map((item, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <input type="text" value={item}
                    onChange={(e) => updateIncluded(i, e.target.value)}
                    placeholder={t('includedPlaceholder')} dir="auto"
                    className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20" />
                  <button type="button" onClick={() => removeIncluded(i)}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {errorBanner}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={handleClose}
              className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
              {t('cancel')}
            </button>
            <button type="submit" disabled={saving}
              className="flex-1 py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary/90 disabled:opacity-60 transition-colors">
              {saving ? t('saving') : t('save')}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
}
