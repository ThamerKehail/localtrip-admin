import { Inbox } from 'lucide-react';

export default function EmptyState({ title = 'No data found', description = '' }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
        <Inbox size={24} className="text-gray-400" />
      </div>
      <p className="text-gray-600 font-medium">{title}</p>
      {description && <p className="text-sm text-gray-400 mt-1 max-w-xs">{description}</p>}
    </div>
  );
}
