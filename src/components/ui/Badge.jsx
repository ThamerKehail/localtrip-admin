import { useLang } from '../../context/LanguageContext';

const variants = {
  // Tours
  published: 'bg-green-100 text-green-700',
  draft: 'bg-gray-100 text-gray-500',
  paused: 'bg-orange-100 text-orange-700',
  inactive: 'bg-gray-100 text-gray-500',
  // Guides
  active: 'bg-green-100 text-green-700',
  pending: 'bg-yellow-100 text-yellow-700',
  rejected: 'bg-red-100 text-red-600',
  suspended: 'bg-slate-200 text-slate-700',
  // Bookings
  confirmed: 'bg-blue-100 text-blue-700',
  started: 'bg-indigo-100 text-indigo-700',
  completed: 'bg-purple-100 text-purple-700',
  declined: 'bg-rose-100 text-rose-700',
  cancelled: 'bg-red-100 text-red-600',
};

export default function Badge({ status, label }) {
  const { t } = useLang();
  const key = status?.toLowerCase();
  const cls = variants[key] || 'bg-gray-100 text-gray-500';
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${cls}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current me-1.5 opacity-70" />
      {label || (variants[key] ? t(key) : status)}
    </span>
  );
}
