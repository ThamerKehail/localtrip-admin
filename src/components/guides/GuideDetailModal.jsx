import { CheckCircle, XCircle, Star, MapPin, Globe, Award, Clock, Ban, AlertCircle, FileText, ExternalLink } from 'lucide-react';
import Modal from '../ui/Modal';
import Badge from '../ui/Badge';
import { useLang } from '../../context/LanguageContext';
import { formatDate } from '../../utils/format';

const initials = (name = '') => name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
const isImageUrl = (url = '') => /\.(jpe?g|png|webp|gif|bmp|heic)(\?|$)/i.test(url);

export default function GuideDetailModal({ guide, onClose, onApprove, onReject, onSuspend, onReactivate, loading, error }) {
  const { t, lang } = useLang();
  const specializations = Array.isArray(guide.specializations) ? guide.specializations : [];
  const languages = Array.isArray(guide.languages) ? guide.languages : [];

  return (
    <Modal isOpen={!!guide} onClose={onClose} title={t('guideApplication')} size="lg">
      <div className="space-y-5">
        {/* Profile Header */}
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary font-bold text-xl flex items-center justify-center flex-shrink-0">
            {initials(guide.name)}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h3 className="text-lg font-bold text-gray-900"><bdi>{guide.name}</bdi></h3>
              <Badge status={guide.status} />
            </div>
            <p className="text-sm text-gray-500 mt-0.5">
              <bdi>{guide.email}</bdi>{guide.phone && <> · <bdi dir="ltr">{guide.phone}</bdi></>}
            </p>
            <div className="flex items-center gap-3 mt-2 text-sm text-gray-500 flex-wrap">
              <span className="flex items-center gap-1"><MapPin size={13} /><bdi>{guide.city || '—'}</bdi></span>
              <span className="flex items-center gap-1"><Clock size={13} />{guide.experienceYears || 0} {t('yearsExp')}</span>
              {guide.rating > 0 && (
                <span className="flex items-center gap-1">
                  <Star size={13} className="text-yellow-400 fill-yellow-400" />
                  {Number(guide.rating).toFixed(1)} ({guide.totalReviews || 0} {t('reviews')})
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Bio */}
        <div className="bg-gray-50 rounded-xl p-4">
          <p className="text-sm font-medium text-gray-700 mb-1">{t('bio')}</p>
          <p className="text-sm text-gray-600" dir="auto">{guide.bio || '—'}</p>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-4">
          {/* Specializations */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">{t('specializations')}</p>
            <div className="flex flex-wrap gap-1.5">
              {specializations.length === 0 && <span className="text-xs text-gray-400">—</span>}
              {specializations.map((s) => (
                <span key={s} className="px-2.5 py-1 bg-primary/10 text-primary rounded-lg text-xs font-medium"><bdi>{s}</bdi></span>
              ))}
            </div>
          </div>

          {/* Languages */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">{t('languages')}</p>
            <div className="flex flex-wrap gap-1.5">
              {languages.length === 0 && <span className="text-xs text-gray-400">—</span>}
              {languages.map((l) => (
                <span key={l} className="flex items-center gap-1 px-2.5 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-medium">
                  <Globe size={11} /><bdi>{l}</bdi>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* License */}
        <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Award size={16} className="text-amber-600" />
            <p className="text-sm font-semibold text-amber-800">{t('licenseInfo')}</p>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-xs text-amber-600 mb-0.5">{t('licenseNumber')}</p>
              <p className="font-mono font-medium text-gray-800" dir="ltr">{guide.licenseNumber || '—'}</p>
            </div>
            <div>
              <p className="text-xs text-amber-600 mb-0.5">{t('expiryDate')}</p>
              <p className="font-medium text-gray-800">{formatDate(guide.licenseExpiry, lang)}</p>
            </div>
          </div>

          {/* Uploaded license document */}
          <div className="mt-3 pt-3 border-t border-amber-100">
            <p className="text-xs text-amber-600 mb-1.5">{t('licenseDocument')}</p>
            {guide.licenseImage ? (
              isImageUrl(guide.licenseImage) ? (
                <a href={guide.licenseImage} target="_blank" rel="noopener noreferrer" className="inline-block group">
                  <img
                    src={guide.licenseImage}
                    alt={t('licenseDocument')}
                    className="max-h-44 rounded-lg border border-amber-200 object-contain bg-white group-hover:opacity-90 transition-opacity"
                  />
                  <span className="mt-1 flex items-center gap-1 text-xs font-medium text-amber-700">
                    <ExternalLink size={12} /> {t('openFullSize')}
                  </span>
                </a>
              ) : (
                <a
                  href={guide.licenseImage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-2 bg-white border border-amber-200 rounded-lg text-sm font-medium text-amber-700 hover:bg-amber-50 transition-colors"
                >
                  <FileText size={15} /> {t('viewLicenseDocument')}
                  <ExternalLink size={13} className="text-amber-400" />
                </a>
              )
            ) : (
              <p className="text-sm text-gray-400">{t('noDocumentUploaded')}</p>
            )}
          </div>
        </div>

        {/* Submission date */}
        <p className="text-xs text-gray-400">{t('submittedOn')} {formatDate(guide.createdAt, lang)}</p>

        {error && (
          <div role="alert" className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">
            <AlertCircle size={16} className="flex-shrink-0" />
            {error}
          </div>
        )}

        {/* Actions */}
        {guide.status === 'pending' && (
          <div className="flex gap-3 pt-2 border-t border-gray-100">
            <button
              onClick={onReject}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-red-200 text-red-600 rounded-xl text-sm font-medium hover:bg-red-50 transition-colors disabled:opacity-50"
            >
              <XCircle size={15} />
              {t('reject')}
            </button>
            <button
              onClick={onApprove}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-green-500 text-white rounded-xl text-sm font-medium hover:bg-green-600 transition-colors disabled:opacity-50"
            >
              <CheckCircle size={15} />
              {t('approve')}
            </button>
          </div>
        )}
        {guide.status === 'active' && onSuspend && (
          <div className="flex gap-3 pt-2 border-t border-gray-100">
            <button
              onClick={onSuspend}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-slate-300 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors disabled:opacity-50"
            >
              <Ban size={15} />
              {t('suspend')}
            </button>
          </div>
        )}
        {guide.status === 'suspended' && onReactivate && (
          <div className="flex gap-3 pt-2 border-t border-gray-100">
            <button
              onClick={onReactivate}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-green-500 text-white rounded-xl text-sm font-medium hover:bg-green-600 transition-colors disabled:opacity-50"
            >
              <CheckCircle size={15} />
              {t('reactivate')}
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
}
