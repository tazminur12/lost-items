"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import { User, Mail, Lock, Loader2, ArrowRight, Sparkles, UserPlus, Shield } from "lucide-react";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!name || !email || !password) {
      Swal.fire({
        icon: "warning",
        title: "Missing Information",
        text: "Please fill in all fields.",
        confirmButtonColor: "#2563EB",
      });
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      if (res.ok) {
        Swal.fire({
          icon: "success",
          title: "Account Created!",
          text: "Registration successful. Please log in.",
          confirmButtonColor: "#2563EB",
          timer: 2000,
        });
        
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        const data = await res.json();
        Swal.fire({
          icon: "error",
          title: "Registration Failed",
          text: data.message || "Something went wrong.",
          confirmButtonColor: "#EF4444",
        });
      }
    } catch (error) {
      console.log("User registration failed", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An unexpected error occurred.",
        confirmButtonColor: "#EF4444",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[10%] w-96 h-96 bg-purple-100 rounded-full blur-3xl opacity-40 animate-pulse"></div>
        <div className="absolute bottom-[10%] right-[10%] w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-40 animate-pulse"></div>
      </div>

      <div className="w-full h-full max-w-[1400px] max-h-[900px] bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden flex flex-col lg:flex-row-reverse relative z-10">
        {/* Right Side - Form */}
        <div className="w-full lg:w-1/2 p-8 sm:p-12 lg:p-16 flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-sm mx-auto space-y-6"
          >
            <div className="text-left">
              <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
                Create Account
              </h2>
              <p className="mt-2 text-gray-500 text-sm">
                Join our community to report and find items.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">Full Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                      <User className="h-5 w-5" />
                    </div>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                      placeholder="Md Sojon Mia"
                    />
                  </div>
                </div>

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
                      placeholder="tazminur.rahman.cse@ulab.edu.bd"
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
                      placeholder="Create a password"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  required
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="terms" className="ml-2 block text-sm text-gray-600">
                  I agree to the <a href="#" className="text-blue-600 hover:underline">Terms</a> and <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
                </label>
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
                    Create Account
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-bold text-blue-600 hover:text-blue-500 transition-colors"
              >
                Sign in instead
              </Link>
            </p>
          </motion.div>
        </div>

        {/* Left Side - Colorful Content */}
        <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 relative overflow-hidden items-center justify-center p-12">
          {/* Background Patterns */}
          <div className="absolute inset-0">
            <div className="absolute top-[-20%] left-[-10%] w-[400px] h-[400px] bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[400px] h-[400px] bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>
          </div>

          <div className="relative z-10 max-w-md text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <div className="mb-6 inline-flex p-3 bg-white shadow-sm rounded-2xl border border-gray-100">
                <Sparkles className="w-10 h-10 text-purple-600" />
              </div>
              <h1 className="text-3xl font-bold mb-4 text-gray-900 leading-tight">
                Join Our Growing Community.
              </h1>
              <p className="text-base text-gray-600 mb-8 leading-relaxed">
                Be part of a network that helps thousands of people recover their lost items every day. Secure, fast, and reliable.
              </p>

              <div className="space-y-3">
                <div className="flex items-center gap-4 bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <UserPlus className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm">Easy Registration</h3>
                    <p className="text-xs text-gray-500">Get started in less than a minute</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <Shield className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm">Secure & Private</h3>
                    <p className="text-xs text-gray-500">Your data is protected with industry standards</p>
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
