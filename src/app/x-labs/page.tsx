'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, ShieldAlert, Clock, TestTube, Mic, Activity, 
  RefreshCw, Film, Brain, Fingerprint, Atom, Globe, Play, X, Video, Eye, ShieldCheck
} from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

const FEATURES = [
  { id: 'zaykacam', title: 'Zayka Cam 🎥', subtitle: 'Kitchen Sentinel', icon: Video, color: 'from-cyan-500 to-blue-700', desc: 'Connects physical CCTV/Camera for real-time burn detection & boil-over alerts.' },
  { id: 'sos', title: 'Kitchen SOS', subtitle: 'Disaster Recovery', icon: ShieldAlert, color: 'from-red-500 to-rose-700', desc: 'Burnt food? Extra salt? AI rescues your dish instantly.' },
  { id: 'nostalgia', title: 'Nostalgia AI', subtitle: 'Memory Recreator', icon: Clock, color: 'from-orange-400 to-amber-600', desc: 'Reverse engineers grandma\'s forgotten recipes from your vague memories.' },
  { id: 'fusion', title: 'Fusion Lab', subtitle: 'Weird Food Gen', icon: TestTube, color: 'from-fuchsia-500 to-purple-700', desc: 'Mix impossible ingredients into Michelin-star gourmet plates.' },
  { id: 'acoustic', title: 'Acoustic AI', subtitle: 'Sizzle Detector', icon: Mic, color: 'from-blue-400 to-indigo-600', desc: 'Listens to your pan to tell you the exact oil temperature.' },
  { id: 'bio', title: 'Bio-Sync', subtitle: 'Neuro-Healing', icon: Activity, color: 'from-emerald-400 to-green-600', desc: 'Scans stress levels and prescribes mood-altering biochemical meals.' },
  { id: 'butterfly', title: 'Butterfly Effect', subtitle: 'Dynamic Recipe', icon: RefreshCw, color: 'from-cyan-400 to-blue-600', desc: 'Make a mistake? The recipe instantly rewrites its future steps.' },
  { id: 'cinematic', title: 'Cinematic Cook', subtitle: 'Time-Travel', icon: Film, color: 'from-yellow-400 to-orange-600', desc: 'Immersive 3D audio documentary while you cook historical dishes.' },
  { id: 'synesthesia', title: 'Synesthetic', subtitle: 'Taste Hacking', icon: Brain, color: 'from-pink-500 to-rose-600', desc: 'Alters your perception of sweetness using specific binaural frequencies.' },
  { id: 'immortal', title: 'Immortality', subtitle: 'Digital Clone', icon: Fingerprint, color: 'from-slate-400 to-gray-700', desc: 'Clones your exact cooking style for your great-grandchildren.' },
  { id: 'molecular', title: 'Molecular', subtitle: 'Gastronomy Blueprint', icon: Atom, color: 'from-violet-500 to-purple-800', desc: 'Invents completely new dishes based on chemical atomic overlaps.' },
  { id: 'quantum', title: 'Quantum Sync', subtitle: 'Earth Connected', icon: Globe, color: 'from-teal-400 to-emerald-700', desc: 'Adjusts recipe variables based on real-time room barometric pressure.' },
];

