'use client';

import { useState } from 'react';
import { ArrowLeft, Scan, Activity, Flame, Beef } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function DietScannerPage() {
  const [isScanning, setIsScanning] = useState(false);
  const [showTags, setShowTags] = useState(false);

  const startScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setShowTags(true);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col relative overflow-hidden">
      {/* Header */}
      <div className="p-4 flex items-center justify-between z-20 absolute top-0 left-0 right-0">
        <Link href="/">
          <button className="w-10 h-10 rounded-full bg-black/50 border border-white/20 flex items-center justify-center backdrop-blur-md">
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
        </Link>
        <h1 className="text-xl font-bold tracking-tight">Diet AR Scanner</h1>
        <div className="w-10" />
      </div>

      <div className="flex-1 relative bg-[#121212]">
        {/* Mock Camera Feed with blurred edges */}
        <div className="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80" alt="Camera Feed" className="w-full h-full object-cover opacity-80" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/90"></div>
        </div>

        {/* Viewfinder Center */}
        {!showTags && (
          <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
            <div className={`w-64 h-64 border-2 ${isScanning ? 'border-green-400 scale-105' : 'border-white/40'} rounded-3xl transition-all duration-300 relative`}>
              {isScanning && (
                <motion.div 
                  initial={{ top: 0 }}
                  animate={{ top: '100%' }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  className="absolute left-0 right-0 h-1 bg-green-400 shadow-[0_0_15px_rgba(74,222,128,1)]"
                />
              )}
            </div>
          </div>
        )}

        {/* AR Floating Tags */}
        <AnimatePresence>
          {showTags && (
            <>
              {/* Protein Tag */}
              <motion.div 
                initial={{ opacity: 0, scale: 0, x: -50, y: 50 }}
                animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
                transition={{ type: 'spring', delay: 0.1 }}
                className="absolute top-1/3 left-12 bg-black/70 backdrop-blur-md border border-blue-400/50 rounded-2xl p-3 shadow-lg z-20 flex items-center gap-3"
              >
                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <Beef className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <p className="text-[10px] text-blue-300 font-bold uppercase tracking-wider">Protein</p>
                  <p className="text-lg font-black text-white leading-none">24g</p>
                </div>
              </motion.div>

              {/* Calories Tag */}
              <motion.div 
                initial={{ opacity: 0, scale: 0, x: 50, y: -50 }}
                animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
                transition={{ type: 'spring', delay: 0.3 }}
                className="absolute top-1/4 right-12 bg-black/70 backdrop-blur-md border border-orange-400/50 rounded-2xl p-3 shadow-lg z-20 flex items-center gap-3"
              >
                <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center">
                  <Flame className="w-4 h-4 text-orange-400" />
                </div>
                <div>
                  <p className="text-[10px] text-orange-300 font-bold uppercase tracking-wider">Calories</p>
                  <p className="text-lg font-black text-white leading-none">420</p>
                </div>
              </motion.div>

              {/* Health Score */}
              <motion.div 
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="absolute bottom-32 left-6 right-6 bg-green-500/20 backdrop-blur-xl border border-green-400/30 rounded-3xl p-5 z-20 text-center"
              >
                <Activity className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <h3 className="text-xl font-black text-green-400 mb-1">Healthy Meal! 🥗</h3>
                <p className="text-sm font-medium text-green-100">Perfect macros for your post-workout diet. 30g Carbs detected.</p>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Action Bottom Bar */}
        <div className="absolute bottom-8 left-0 right-0 flex justify-center z-30">
          {!showTags ? (
            <button 
              onClick={startScan}
              disabled={isScanning}
              className={`px-8 py-4 rounded-full font-black text-lg flex items-center gap-2 transition-all ${isScanning ? 'bg-gray-800 text-gray-400' : 'bg-white text-black hover:scale-105 shadow-[0_0_30px_rgba(255,255,255,0.3)]'}`}
            >
              <Scan className="w-6 h-6" />
              {isScanning ? 'Scanning Macros...' : 'Scan Plate'}
            </button>
          ) : (
            <button 
              onClick={() => setShowTags(false)}
              className="px-8 py-4 rounded-full font-black text-lg bg-white/10 border border-white/20 text-white flex items-center gap-2 hover:bg-white/20 transition-all backdrop-blur-md"
            >
              Scan Another Plate
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
