import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, MapPin, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LanguageContext';

export default function Login() {
  const { login, loading, authError } = useAuth();
  const { t, toggle, lang } = useLang();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);

  const set = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ok = await login(form.email, form.password);
    if (ok) navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#F5F6FA] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-11 h-11 rounded-2xl bg-primary flex items-center justify-center shadow-lg">
            <MapPin size={20} className="text-white" strokeWidth={2} />
          </div>
          <div>
            <p className="text-xl font-bold text-gray-900 leading-tight">Local Trip</p>
            <p className="text-xs text-gray-400 uppercase tracking-widest">{t('admin')}</p>
          </div>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-card p-8">
          <div className="flex items-start justify-between mb-7">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">{t('welcomeBack')}</h1>
              <p className="text-sm text-gray-400">{t('signInToAdmin')}</p>
            </div>
            {/* Language toggle */}
            <button
              onClick={toggle}
              className="text-xs font-medium text-primary border border-primary/30 px-3 py-1.5 rounded-xl hover:bg-primary/5 transition-colors flex-shrink-0"
            >
              {lang === 'en' ? 'العربية' : 'English'}
            </button>
          </div>

          {authError && (
            <div className="flex items-center gap-2.5 p-3.5 mb-5 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">
              <AlertCircle size={16} className="flex-shrink-0" />
              {authError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">{t('emailAddress')}</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => set('email', e.target.value)}
                placeholder="admin@localtrip.sa"
                required
                autoComplete="email"
                className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary transition-colors placeholder:text-gray-300"
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1.5">{t('password')}</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => set('password', e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  className="w-full px-4 py-3 pe-11 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary transition-colors placeholder:text-gray-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute end-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !form.email || !form.password}
              className="w-full py-3 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors mt-2 shadow-sm"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {t('signingIn')}
                </span>
              ) : (
                t('signIn')
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">{t('authorizedOnly')}</p>
      </div>
    </div>
  );
}
