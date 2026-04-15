import { Construction } from 'lucide-react';
import { useLang } from '../context/LanguageContext';

export default function Placeholder({ name }) {
  const { t } = useLang();
  return (
    <div className="flex flex-col items-center justify-center py-32 text-center">
      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
        <Construction size={28} className="text-primary" />
      </div>
      <h3 className="text-lg font-semibold text-gray-800 mb-1">{name}</h3>
      <p className="text-sm text-gray-400">{t('comingSoon')}</p>
    </div>
  );
}
