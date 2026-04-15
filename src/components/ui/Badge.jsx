const variants = {
  published: 'bg-green-100 text-green-700',
  draft: 'bg-gray-100 text-gray-500',
  active: 'bg-green-100 text-green-700',
  inactive: 'bg-gray-100 text-gray-500',
  pending: 'bg-yellow-100 text-yellow-700',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-600',
  confirmed: 'bg-blue-100 text-blue-700',
  cancelled: 'bg-red-100 text-red-600',
  completed: 'bg-purple-100 text-purple-700',
};

export default function Badge({ status, label }) {
  const cls = variants[status?.toLowerCase()] || 'bg-gray-100 text-gray-500';
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${cls}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-70" />
      {label || status}
    </span>
  );
}
