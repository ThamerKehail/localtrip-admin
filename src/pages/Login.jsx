import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LanguageContext';
import logoIcon from '../assets/logo-icon.png';
import logoText from '../assets/logo-text.png';

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

        {/* Card — matches Figma: white, rounded-3xl, border, shadow */}
        <div className="bg-white rounded-[25px] border border-[#b9b9b9] shadow-lg px-12 py-16 flex flex-col items-center gap-8">

          {/* Logo — text left + icon right (matches Figma layout) */}
          <div className="flex items-center gap-3">
            <img src={logoText} alt="Local Trip" className="h-[54px] w-auto" />
            <img src={logoIcon} alt="Logo" className="h-[98px] w-auto" />
          </div>

          {/* Title */}
          <h1 className="text-[28px] font-bold text-[#202224] text-center leading-tight tracking-tight">
            {lang === 'ar' ? 'لوحة التحكم الأساسية' : 'Admin Dashboard'}
          </h1>

          {/* Form */}
          <form onSubmit={handleSubmit} className="w-full space-y-4">

            {/* Error */}
            {authError && (
              <div className="flex items-center gap-2.5 p-3.5 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">
                <AlertCircle size={16} className="flex-shrink-0" />
                {authError}
              </div>
            )}

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[#1f1f1f] text-end">
                {t('emailAddress')}
              </label>
              <div className="flex items-center border border-[#d0d5dd] rounded-lg px-4 py-3 bg-white gap-2">
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => set('email', e.target.value)}
                  placeholder="name@example.com"
                  required
                  autoComplete="email"
                  className="flex-1 text-sm outline-none text-gray-800 placeholder:text-[#b8b8b8] text-end bg-transparent"
                  dir="auto"
                />
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#95979D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                </svg>
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[#1f1f1f] text-end">
                {t('password')}
              </label>
              <div className="flex items-center border border-[#d0d5dd] rounded-lg px-4 py-3 bg-white gap-2">
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="text-[#95979D] hover:text-gray-600 transition-colors flex-shrink-0"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => set('password', e.target.value)}
                  placeholder={lang === 'ar' ? 'أدخل كلمة المرور الخاصة بك' : 'Enter your password'}
                  required
                  autoComplete="current-password"
                  className="flex-1 text-sm outline-none text-gray-800 placeholder:text-[#b8b8b8] text-end bg-transparent"
                  dir="auto"
                />
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#95979D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </div>
            </div>

            {/* Forgot password */}
            <div className="flex justify-end">
              <button type="button" className="text-sm text-primary underline underline-offset-2 hover:opacity-80 transition-opacity">
                {lang === 'ar' ? 'نسيت كلمة المرور؟' : 'Forgot password?'}
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !form.email || !form.password}
              className="w-full py-3.5 bg-primary text-white rounded-full text-base font-bold hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {t('signingIn')}
                </span>
              ) : (
                lang === 'ar' ? 'تسجيل الدخول' : t('signIn')
              )}
            </button>
          </form>

          {/* Language toggle */}
          <button
            onClick={toggle}
            className="text-xs font-medium text-primary border border-primary/30 px-4 py-1.5 rounded-xl hover:bg-primary/5 transition-colors"
          >
            {lang === 'en' ? 'العربية' : 'English'}
          </button>
        </div>

        <p className="text-center text-xs text-gray-400 mt-5">
          {t('authorizedOnly')}
        </p>
      </div>
    </div>
  );
}
