'use client';

import { useState, useRef } from 'react';
import { Camera, ArrowLeft, Star, Share2, Award, Flame } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { judgeDishAction } from '@/lib/actions';

export default function JudgePage() {
  const router = useRouter();
  const [stage, setStage] = useState<'camera' | 'judging' | 'result'>('camera');
  const [result, setResult] = useState<any>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCaptureClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Display image locally
    const localUrl = URL.createObjectURL(file);
    setImageUrl(localUrl);
    setStage('judging');

    // Convert to base64 for Gemini
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64Str = reader.result?.toString().split(',')[1];
      if (base64Str) {
        // Call the real AI Server Action
        const response = await judgeDishAction(base64Str, 'My Dish', 'hinglish');
        if (response.success) {
          setResult(response.data);
        } else {
          setResult({
            score: 0,
            feedback: "Oops! AI unable to judge this image. Please try again.",
            shareCaption: "Tried Zayka AI but got an error."
          });
        }
        setStage('result');
      }
    };
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col relative overflow-hidden">
      {/* Hidden file input for camera/gallery */}
      <input 
        type="file" 
        accept="image/*" 
        capture="environment" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
      />

      {/* Header */}
      <div className="p-4 flex items-center justify-between z-20 absolute top-0 left-0 right-0">
        <Link href="/">
          <button className="w-10 h-10 rounded-full bg-black/50 border border-white/20 flex items-center justify-center backdrop-blur-md">
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
        </Link>
        <h1 className="text-xl font-bold tracking-tight">AI MasterChef Judge</h1>
        <div className="w-10" />
      </div>

      <AnimatePresence mode="wait">
        {stage === 'camera' && (
          <motion.div 
            key="camera"
            exit={{ opacity: 0, y: -20 }}
            className="flex-1 flex flex-col items-center justify-center relative"
          >
            {/* Viewfinder */}
            <div className="absolute inset-0 bg-[#121212] flex items-center justify-center">
              <div className="w-4/5 h-3/5 border-2 border-white/20 rounded-[40px] relative">
                <div className="absolute -top-1 -left-1 w-12 h-12 border-t-4 border-l-4 border-yellow-400 rounded-tl-[40px]"></div>
                <div className="absolute -top-1 -right-1 w-12 h-12 border-t-4 border-r-4 border-yellow-400 rounded-tr-[40px]"></div>
                <div className="absolute -bottom-1 -left-1 w-12 h-12 border-b-4 border-l-4 border-yellow-400 rounded-bl-[40px]"></div>
                <div className="absolute -bottom-1 -right-1 w-12 h-12 border-b-4 border-r-4 border-yellow-400 rounded-br-[40px]"></div>
              </div>
            </div>
            
            <p className="absolute top-28 text-center text-white/80 font-medium px-8 text-lg z-10">
              Apne bane hue khane ki ek<br/>badiya si photo click karein ðŸ“¸
            </p>

            {/* Capture Button */}
            <div className="absolute bottom-12 left-0 right-0 flex justify-center z-10">
              <button 
                onClick={handleCaptureClick}
                className="w-24 h-24 rounded-full bg-white/20 border-4 border-yellow-400 flex items-center justify-center hover:scale-105 transition-transform"
              >
                <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center">
                  <Camera className="w-10 h-10 text-black" />
                </div>
              </button>
            </div>
          </motion.div>
        )}

        {stage === 'judging' && (
          <motion.div 
            key="judging"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center relative bg-[#121212]"
          >
            <div className="relative w-32 h-32 mb-8">
              <div className="absolute inset-0 border-4 border-yellow-400/20 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-yellow-400 rounded-full border-t-transparent animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center text-5xl">ðŸ¤”</div>
            </div>
            <h2 className="text-2xl font-black mb-2 text-yellow-400 tracking-wider">AI IS JUDGING...</h2>
            <p className="text-white/50 text-center px-8 font-medium animate-pulse">Checking presentation, colors,<br/>aur plating ka style!</p>
          </motion.div>
        )}

        {stage === 'result' && result && (
          <motion.div 
            key="result"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 flex flex-col bg-white text-gray-900 overflow-y-auto"
          >
            {/* Top Image area */}
            <div className="h-64 bg-gray-100 relative w-full">
              <img src={imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"} alt="Scanned Dish" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
              
              <div className="absolute bottom-6 left-0 right-0 flex justify-center">
                <div className="bg-black/40 backdrop-blur-md border border-white/20 text-white px-6 py-4 rounded-3xl text-center">
                  <p className="text-sm font-bold text-yellow-400 mb-1 uppercase tracking-widest">Final Score</p>
                  <div className="flex items-end justify-center gap-1">
                    <span className="text-6xl font-black leading-none">{result.score}</span>
                    <span className="text-2xl font-bold text-white/50 mb-1">/10</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-8 flex-1 flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                <Award className="w-6 h-6 text-yellow-500" />
                <h3 className="text-xl font-black">Judge's Feedback</h3>
              </div>
              
              <div className="bg-orange-50 border border-orange-200 rounded-2xl p-5 mb-6 shadow-sm">
                <p className="text-gray-800 font-medium leading-relaxed italic">
                  "{result.feedback}"
                </p>
              </div>

              <div className="mb-auto">
                <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Instagram Ready Caption</h4>
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 relative">
                  <p className="text-gray-700">{result.shareCaption || 'Cooked with Zayka AI! #ZaykaAI #HomeCooking'}</p>
                </div>
              </div>

              <button 
                onClick={() => setStage('camera')}
                className="w-full bg-gradient-to-r from-pink-500 to-orange-400 text-white font-black text-lg py-4 rounded-2xl mt-8 shadow-lg shadow-pink-500/30 flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform"
              >
                <Camera className="w-6 h-6" /> Test Another Dish
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

