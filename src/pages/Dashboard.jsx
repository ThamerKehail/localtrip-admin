import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Loader2, RefreshCw } from 'lucide-react';
import statEarnings from '../assets/icons/stat-earnings.svg';
import statBookings from '../assets/icons/stat-bookings.svg';
import statCustomers from '../assets/icons/stat-customers.svg';
import statGuides from '../assets/icons/stat-guides.svg';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
} from 'recharts';
import { fetchStats } from '../services/admin.service';
import { useLang } from '../context/LanguageContext';

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

const MOCK_CHART = [
  { month: 'Jul', value: 8000 },
  { month: 'Aug', value: 12000 },
  { month: 'Sep', value: 9000 },
  { month: 'Oct', value: 15000 },
  { month: 'Nov', value: 11000 },
  { month: 'Dec', value: 24364 },
  { month: 'Jan', value: 18000 },
  { month: 'Feb', value: 13000 },
  { month: 'Mar', value: 16000 },
  { month: 'Apr', value: 10000 },
  { month: 'May', value: 14000 },
  { month: 'Jun', value: 19000 },
];

const statusClass = {
  pending:   { bg: 'bg-[#fd9a56]/20', text: 'text-[#fd9a56]', label: 'Under review' },
  active:    { bg: 'bg-green-100',     text: 'text-green-700', label: 'Active' },
  rejected:  { bg: 'bg-red-100',       text: 'text-red-600',   label: 'Rejected' },
  suspended: { bg: 'bg-gray-100',      text: 'text-gray-600',  label: 'Suspended' },
};

function StatCard({ label, value, prefix, trend, trendLabel, iconSrc }) {
  const isUp = trend >= 0;
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
        {prefix && <span className="text-[#202224] text-[18px] font-bold">{prefix}</span>}
        <p className="text-[#202224] text-[28px] font-bold tracking-[1px]">{value}</p>
      </div>
      {/* Trend */}
      <div className="flex items-center gap-1">
        {isUp
          ? <TrendingUp size={20} className="text-[#00b69b]" />
          : <TrendingDown size={20} className="text-[#f93c65]" />}
        <span className={`text-[14px] font-semibold ${isUp ? 'text-[#00b69b]' : 'text-[#f93c65]'}`}>
          {Math.abs(trend)}%
        </span>
        <span className="text-[#606060] text-[14px]">{trendLabel}</span>
      </div>
    </div>
  );
}

