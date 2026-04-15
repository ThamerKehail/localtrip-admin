import { CheckCircle, XCircle, Star, MapPin, Globe, Award, Clock } from 'lucide-react';
import Modal from '../ui/Modal';
import Badge from '../ui/Badge';

const initials = (name) => name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();

export default function GuideDetailModal({ guide, onClose, onApprove, onReject }) {
  return (
    <Modal isOpen={!!guide} onClose={onClose} title="Guide Application" size="lg">
      <div className="space-y-5">
        {/* Profile Header */}
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary font-bold text-xl flex items-center justify-center flex-shrink-0">
            {initials(guide.name)}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h3 className="text-lg font-bold text-gray-900">{guide.name}</h3>
              <Badge status={guide.status} />
            </div>
            <p className="text-sm text-gray-500 mt-0.5">{guide.email} · {guide.phone}</p>
            <div className="flex items-center gap-3 mt-2 text-sm text-gray-500">
              <span className="flex items-center gap-1"><MapPin size={13} />{guide.city}</span>
              <span className="flex items-center gap-1"><Clock size={13} />{guide.experienceYears} years exp.</span>
              {guide.rating > 0 && (
                <span className="flex items-center gap-1">
                  <Star size={13} className="text-yellow-400 fill-yellow-400" />
                  {guide.rating} ({guide.reviews} reviews)
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Bio */}
        <div className="bg-gray-50 rounded-xl p-4">
          <p className="text-sm font-medium text-gray-700 mb-1">Bio</p>
          <p className="text-sm text-gray-600">{guide.bio}</p>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-4">
          {/* Specializations */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Specializations</p>
            <div className="flex flex-wrap gap-1.5">
              {guide.specializations.map((s) => (
                <span key={s} className="px-2.5 py-1 bg-primary/10 text-primary rounded-lg text-xs font-medium">{s}</span>
              ))}
            </div>
          </div>

          {/* Languages */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Languages</p>
            <div className="flex flex-wrap gap-1.5">
              {guide.languages.map((l) => (
                <span key={l} className="flex items-center gap-1 px-2.5 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-medium">
                  <Globe size={11} />{l}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* License */}
        <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Award size={16} className="text-amber-600" />
            <p className="text-sm font-semibold text-amber-800">License Information</p>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-xs text-amber-600 mb-0.5">License Number</p>
              <p className="font-mono font-medium text-gray-800">{guide.licenseNumber}</p>
            </div>
            <div>
              <p className="text-xs text-amber-600 mb-0.5">Expiry Date</p>
              <p className="font-medium text-gray-800">{guide.licenseExpiry}</p>
            </div>
          </div>
        </div>

        {/* Submission date */}
        <p className="text-xs text-gray-400">Submitted on {guide.submittedAt}</p>

        {/* Actions */}
        {guide.status === 'pending' && (
          <div className="flex gap-3 pt-2 border-t border-gray-100">
            <button
              onClick={onReject}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-red-200 text-red-600 rounded-xl text-sm font-medium hover:bg-red-50 transition-colors"
            >
              <XCircle size={15} />
              Reject
            </button>
            <button
              onClick={onApprove}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-green-500 text-white rounded-xl text-sm font-medium hover:bg-green-600 transition-colors"
            >
              <CheckCircle size={15} />
              Approve Guide
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
}
