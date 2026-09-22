import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, RefreshCw, BarChart3 } from 'lucide-react';
import statEarnings from '../assets/icons/stat-earnings.svg';
import statBookings from '../assets/icons/stat-bookings.svg';
import statCustomers from '../assets/icons/stat-customers.svg';
import statGuides from '../assets/icons/stat-guides.svg';
import { fetchStats } from '../services/admin.service';
import { useLang } from '../context/LanguageContext';
import { formatSAR, formatNumber, formatDate } from '../utils/format';
import { getErrorMessage } from '../utils/errors';

const EMPTY_STATS = {
  totalBookings: 0,
  totalCustomers: 0,
  activeGuides: 0,
  pendingGuides: 0,
  totalDestinations: 0,
  totalRevenue: 0,
  avgRating: '0.0',
  totalGuides: 0,
};

const statusClass = {
  pending:   { bg: 'bg-[#fd9a56]/20', text: 'text-[#fd9a56]', labelKey: 'underReview' },
  active:    { bg: 'bg-green-100',     text: 'text-green-700', labelKey: 'active' },
  rejected:  { bg: 'bg-red-100',       text: 'text-red-600',   labelKey: 'rejected' },
  suspended: { bg: 'bg-gray-100',      text: 'text-gray-600',  labelKey: 'suspended' },
};

// No trend row: /admin/stats returns totals only (no period comparison),
// so trend percentages would be fabricated.
function StatCard({ label, value, iconSrc }) {
  return (
    <div className="bg-white rounded-[14px] shadow-[6px_6px_54px_0px_rgba(0,0,0,0.05)] p-4 flex flex-col justify-between h-[161px] flex-1 min-w-0 relative">
      {/* Icon */}
      <div className="absolute top-4 end-4 w-[60px] h-[60px] rounded-[24px] bg-primary flex items-center justify-center overflow-hidden">
        <img src={iconSrc} alt="" className="w-8 h-8 object-contain" />
      </div>
      {/* Label */}
      <p className="text-[#202224] text-[16px] font-semibold opacity-70 mt-1">{label}</p>
      {/* Value */}
      <div className="flex items-baseline gap-1">
        <p className="text-[#202224] text-[28px] font-bold tracking-[1px]">{value}</p>
      </div>
    </div>
  );
}

function GuideRequestRow({ guide }) {
  const { t, lang } = useLang();
  const s = statusClass[guide.status] || statusClass.pending;
  return (
    <div className="bg-white rounded-[20px] flex items-center px-6 py-4 gap-4">
      {/* Avatar */}
      <div className="w-[60px] h-[60px] rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
        {guide.user?.avatar
          ? <img src={guide.user.avatar} alt="" className="w-full h-full rounded-full object-cover" />
          : <span className="text-primary font-bold text-lg">
              {guide.user?.fullName?.charAt(0) || 'G'}
            </span>
        }
      </div>
      {/* Name */}
      <div className="flex-1 min-w-0">
        <p className="text-[#232323] font-medium text-[16px]">
          <bdi>{guide.user?.fullName || '—'}</bdi>
        </p>
        <p className="text-[#4e637f] text-[15px] truncate">
          <bdi>{guide.user?.email || ''}</bdi>
        </p>
      </div>
      {/* Location */}
      <div className="w-32 hidden md:block">
        <p className="text-[#232323] font-medium text-[16px]">{t('location')}</p>
        <p className="text-[#4e637f] text-[15px]"><bdi>{guide.operatingCity || '—'}</bdi></p>
      </div>
      {/* Request Date */}
      <div className="w-36 hidden lg:block">
        <p className="text-[#232323] font-medium text-[16px]">{t('requestDate')}</p>
        <p className="text-[#4e637f] text-[15px]">
          {formatDate(guide.createdAt, lang)}
        </p>
      </div>
      {/* Status */}
      <div className="w-32 hidden lg:block">
        <p className="text-[#232323] font-medium text-[16px]">{t('status')}</p>
        <span className={`inline-block mt-1 px-2 py-0.5 rounded-[3px] text-[12px] font-semibold ${s.bg} ${s.text}`}>
          {t(s.labelKey)}
        </span>
      </div>
      {/* Action */}
      <Link
        to="/guides"
        className="flex-shrink-0 border border-primary text-primary rounded-full px-4 py-1.5 text-[15px] font-medium hover:bg-primary hover:text-white transition-colors whitespace-nowrap"
      >
        {t('reviewRequest')}
      </Link>
    </div>
  );
}

