'use client';

import { useState } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const locale = pathname.split('/')[1] || 'en';
  const callbackUrl = searchParams.get('callbackUrl');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid email or password');
        setLoading(false);
      } else {
        // Fetch the session to get the user's role
        const response = await fetch('/api/auth/session');
        const session = await response.json();

        const role = session?.user?.role;
        const isAdminOrStaff = ['admin', 'super_admin', 'professional', 'research_staff'].includes(role);

        const redirectUrl = callbackUrl || (isAdminOrStaff ? `/${locale}/staff` : `/${locale}/dashboard`);
        window.location.href = redirectUrl;
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#5b2c6f] to-[#1a5276] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href={`/${locale}`} className="inline-block">
            <span className="text-4xl font-bold text-[#f4d03f]">ETA</span>
          </Link>
          <p className="text-white/80 mt-2">Empowering Transportation among Autistic adolescents</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-2xl font-bold text-[#1a5276] mb-6 text-center">Welcome Back</h1>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a5276] focus:border-transparent outline-none transition-all"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a5276] focus:border-transparent outline-none transition-all pr-12"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1a5276] hover:bg-[#154360] text-white py-3 rounded-lg font-medium transition-colors"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-gray-500">Demo Access</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setEmail('ryan.warren@aimsinnovations.com');
                  setPassword('ETA@Admin2024!');
                }}
                className="flex flex-col items-center justify-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <span className="text-sm font-medium text-[#1a5276]">Admin</span>
                <span className="text-xs text-gray-500">Full Access</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmail('staff@demo.com');
                  setPassword('DemoPass123!');
                }}
                className="flex flex-col items-center justify-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <span className="text-sm font-medium text-[#1a5276]">Staff</span>
                <span className="text-xs text-gray-500">Professional</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmail('parent@demo.com');
                  setPassword('DemoPass123!');
                }}
                className="flex flex-col items-center justify-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <span className="text-sm font-medium text-[#1a5276]">Parent</span>
                <span className="text-xs text-gray-500">Guardian</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmail('teen@demo.com');
                  setPassword('DemoPass123!');
                }}
                className="flex flex-col items-center justify-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <span className="text-sm font-medium text-[#1a5276]">Teen</span>
                <span className="text-xs text-gray-500">Participant</span>
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link href={`/${locale}/auth/register`} className="text-[#1a5276] font-medium hover:underline">
                Create Account
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-white/60 text-sm mt-6">
          A CHOP Research Initiative
        </p>
      </div>
    </div>
  );
}