export default function XLabsPage() {
  const [activeFeature, setActiveFeature] = useState<any>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  const handleOpen = (feature: any) => {
    setActiveFeature(feature);
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
    }, 2500);
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
          <p className="text-[10px] text-cyan-400/70 tracking-[0.2em] font-mono">BEYOND HUMAN LIMITS // EST. 2050</p>
        </div>
        <div className="w-10" />
      </div>

      {/* Grid Content */}
      <div className="relative z-10 p-6 pb-24 max-w-5xl mx-auto" style={{ color: 'white' }}>
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-black mb-3" style={{ color: 'white' }}>Welcome to the Future.</h2>
          <p className="text-sm max-w-md mx-auto" style={{ color: '#9ca3af' }}>You have entered the highly experimental zone. These algorithms manipulate chemistry, psychology, and quantum physics.</p>
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
              <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-3xl blur-xl" style={{ backgroundImage: `var(--tw-gradient-stops)` }}></div>
              <div className="h-full bg-white/5 border border-white/10 hover:border-white/30 rounded-3xl p-6 backdrop-blur-sm transition-all duration-300 relative overflow-hidden flex flex-col justify-between">
                
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
              className="bg-[#111] border border-white/10 rounded-[40px] w-full max-w-lg overflow-hidden relative shadow-2xl shadow-purple-500/10 flex flex-col max-h-[90vh]"
            >
              {/* Close btn */}
              <button 
                onClick={() => setActiveFeature(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                style={{ color: 'white' }}
              >
                <X className="w-5 h-5" />
              </button>

              <div className={`h-32 bg-gradient-to-br ${activeFeature.color} relative overflow-hidden flex items-center justify-center`}>
                <div className="absolute inset-0 bg-black/20"></div>
                <activeFeature.icon className="w-16 h-16 relative z-10" style={{ color: 'rgba(255,255,255,0.5)' }} />
              </div>

              <div className="p-6 overflow-y-auto">
                <div className="flex items-center gap-3 mb-4">
                  <h3 className="text-2xl font-black tracking-tight" style={{ color: 'white' }}>{activeFeature.title}</h3>
                  <span className="px-2 py-1 rounded-md bg-purple-500/20 text-[10px] font-bold uppercase tracking-widest" style={{ color: '#c084fc' }}>Beta</span>
                </div>
                <p className="text-sm leading-relaxed mb-6" style={{ color: '#d1d5db' }}>{activeFeature.desc}</p>
                
                {isSimulating ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <motion.div 
                      animate={{ rotate: 360 }} 
                      transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                      className="w-12 h-12 border-4 border-white/10 border-t-purple-500 rounded-full mb-4"
                    />
                    <p className="font-mono animate-pulse" style={{ color: '#9ca3af' }}>Establishing Neural Link...</p>
                    <p className="text-xs mt-2 font-mono" style={{ color: '#4b5563' }}>Calibrating Quantum Core</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Simulated Interface based on ID */}
                    {activeFeature.id === 'zaykacam' && (
                      <div className="space-y-4">
                        {/* Live CCTV HUD Screen */}
                        <div className="relative h-48 bg-gray-900 border border-cyan-500/40 rounded-2xl overflow-hidden flex flex-col justify-between p-3">
                          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#22d3ee_1px,transparent_1px)] [background-size:16px_16px]"></div>
                          
                          {/* Top Status Overlay */}
                          <div className="flex items-center justify-between z-10">
                            <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-cyan-500/30">
                              <div className="w-2 h-2 rounded-full bg-red-500 animate-ping"></div>
                              <span className="text-[10px] font-mono font-bold text-cyan-400">CAM-01 [LIVE FEED]</span>
                            </div>
                            <span className="text-[10px] font-mono text-gray-400">RTSP: 192.168.1.104</span>
                          </div>

                          {/* Center Radar / HUD Element */}
                          <div className="self-center flex flex-col items-center z-10">
                            <motion.div 
                              animate={{ scale: [1, 1.1, 1] }} 
                              transition={{ repeat: Infinity, duration: 2 }}
                              className="w-16 h-16 rounded-full border border-cyan-400/50 flex items-center justify-center bg-cyan-500/10 backdrop-blur-sm"
                            >
                              <Eye className="w-8 h-8 text-cyan-400" />
                            </motion.div>
                            <span className="text-xs font-mono font-bold text-cyan-300 mt-2 bg-black/60 px-3 py-1 rounded-lg border border-cyan-500/20">
                              AI VISION: MONITORING STOVE ♨️
                            </span>
                          </div>

                          {/* Bottom Alerts HUD */}
                          <div className="flex items-center justify-between z-10 text-[10px] font-mono text-gray-300 bg-black/60 backdrop-blur-md p-2 rounded-xl border border-white/10">
                            <span className="flex items-center gap-1 text-emerald-400"><ShieldCheck className="w-3 h-3" /> Temp: Normal (85°C)</span>
                            <span className="text-cyan-400 font-bold">No Boil-over Detected</span>
                          </div>
                        </div>

                        {/* Connection Controls */}
                        <div className="bg-white/5 p-4 rounded-2xl border border-white/10 space-y-3">
                          <p className="text-xs font-bold text-gray-300 font-mono">🔗 CONNECT KITCHEN CAMERA</p>
                          <div className="flex gap-2">
                            <input 
                              type="text" 
                              placeholder="rtsp://admin:password@192.168.1.100/live" 
                              defaultValue="rtsp://192.168.1.104:554/kitchen_cam"
                              className="flex-1 bg-black/60 border border-white/20 rounded-xl px-3 py-2 text-xs font-mono text-cyan-300 outline-none focus:border-cyan-400"
                            />
                            <button className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl text-xs font-bold text-white shadow-lg shadow-cyan-500/20 hover:scale-105 transition-transform">
                              Sync Cam
                            </button>
                          </div>
                          
                          {/* Alert Presets */}
                          <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
                            <span className="text-gray-400 font-medium">🥛 Milk Boil-over Alert:</span>
                            <span className="text-emerald-400 font-bold font-mono">ACTIVE (🔊 Sound)</span>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-400 font-medium">🔥 Burn & Smoke Sentinel:</span>
                            <span className="text-emerald-400 font-bold font-mono">ACTIVE (📱 Push Notification)</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeFeature.id === 'sos' && (
                      <div className="text-center">
                        <button onClick={() => toast.success('🚨 SOS Sent! AI analyzing burnt Dal...')} className="w-32 h-32 rounded-full bg-red-600 border-8 border-red-900 shadow-[0_0_50px_rgba(220,38,38,0.5)] mx-auto flex items-center justify-center text-4xl font-black mb-6 hover:scale-95 transition-transform" style={{ color: 'white' }}>SOS</button>
                        <p style={{ color: '#d1d5db' }}>"AI, meri Dal jal gayi hai!"</p>
                        <div className="mt-4 bg-white/5 p-4 rounded-2xl border border-white/10 text-left">
                          <span className="font-bold" style={{ color: '#4ade80' }}>Solution:</span>
                          <p className="text-sm mt-1" style={{ color: '#d1d5db' }}>Immediately transfer to a new pan without scraping the bottom. Add 1 tbsp of milk and a pinch of sugar to neutralize the carbonized bitter taste.</p>
                        </div>
                      </div>
                    )}
                    
                    {activeFeature.id === 'bio' && (
                      <div>
                        <div className="h-40 border border-green-500/30 rounded-3xl flex items-center justify-center relative overflow-hidden mb-6">
                          <div className="absolute inset-0 bg-green-500/10"></div>
                          <motion.div 
                            animate={{ x: [-100, 300] }}
                            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                            className="w-1 h-full bg-green-400 shadow-[0_0_20px_rgba(74,222,128,1)] absolute left-0"
                          />
                          <p className="font-mono text-xl z-10" style={{ color: '#4ade80' }}>Scanning Vitals...</p>
                        </div>
                        <div className="bg-white/5 p-4 rounded-2xl">
                          <p className="text-sm mb-2" style={{ color: '#9ca3af' }}>Cortisol (Stress): <span className="font-bold" style={{ color: '#f87171' }}>HIGH</span></p>
                          <p className="text-sm mb-4" style={{ color: '#9ca3af' }}>Prescribed Chemical Alteration: <span className="font-bold" style={{ color: '#22d3ee' }}>+ Serotonin</span></p>
                          <button onClick={() => toast.success('Generating stress-relief recipe...')} className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl font-bold shadow-lg shadow-green-500/20" style={{ color: 'white' }}>Generate Healing Recipe</button>
                        </div>
                      </div>
                    )}

                    {['sos', 'bio'].indexOf(activeFeature.id) === -1 && (
                      <div className="text-center py-6">
                        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/10">
                          <Play className="w-8 h-8 ml-2" style={{ color: 'white' }} />
                        </div>
                        <h4 className="text-xl font-bold mb-2" style={{ color: 'white' }}>System Online</h4>
                        <p className="text-sm leading-relaxed" style={{ color: '#9ca3af' }}>The {activeFeature.title} module is primed and ready. In 2050, this will directly interface with your cortical implant to bypass manual cooking entirely.</p>
                        <button onClick={() => toast.success('Module Initialized. Welcome to 2050.')} className="mt-8 px-8 py-3 bg-white font-black rounded-full hover:scale-105 transition-transform" style={{ color: 'black' }}>Initialize Sequence</button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