export default function Dashboard() {
  const { t, lang } = useLang();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  const load = () => {
    setLoading(true);
    setErr('');
    fetchStats()
      .then(setData)
      .catch((e) => {
        console.error('Dashboard error:', e);
        setErr(getErrorMessage(e, t, 'failedToLoad'));
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-40">
        <Loader2 size={28} className="animate-spin text-primary" />
      </div>
    );
  }

  if (err) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-4">
        <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center">
          <span className="text-2xl">⚠️</span>
        </div>
        <p className="text-sm font-medium text-gray-700">{err}</p>
        <button
          onClick={load}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary-600 transition-colors"
        >
          <RefreshCw size={14} />
          {t('retry')}
        </button>
      </div>
    );
  }

  const stats = data?.stats ?? EMPTY_STATS;
  const pendingGuides = data?.recentGuides ?? [];

  const statCards = [
    {
      label: t('totalEarnings'),
      value: formatSAR(stats.totalRevenue ?? 0, lang),
      iconSrc: statEarnings,
    },
    {
      label: t('totalBookings'),
      value: formatNumber(stats.totalBookings, lang),
      iconSrc: statBookings,
    },
    {
      label: t('totalCustomers'),
      value: formatNumber(stats.totalCustomers ?? stats.totalUsers ?? 0, lang),
      iconSrc: statCustomers,
    },
    {
      label: t('totalGuides'),
      value: formatNumber(stats.totalGuides ?? stats.activeGuides ?? 0, lang),
      iconSrc: statGuides,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-[32px] font-bold text-[#202224] tracking-[-0.1px]">{t('dashboard')}</h1>
      </div>

      {/* Stat Cards */}
      <div className="flex gap-6">
        {statCards.map((card) => (
          <StatCard key={card.label} {...card} />
        ))}
      </div>

      {/* Revenue analytics — no time-series endpoint exists yet, so no chart is shown */}
      <div className="bg-white rounded-[14px] shadow-[6px_6px_54px_0px_rgba(0,0,0,0.05)] p-6">
        <h2 className="text-[24px] font-bold text-[#202224] mb-4">{t('revenueOverTime')}</h2>
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center mb-3">
            <BarChart3 size={22} className="text-gray-400" />
          </div>
          <p className="text-sm font-medium text-gray-600">{t('analyticsUnavailable')}</p>
          <p className="text-xs text-gray-400 mt-1">{t('analyticsUnavailableDesc')}</p>
        </div>
      </div>

      {/* Tour Guide Requests */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-[24px] font-bold text-[#202224]">{t('guideRequests')}</h2>
          <Link to="/guides" className="bg-[#fcfdfd] border border-[#d5d5d5] rounded px-4 py-1.5 text-[12px] text-[#2b3034] font-medium hover:bg-gray-50">
            {t('viewAll')}
          </Link>
        </div>

        {pendingGuides.length === 0 ? (
          <div className="bg-white rounded-[20px] flex items-center justify-center py-12 text-center">
            <div>
              <p className="text-sm font-medium text-gray-600">{t('noPendingGuideRequests')}</p>
              <p className="text-xs text-gray-400 mt-1">{t('noPendingGuideRequestsDesc')}</p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {pendingGuides.map((g) => (
              <GuideRequestRow key={g.id} guide={g} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
