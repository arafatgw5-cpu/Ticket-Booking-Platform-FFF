'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { FaBus } from "react-icons/fa";
import { signIn } from "@/lib/auth-client";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    try {
      const res = await signIn.email({
        email,
        password,
      });

      if (res?.error) {
        setErrorMsg(res.error.message || "Invalid email or password.");
        return;
      }

      router.push("/dashboard");
    } catch (err) {
      setErrorMsg("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setErrorMsg("");

    try {
      await signIn.social({
        provider: "google",
        callbackURL: "/dashboard",
      });
    } catch (err) {
      setErrorMsg("Google login failed. Please try again.");
    }
  };


  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors duration-500">

      {/* Background Ornaments */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-blue-500/20 dark:bg-blue-600/10 blur-3xl transition-colors duration-500" />
        <div className="absolute right-0 top-1/3 h-96 w-96 rounded-full bg-indigo-500/20 dark:bg-indigo-600/10 blur-3xl transition-colors duration-500" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-purple-500/10 dark:bg-purple-600/10 blur-3xl transition-colors duration-500" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl items-center px-6 py-10">
        <div className="grid w-full grid-cols-1 gap-12 lg:grid-cols-2">

          {/* LEFT SIDE - Branding & Info */}
          <div className="hidden lg:flex flex-col justify-center animate-fadeIn">
            <div className="max-w-xl">

              <Link href="/" className="inline-flex items-center gap-3 rounded-full bg-white dark:bg-slate-900 px-5 py-3 shadow-sm border border-slate-200 dark:border-slate-800 hover:scale-105 transition-transform duration-300">
                <FaBus className="text-xl text-blue-600 dark:text-blue-500" />
                <span className="font-bold text-slate-900 dark:text-white tracking-wide">
                  TicketBari
                </span>
              </Link>

              <h1 className="mt-8 text-5xl lg:text-7xl font-extrabold leading-tight text-slate-900 dark:text-white tracking-tight">
                Welcome
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-cyan-400">Back</span>
              </h1>

              <p className="mt-6 text-lg leading-relaxed text-slate-600 dark:text-slate-400">
                Sign in to access your bookings, manage trips,
                download tickets and enjoy a seamless travel experience.
              </p>

              <div className="mt-10 space-y-4">
                <div className="rounded-2xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-md p-5 shadow-sm border border-slate-200 dark:border-slate-800 font-medium text-slate-700 dark:text-slate-300 flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-blue-500"></div> Manage Bookings Easily</div>
                <div className="rounded-2xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-md p-5 shadow-sm border border-slate-200 dark:border-slate-800 font-medium text-slate-700 dark:text-slate-300 flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-indigo-500"></div> Instant Ticket Access</div>
                <div className="rounded-2xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-md p-5 shadow-sm border border-slate-200 dark:border-slate-800 font-medium text-slate-700 dark:text-slate-300 flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-purple-500"></div> Secure Payment Records</div>
              </div>

            </div>
          </div>

          {/* RIGHT SIDE - Login Form */}
          <div className="flex items-center justify-center animate-fadeIn delay-100">
            <div className="w-full max-w-md rounded-[2rem] border border-white/60 dark:border-slate-800/60 bg-white/80 dark:bg-slate-900/80 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.2)] backdrop-blur-xl">

              {/* Logo */}
              <div className="mb-8 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-[0_0_20px_rgba(79,70,229,0.3)]">
                  <FaBus className="text-3xl" />
                </div>

                <h2 className="mt-5 text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Sign In
                </h2>

                <p className="mt-2 text-slate-500 dark:text-slate-400">
                  Welcome back to TicketBari
                </p>
              </div>

              {/* Error Message */}
              {errorMsg && (
                <div className="mb-5 rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/20 p-3 text-sm text-red-600 dark:text-red-400">
                  {errorMsg}
                </div>
              )}

              {/* Google Login Button */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="mb-6 flex h-14 w-full items-center justify-center gap-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold text-slate-700 dark:text-slate-300 transition-all hover:scale-[1.02] hover:bg-slate-50 dark:hover:bg-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <FcGoogle className="text-xl" />
                Continue with Google
              </button>

              {/* Divider */}
              <div className="my-6 flex items-center gap-4">
                <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  OR
                </span>
                <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
              </div>

              {/* Email Login Form */}
              <form onSubmit={handleEmailLogin} className="space-y-5">

                {/* Email Input */}
                <div>
                  <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Email Address <span className="text-blue-500">*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="you@example.com"
                    className="h-14 w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 text-slate-900 dark:text-white outline-none transition-all placeholder:text-slate-400 focus:border-blue-600 dark:focus:border-blue-500 focus:ring-1 focus:ring-blue-600 dark:focus:ring-blue-500"
                  />
                </div>

                {/* Password Input */}
                <div>
                  <label htmlFor="password" className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Password <span className="text-blue-500">*</span>
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="h-14 w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 text-slate-900 dark:text-white outline-none transition-all placeholder:text-slate-400 focus:border-blue-600 dark:focus:border-blue-500 focus:ring-1 focus:ring-blue-600 dark:focus:ring-blue-500"
                  />
                </div>

                {/* Checkbox and Forgot Password */}
                <div className="flex items-center justify-between pt-1">
                  <label className="flex cursor-pointer items-center gap-2">
                    <input 
                      type="checkbox" 
                      className="h-4 w-4 rounded border-slate-300 dark:border-slate-600 text-blue-600 focus:ring-blue-600 dark:bg-slate-800" 
                    />
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      Remember me
                    </span>
                  </label>

                  <Link href="/forgot-password" className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
                    Forgot Password?
                  </Link>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="relative flex h-14 w-full items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-base font-bold text-white shadow-lg shadow-blue-500/30 transition-all hover:shadow-blue-500/50 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 dark:focus:ring-offset-slate-900 disabled:cursor-not-allowed disabled:opacity-70 disabled:transform-none"
                >
                  {isLoading ? (
                    <>
                      <svg className="mr-2 h-5 w-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing In...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </button>

              </form>

              {/* Footer */}
              <p className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
                Don&apos;t have an account?{" "}
                <Link href="/register" className="font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
                  Create Account
                </Link>
              </p>

            </div>
          </div>

        </div>
      </div>
    </main>
  );
}