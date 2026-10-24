'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, ShieldAlert, Clock, TestTube, Mic, Activity, 
  RefreshCw, Film, Brain, Fingerprint, Atom, Globe, Sparkles, X, Video, Eye, ShieldCheck, Loader2
} from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { runXLabAction } from '@/lib/actions';
import { useZaykaStore } from '@/store';

const FEATURES = [
  { id: 'zaykacam', title: 'Zayka Cam 🎥', subtitle: 'Kitchen Sentinel', icon: Video, color: 'from-cyan-500 to-blue-700', desc: 'Connects physical CCTV/Camera for real-time burn detection & boil-over alerts.', defaultPrompt: 'Doodh ubalne wala hai aur kadhai mein tadka jal raha hai' },
  { id: 'sos', title: 'Kitchen SOS', subtitle: 'Disaster Recovery', icon: ShieldAlert, color: 'from-red-500 to-rose-700', desc: 'Burnt food? Extra salt? AI rescues your dish instantly.', defaultPrompt: 'Meri Dal mein namak bahut zyada ho gaya aur thodi jal gayi hai!' },
  { id: 'nostalgia', title: 'Nostalgia AI', subtitle: 'Memory Recreator', icon: Clock, color: 'from-orange-400 to-amber-600', desc: 'Reverse engineers grandma\'s forgotten recipes from your vague memories.', defaultPrompt: 'Bachpan mein Nani garmiyon ki dopahar mein aam aur pudine ki ek khatti-meethi dish banati thi' },
  { id: 'fusion', title: 'Fusion Lab', subtitle: 'Weird Food Gen', icon: TestTube, color: 'from-fuchsia-500 to-purple-700', desc: 'Mix impossible ingredients into Michelin-star gourmet plates.', defaultPrompt: 'Gulab Jamun + Cheese Maggi + Peri Peri Masala' },
  { id: 'acoustic', title: 'Acoustic AI', subtitle: 'Sizzle Detector', icon: Mic, color: 'from-blue-400 to-indigo-600', desc: 'Listens to your pan to tell you the exact oil temperature.', defaultPrompt: 'Jeera dalne par tez chatakne ki awaaz aur halka dhuan aa raha hai' },
  { id: 'bio', title: 'Bio-Sync', subtitle: 'Neuro-Healing', icon: Activity, color: 'from-emerald-400 to-green-600', desc: 'Scans stress levels and prescribes mood-altering biochemical meals.', defaultPrompt: 'Exam aur kaam ka bahut stress hai, thakan aur headache ho raha hai' },
  { id: 'butterfly', title: 'Butterfly Effect', subtitle: 'Dynamic Recipe', icon: RefreshCw, color: 'from-cyan-400 to-blue-600', desc: 'Make a mistake? The recipe instantly rewrites its future steps.', defaultPrompt: 'Paneer Tikka banate waqt dahi phat gaya aur besan khatam ho gaya' },
  { id: 'cinematic', title: 'Cinematic Cook', subtitle: 'Time-Travel', icon: Film, color: 'from-yellow-400 to-orange-600', desc: 'Immersive 3D audio documentary while you cook historical dishes.', defaultPrompt: '1650 Shahjahanabad Royal Kitchen Dum Biryani' },
  { id: 'synesthesia', title: 'Synesthetic', subtitle: 'Taste Hacking', icon: Brain, color: 'from-pink-500 to-rose-600', desc: 'Alters your perception of sweetness using specific binaural frequencies.', defaultPrompt: 'Bina cheeni daale kheer ko meetha kaise mehsoos karayein?' },
  { id: 'immortal', title: 'Immortality', subtitle: 'Digital Clone', icon: Fingerprint, color: 'from-slate-400 to-gray-700', desc: 'Clones your exact cooking style for your great-grandchildren.', defaultPrompt: 'Maa ke haath ka Sunday special Aloo Paratha aur laal mirch ki chutney' },
  { id: 'molecular', title: 'Molecular', subtitle: 'Gastronomy Blueprint', icon: Atom, color: 'from-violet-500 to-purple-800', desc: 'Invents completely new dishes based on chemical atomic overlaps.', defaultPrompt: 'Golgappa Pani Spheres with Tamarind Foam & Mint Caviar' },
  { id: 'quantum', title: 'Quantum Sync', subtitle: 'Earth Connected', icon: Globe, color: 'from-teal-400 to-emerald-700', desc: 'Adjusts recipe variables based on real-time room barometric pressure.', defaultPrompt: 'Barish ke mausam mein pakode extra crispy kaise rakhein?' },
];

