"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import { Mail, Lock, Loader2, ArrowRight, Search, ShieldCheck, MapPin } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res.error) {
        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: "Invalid email or password. Please try again.",
          confirmButtonColor: "#2563EB",
          timer: 3000,
        });
        setIsLoading(false);
        return;
      }

      Swal.fire({
        icon: "success",
        title: "Welcome Back!",
        text: "Redirecting you to the dashboard...",
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
      });

      setTimeout(() => {
        router.replace("/dashboard");
      }, 1500);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 relative overflow-hidden">
      {/* Background Decor similar to Hero */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] right-[10%] w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-40 animate-pulse"></div>
        <div className="absolute bottom-[10%] left-[10%] w-96 h-96 bg-purple-100 rounded-full blur-3xl opacity-40 animate-pulse"></div>
      </div>

      <div className="w-full max-w-5xl bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden flex flex-col lg:flex-row relative z-10">
        {/* Left Side - Form */}
        <div className="w-full lg:w-1/2 p-8 sm:p-12 lg:p-16 flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-sm mx-auto space-y-6"
          >
            <div className="text-left">
              <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
                Welcome back
              </h2>
              <p className="mt-2 text-gray-500 text-sm">
                Please enter your details to sign in.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <div className="space-y-5">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">Email Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                      <Mail className="h-5 w-5" />
                    </div>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                      placeholder="Enter your email address"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                      <Lock className="h-5 w-5" />
                    </div>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                      placeholder="Enter your password"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-600">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                    Forgot password?
                  </a>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg shadow-blue-500/30 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all transform hover:-translate-y-0.5"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-gray-600">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="font-bold text-blue-600 hover:text-blue-500 transition-colors"
              >
                Sign up for free
              </Link>
            </p>
          </motion.div>
        </div>

        {/* Right Side - Colorful Content */}
        <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden items-center justify-center p-12">
          {/* Background Patterns */}
          <div className="absolute inset-0">
            <div className="absolute top-[-20%] right-[-10%] w-[400px] h-[400px] bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob"></div>
            <div className="absolute bottom-[-20%] left-[-10%] w-[400px] h-[400px] bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>
          </div>

          <div className="relative z-10 max-w-md text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <div className="mb-6 inline-flex p-3 bg-white shadow-sm rounded-2xl border border-gray-100">
                <ShieldCheck className="w-10 h-10 text-blue-600" />
              </div>
              <h1 className="text-3xl font-bold mb-4 text-gray-900 leading-tight">
                Reuniting Lost Items with Their Owners.
              </h1>
              <p className="text-base text-gray-600 mb-8 leading-relaxed">
                Join thousands of users who trust our platform to report lost belongings and find found items quickly and securely.
              </p>

              <div className="space-y-3">
                <div className="flex items-center gap-4 bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Search className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm">Smart Matching</h3>
                    <p className="text-xs text-gray-500">AI-powered algorithms to find matches instantly</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <MapPin className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm">Location Tracking</h3>
                    <p className="text-xs text-gray-500">Pinpoint exactly where items were lost or found</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
