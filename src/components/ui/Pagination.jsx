import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLang } from '../../context/LanguageContext';
import { formatNumber } from '../../utils/format';

export default function Pagination({ page, pages, total, limit, onPageChange }) {
  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);
  const { t, lang } = useLang();

  return (
    <div className="flex items-center justify-between px-1 py-3">
      <p className="text-sm text-gray-500">
        {t('showing')} <span className="font-medium text-gray-700" dir="ltr">{from}–{to}</span> {t('of')}{' '}
        <span className="font-medium text-gray-700">{formatNumber(total, lang)}</span>
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft size={16} className="text-gray-600 rtl:rotate-180" />
        </button>
        {Array.from({ length: Math.min(pages, 5) }, (_, i) => {
          const p = i + 1;
          return (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                p === page
                  ? 'bg-primary text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {p}
            </button>
          );
        })}
        {pages > 5 && <span className="text-gray-400 px-1">...</span>}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === pages}
          className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight size={16} className="text-gray-600 rtl:rotate-180" />
        </button>
      </div>
    </div>
  );
}