export default function XLabsPage() {
  const { language } = useZaykaStore();
  const [activeFeature, setActiveFeature] = useState<any>(null);
  const [userInput, setUserInput] = useState('');
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [aiResult, setAiResult] = useState<any>(null);

  const handleOpen = async (feature: any) => {
    setActiveFeature(feature);
    setUserInput(feature.defaultPrompt);
    setAiResult(null);
    setIsLoadingAI(true);
    try {
      const res = await runXLabAction(`${feature.title} (${feature.subtitle})`, feature.defaultPrompt, language);
      if (res.success && res.data) {
        setAiResult(res.data);
      }
    } catch {
      toast.error('Neural link busy, try again!');
    } finally {
      setIsLoadingAI(false);
    }
  };

  const handleRunCustom = async () => {
    if (!activeFeature || !userInput.trim()) return;
    setIsLoadingAI(true);
    try {
      const res = await runXLabAction(`${activeFeature.title} (${activeFeature.subtitle})`, userInput.trim(), language);
      if (res.success && res.data) {
        setAiResult(res.data);
        toast.success('AI Analysis Complete! ⚡');
      }
    } catch {
      toast.error('AI error, dobara try karo!');
    } finally {
      setIsLoadingAI(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans overflow-x-hidden selection:bg-purple-500/30">
      {/* Dynamic Grid Background */}
      <div className="fixed inset-0 z-0 opacity-20 pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)', backgroundSize: '30px 30px' }}>
      </div>

      {/* Header */}
      <div className="p-6 relative z-10 flex items-center justify-between border-b border-white/10 bg-black/50 backdrop-blur-xl sticky top-0">
        <Link href="/">
          <button className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors">
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
        </Link>
        <div className="text-center">
          <h1 className="text-2xl font-black tracking-widest uppercase bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-cyan-400">
            Zayka X-Labs
          </h1>
          <p className="text-[10px] text-cyan-400/70 tracking-[0.2em] font-mono">BEYOND HUMAN LIMITS // LIVE AI ENGINE</p>
        </div>
        <div className="w-10" />
      </div>

      {/* Grid Content */}
      <div className="relative z-10 p-6 pb-24 max-w-5xl mx-auto" style={{ color: 'white' }}>
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-black mb-3" style={{ color: 'white' }}>Welcome to the Future.</h2>
          <p className="text-sm max-w-md mx-auto" style={{ color: '#9ca3af' }}>Tap any experimental module below to run real-time AI culinary science, disaster rescue, or molecular recipe synthesis.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((feature, i) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => handleOpen(feature)}
              className="group relative cursor-pointer"
            >
              <div className="h-full bg-white/5 border border-white/10 hover:border-purple-400/40 rounded-3xl p-6 backdrop-blur-sm transition-all duration-300 relative overflow-hidden flex flex-col justify-between">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 shadow-lg`}>
                  <feature.icon className="w-6 h-6" style={{ color: 'white' }} />
                </div>
                
                <div>
                  <h3 className="text-xl font-bold mb-1 tracking-tight" style={{ color: 'white' }}>{feature.title}</h3>
                  <p className="text-xs font-bold uppercase tracking-wider mb-3 text-transparent bg-clip-text bg-gradient-to-r from-gray-400 to-gray-200">{feature.subtitle}</p>
                  <p className="text-sm leading-relaxed" style={{ color: '#9ca3af' }}>{feature.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Feature Modal Overlay */}
      <AnimatePresence>
        {activeFeature && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-2xl p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-[#111] border border-white/10 rounded-[36px] w-full max-w-lg overflow-hidden relative shadow-2xl shadow-purple-500/10 flex flex-col max-h-[90vh]"
            >
              <button 
                onClick={() => setActiveFeature(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                style={{ color: 'white' }}
              >
                <X className="w-5 h-5" />
              </button>

              <div className={`h-28 bg-gradient-to-br ${activeFeature.color} relative overflow-hidden flex items-center justify-center`}>
                <div className="absolute inset-0 bg-black/20"></div>
                <activeFeature.icon className="w-14 h-14 relative z-10" style={{ color: 'rgba(255,255,255,0.7)' }} />
              </div>

              <div className="p-6 overflow-y-auto space-y-5">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-2xl font-black tracking-tight" style={{ color: 'white' }}>{activeFeature.title}</h3>
                    <span className="px-2 py-1 rounded-md bg-purple-500/20 text-[10px] font-bold uppercase tracking-widest" style={{ color: '#c084fc' }}>Live AI</span>
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: '#9ca3af' }}>{activeFeature.desc}</p>
                </div>

                {activeFeature.id === 'zaykacam' && (
                  <div className="relative h-40 bg-gray-900 border border-cyan-500/40 rounded-2xl overflow-hidden flex flex-col justify-between p-3">
                    <div className="flex items-center justify-between z-10">
                      <div className="flex items-center gap-2 bg-black/60 px-2.5 py-1 rounded-full border border-cyan-500/30">
                        <div className="w-2 h-2 rounded-full bg-red-500 animate-ping"></div>
                        <span className="text-[10px] font-mono font-bold text-cyan-400">CAM-01 [AI SENTINEL]</span>
                      </div>
                      <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> Active</span>
                    </div>
                    <div className="self-center flex flex-col items-center z-10">
                      <Eye className="w-8 h-8 text-cyan-400 animate-pulse" />
                      <span className="text-[11px] font-mono font-bold text-cyan-300 mt-1">AI VISION: MONITORING STOVE ♨️</span>
                    </div>
                    <div className="text-[10px] font-mono text-gray-300 bg-black/60 p-2 rounded-xl border border-white/10 text-center">
                      Describe your stove/pan state below for instant AI hazard & temperature analysis
                    </div>
                  </div>
                )}

                {/* Interactive User Input */}
                <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-3">
                  <label className="text-xs font-bold uppercase tracking-wider text-purple-300 block">
                    Apni Situation / Ingredients Batao:
                  </label>
                  <textarea
                    value={userInput}
                    onChange={e => setUserInput(e.target.value)}
                    rows={2}
                    placeholder="Yahan likho..."
                    className="w-full bg-black/60 border border-white/20 rounded-xl p-3 text-sm text-white outline-none focus:border-purple-400 resize-none"
                  />
                  <button
                    onClick={handleRunCustom}
                    disabled={isLoadingAI}
                    className="w-full py-3 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-xl font-black text-sm text-white flex items-center justify-center gap-2 hover:opacity-95 transition-opacity cursor-pointer"
                  >
                    {isLoadingAI ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> AI Analyzing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" /> Run {activeFeature.title} AI
                      </>
                    )}
                  </button>
                </div>

                {/* Live AI Result */}
                {isLoadingAI ? (
                  <div className="flex flex-col items-center justify-center py-8">
                    <Loader2 className="w-10 h-10 text-purple-400 animate-spin mb-3" />
                    <p className="font-mono text-sm text-gray-300 animate-pulse">Synthesizing Culinary Solution...</p>
                  </div>
                ) : aiResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/5 border border-purple-500/30 rounded-2xl p-4 space-y-3"
                  >
                    <h4 className="text-base font-black text-cyan-300">{aiResult.headline}</h4>
                    <p className="text-sm text-gray-200 leading-relaxed">{aiResult.analysis}</p>
                    {aiResult.steps?.length > 0 && (
                      <div className="space-y-2 pt-2 border-t border-white/10">
                        <p className="text-xs font-bold uppercase tracking-wider text-purple-300">Action Plan:</p>
                        {aiResult.steps.map((s: string, idx: number) => (
                          <div key={idx} className="flex items-start gap-2 text-xs text-gray-200 bg-black/40 p-2.5 rounded-xl">
                            <span className="font-black text-cyan-400">{idx + 1}.</span>
                            <span>{s}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    {aiResult.proTip && (
                      <div className="bg-purple-500/15 border border-purple-500/30 rounded-xl p-3 text-xs text-purple-200">
                        💡 <b>Food Science Fact:</b> {aiResult.proTip}
                      </div>
                    )}
                  </motion.div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