function GuideRequestRow({ guide }) {
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
          {guide.user?.fullName || 'Guide name'}
        </p>
        <p className="text-[#4e637f] text-[15px]">
          {guide.user?.fullName || 'Ahmed Al-Saud'}
        </p>
      </div>
      {/* Location */}
      <div className="w-32 hidden md:block">
        <p className="text-[#232323] font-medium text-[16px]">Location</p>
        <p className="text-[#4e637f] text-[15px]">{guide.city || 'Riyadh, KSA'}</p>
      </div>
      {/* Request Date */}
      <div className="w-36 hidden lg:block">
        <p className="text-[#232323] font-medium text-[16px]">Request Date</p>
        <p className="text-[#4e637f] text-[15px]">
          {guide.createdAt ? new Date(guide.createdAt).toLocaleDateString('en-GB').replace(/\//g, '.') : '—'}
        </p>
      </div>
      {/* Status */}
      <div className="w-32 hidden lg:block">
        <p className="text-[#232323] font-medium text-[16px]">Status</p>
        <span className={`inline-block mt-1 px-2 py-0.5 rounded-[3px] text-[12px] font-semibold ${s.bg} ${s.text}`}>
          {s.label}
        </span>
      </div>
      {/* Action */}
      <a
        href="/guides"
        className="flex-shrink-0 border border-primary text-primary rounded-full px-4 py-1.5 text-[15px] font-medium hover:bg-primary hover:text-white transition-colors whitespace-nowrap"
      >
        Review request
      </a>
    </div>
  );
}

export default function Dashboard() {
  const { t } = useLang();
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
        setErr(e?.response?.data?.message || e.message || t('failedToLoad'));
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
          Retry
        </button>
      </div>
    );
  }

  const stats = data?.stats ?? EMPTY_STATS;
  const pendingGuides = data?.recentGuides ?? [];

  const statCards = [
    {
      label: 'Total Earnings',
      value: Number(stats.totalRevenue).toLocaleString(),
      prefix: '﷼',
      trend: 8.5,
      trendLabel: 'Up from yesterday',
      iconSrc: statEarnings,
    },
    {
      label: 'Total Bookings',
      value: Number(stats.totalBookings).toLocaleString(),
      trend: 1.3,
      trendLabel: 'Up from past week',
      iconSrc: statBookings,
    },
    {
      label: 'Total Customers',
      value: Number(stats.totalCustomers ?? stats.totalUsers ?? 0).toLocaleString(),
      trend: 1.8,
      trendLabel: 'Up from yesterday',
      iconSrc: statCustomers,
    },
    {
      label: 'Total Guides',
      value: Number(stats.totalGuides ?? stats.activeGuides ?? 0).toLocaleString(),
      trend: -4.3,
      trendLabel: 'Down from yesterday',
      iconSrc: statGuides,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-[32px] font-bold text-[#202224] tracking-[-0.1px]">Dashboard</h1>
        <div className="flex items-center gap-2">
          <span className="text-[12px] text-[#2b3034]/40 font-medium">View :</span>
          <button className="bg-[#fcfdfd] border border-[#d5d5d5] rounded px-4 py-2 text-[12px] text-[#4e637f] font-semibold flex items-center gap-1">
            Default analytics
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 3.5L5 6.5L8 3.5" stroke="#4e637f" strokeWidth="1.5" strokeLinecap="round"/></svg>
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="flex gap-6">
        {statCards.map((card) => (
          <StatCard key={card.label} {...card} />
        ))}
      </div>

      {/* Revenue Forecast Chart */}
      <div className="bg-white rounded-[14px] shadow-[6px_6px_54px_0px_rgba(0,0,0,0.05)] p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[24px] font-bold text-[#202224]">Revenue forecast</h2>
          <button className="bg-[#fcfdfd] border border-[#d5d5d5] rounded px-4 py-1.5 text-[12px] text-[#2b3034]/40 font-semibold flex items-center gap-1">
            All Year
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 3.5L5 6.5L8 3.5" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round"/></svg>
          </button>
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={MOCK_CHART} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#5A41A9" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#5A41A9" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 12, fill: 'rgba(43,48,52,0.4)', fontFamily: 'Inter' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tickFormatter={(v) => `${v / 1000}k`}
              tick={{ fontSize: 12, fill: 'rgba(43,48,52,0.4)', fontFamily: 'Inter' }}
              axisLine={false}
              tickLine={false}
              width={35}
            />
            <Tooltip
              formatter={(v) => [`${v.toLocaleString()} SAR`, 'Revenue']}
              contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 24px rgba(0,0,0,0.1)' }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#5A41A9"
              strokeWidth={2}
              fill="url(#revenueGradient)"
              dot={{ fill: '#5A41A9', r: 4, strokeWidth: 2, stroke: '#fff' }}
              activeDot={{ r: 6 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Tour Guide Requests */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-[24px] font-bold text-[#202224]">Tour Guide Requests</h2>
          <button className="bg-[#fcfdfd] border border-[#d5d5d5] rounded px-4 py-1.5 text-[12px] text-[#2b3034] font-medium flex items-center gap-1">
            All Requests
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 3.5L5 6.5L8 3.5" stroke="#2b3034" strokeWidth="1.5" strokeLinecap="round"/></svg>
          </button>
        </div>

        {pendingGuides.length === 0 ? (
          <div className="bg-white rounded-[20px] flex items-center justify-center py-12 text-center">
            <div>
              <p className="text-sm font-medium text-gray-600">No pending guide requests</p>
              <p className="text-xs text-gray-400 mt-1">New guide applications will appear here</p>
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
