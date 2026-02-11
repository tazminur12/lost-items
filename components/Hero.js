"use client";

import Link from "next/link";
import { ArrowRight, Play, CheckCircle, Shield, Clock, Search } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";

export default function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <div className="relative overflow-hidden bg-white pb-16 pt-16 sm:pb-24 lg:pb-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-center">
          
          {/* Left Content */}
          <motion.div 
            className="sm:text-center md:mx-auto md:max-w-2xl lg:col-span-6 lg:text-left"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants} className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-600 ring-1 ring-inset ring-blue-600/10 mb-6">
              <span className="flex h-2 w-2 rounded-full bg-blue-600 mr-2 animate-pulse"></span>
              AI-POWERED RECOVERY SYSTEM
            </motion.div>
            
            <motion.h1 variants={itemVariants} className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl lg:leading-tight">
              Reuniting You with Your <span className="text-blue-600">Lost Items</span>
            </motion.h1>
            
            <motion.p variants={itemVariants} className="mt-6 text-lg leading-8 text-gray-600">
              Don't let lost belongings stay lost. Our smart platform connects lost items with their owners using advanced matching algorithms. Secure, fast, and reliable.
            </motion.p>
            
            <motion.div variants={itemVariants} className="mt-8 flex flex-col sm:flex-row gap-4 sm:justify-center lg:justify-start">
              <Link
                href="/report-lost"
                className="inline-flex items-center justify-center rounded-full bg-blue-600 px-8 py-3.5 text-base font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-all duration-200 group"
              >
                Report Lost Item
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/how-it-works"
                className="inline-flex items-center justify-center rounded-full bg-white px-8 py-3.5 text-base font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 transition-all duration-200"
              >
                <Play className="mr-2 h-4 w-4 fill-gray-900" />
                How it works
              </Link>
            </motion.div>

            <motion.div variants={itemVariants} className="mt-10 flex items-center justify-center lg:justify-start gap-x-8 gap-y-4 text-sm text-gray-500 flex-wrap">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>Instant Matching</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-500" />
                <span>Secure Claims</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-purple-500" />
                <span>24/7 Availability</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Content / Image */}
          <motion.div 
            className="relative mt-16 lg:col-span-6 lg:mt-0 lg:flex lg:justify-end"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="relative w-full max-w-md mx-auto lg:max-w-none">
              {/* Background Blobs */}
              <div className="absolute -top-12 -right-12 -z-10 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-50 animate-pulse"></div>
              <div className="absolute -bottom-12 -left-12 -z-10 w-64 h-64 bg-purple-100 rounded-full blur-3xl opacity-50 animate-pulse delay-1000"></div>

              {/* Main Image Container */}
              <div className="relative rounded-2xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4">
                <div className="relative rounded-xl overflow-hidden bg-white shadow-2xl ring-1 ring-gray-900/10">
                  <img
                    src="https://images.unsplash.com/photo-1555421689-d68471e189f2?auto=format&fit=crop&q=80&w=1000"
                    alt="App Dashboard Preview"
                    className="w-full h-auto object-cover"
                  />
                  
                  {/* Floating Card 1: Success Match */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1, duration: 0.5 }}
                    className="absolute top-8 left-8 bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-gray-100 max-w-[200px] hidden sm:block"
                  >
                    <div className="flex items-start gap-3">
                      <div className="bg-green-100 p-2 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase">Status</p>
                        <p className="text-sm font-bold text-gray-900">Item Matched!</p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Floating Card 2: Search Stat */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2, duration: 0.5 }}
                    className="absolute bottom-8 right-8 bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-gray-100 max-w-[220px] hidden sm:block"
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <Search className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gray-900">98%</p>
                        <p className="text-xs text-gray-500">Recovery Rate</p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
