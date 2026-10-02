'use client';
/**
 * ============================================================
 * ZAYKA AI — ZaykaBrainChat Component
 * Beautiful chat UI that talks to your own AI model
 * Real-time voice + text with animated responses
 * ============================================================
 */

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Volume2, VolumeX, Send, Trash2, Zap, Brain } from 'lucide-react';
import { useZaykaBrain } from '@/hooks/useZaykaBrain';
import { useZaykaStore } from '@/store';
import { W } from '@/lib/theme';

interface ZaykaBrainChatProps {
  context?: {
    currentRecipe?: string;
    currentStep?: number;
  };
}

export default function ZaykaBrainChat({ context }: ZaykaBrainChatProps) {
  const [inputText, setInputText] = useState('');
  const [autoSpeak, setAutoSpeak] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { fridgeIngredients, currentRecipe, currentStep } = useZaykaStore();
  
  const {
    messages,
    isListening,
    isThinking,
    isSpeaking,
    transcript,
    error,
    micLevel,
    usingOwnModel,
    sendMessage,
    toggleVoice,
    speakText,
    stopSpeaking,
    clearMessages,
  } = useZaykaBrain({
    autoSpeak,
    useOwnModel: true,
    context: {
      currentRecipe: context?.currentRecipe || currentRecipe?.name,
      currentStep: context?.currentStep ?? currentStep,
      fridgeIngredients,
    },
  });
  
  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSend = () => {
    if (!inputText.trim()) return;
    sendMessage(inputText.trim());
    setInputText('');
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  
  const micScale = 1 + (micLevel / 200);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 500, background: W.bg }}>
      
      {/* ---- HEADER ---- */}
      <div style={{
        padding: '16px 20px',
        borderBottom: `1px solid ${W.border}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'white',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 14,
            background: usingOwnModel
              ? 'linear-gradient(135deg, #7C3AED, #4F46E5)'
              : 'linear-gradient(135deg, #F97316, #EA580C)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {usingOwnModel ? <Brain size={20} color="white" /> : <Zap size={20} color="white" />}
          </div>
          <div>
            <p style={{ fontSize: 14, fontWeight: 900, color: W.heading }}>
              {usingOwnModel ? 'Zayka Brain 🧠' : 'Zayka Chef ⚡'}
            </p>
            <p style={{ fontSize: 11, color: W.muted, fontWeight: 600 }}>
              {usingOwnModel ? 'Apna custom AI model' : 'Groq powered'}
            </p>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: 8 }}>
          {/* Auto-speak toggle */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setAutoSpeak(p => !p);
              if (isSpeaking) stopSpeaking();
            }}
            style={{
              width: 36, height: 36, borderRadius: 10,
              background: autoSpeak ? '#FFF7ED' : W.card,
              border: `1.5px solid ${autoSpeak ? W.primary : W.border}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            }}
            title={autoSpeak ? 'Awaaz band karo' : 'Awaaz chalao'}
          >
            {autoSpeak ? <Volume2 size={16} color={W.primary} /> : <VolumeX size={16} color={W.muted} />}
          </motion.button>
          
          {/* Clear chat */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={clearMessages}
            style={{
              width: 36, height: 36, borderRadius: 10,
              background: W.card, border: `1.5px solid ${W.border}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            }}
            title="Chat clear karo"
          >
            <Trash2 size={16} color={W.muted} />
          </motion.button>
        </div>
      </div>
      
      {/* ---- MESSAGES ---- */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        
        {/* Welcome message */}
        {messages.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ textAlign: 'center', padding: '40px 20px' }}
          >
            <div style={{ fontSize: 48, marginBottom: 12 }}>🧠</div>
            <h3 style={{ fontSize: 18, fontWeight: 900, color: W.heading, marginBottom: 8 }}>
              Zayka Brain ready hai!
            </h3>
            <p style={{ fontSize: 13, color: W.muted, lineHeight: 1.6 }}>
              Bolke ya type karke poocho — koi bhi recipe, cooking tip, ya ingredient question!
            </p>
            
            {/* Quick prompts */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginTop: 20 }}>
              {[
                '🧅 Kya banao aaj?',
                '💰 ₹50 mein kya?',
                '🥗 Healthy recipe?',
                '⏱️ 15 min mein?',
              ].map(prompt => (
                <motion.button
                  key={prompt}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => sendMessage(prompt)}
                  style={{
                    padding: '8px 14px', borderRadius: 20,
                    background: W.card, border: `1.5px solid ${W.border}`,
                    fontSize: 12, fontWeight: 700, color: W.text,
                    cursor: 'pointer',
                  }}
                >
                  {prompt}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
        
        <AnimatePresence>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{
                display: 'flex',
                justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
              }}
            >
              {msg.role === 'assistant' && (
                <div style={{
                  width: 30, height: 30, borderRadius: 10, flexShrink: 0,
                  background: 'linear-gradient(135deg, #7C3AED, #4F46E5)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginRight: 8, marginTop: 2,
                }}>
                  <span style={{ fontSize: 14 }}>🧠</span>
                </div>
              )}
              
              <div style={{ maxWidth: '80%' }}>
                <div style={{
                  padding: '12px 16px',
                  borderRadius: msg.role === 'user' ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                  background: msg.role === 'user'
                    ? 'linear-gradient(135deg, #F97316, #EA580C)'
                    : 'white',
                  color: msg.role === 'user' ? 'white' : W.text,
                  border: msg.role === 'assistant' ? `1.5px solid ${W.border}` : 'none',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                }}>
                  <p style={{ fontSize: 14, lineHeight: 1.6, fontWeight: 500, margin: 0 }}>
                    {msg.content}
                  </p>
                </div>
                
                {/* Speak button for AI messages */}
                {msg.role === 'assistant' && (
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => speakText(msg.content)}
                    style={{
                      marginTop: 4, padding: '4px 10px', borderRadius: 8,
                      background: 'transparent', border: `1px solid ${W.border}`,
                      fontSize: 11, color: W.muted, cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: 4,
                    }}
                  >
                    <Volume2 size={10} /> Sunao
                  </motion.button>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {/* Thinking indicator */}
        {isThinking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ display: 'flex', alignItems: 'center', gap: 8 }}
          >
            <div style={{
              width: 30, height: 30, borderRadius: 10,
              background: 'linear-gradient(135deg, #7C3AED, #4F46E5)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ fontSize: 14 }}>🧠</span>
            </div>
            <div style={{ display: 'flex', gap: 4, padding: '12px 16px', background: 'white', borderRadius: '20px 20px 20px 4px', border: `1.5px solid ${W.border}` }}>
              {[0, 1, 2].map(i => (
                <motion.div
                  key={i}
                  animate={{ y: [0, -6, 0] }}
                  transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.15 }}
                  style={{ width: 8, height: 8, borderRadius: '50%', background: W.primary }}
                />
              ))}
            </div>
          </motion.div>
        )}
        
        {/* Interim transcript */}
        {isListening && transcript && (
          <div style={{ textAlign: 'right', padding: '0 8px' }}>
            <span style={{ fontSize: 12, color: W.muted, fontStyle: 'italic' }}>"{transcript}..."</span>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* ---- ERROR ---- */}
      {error && (
        <div style={{ padding: '8px 16px', background: '#FEF2F2', borderTop: '1px solid #FECACA' }}>
          <p style={{ fontSize: 12, color: '#DC2626', fontWeight: 600 }}>⚠️ {error}</p>
        </div>
      )}
      
      {/* ---- INPUT BAR ---- */}
      <div style={{
        padding: '12px 16px',
        borderTop: `1px solid ${W.border}`,
        background: 'white',
        display: 'flex',
        alignItems: 'flex-end',
        gap: 8,
      }}>
        {/* Text input */}
        <textarea
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Yahan likho ya mic se bolo..."
          rows={1}
          style={{
            flex: 1,
            padding: '12px 14px',
            borderRadius: 18,
            border: `1.5px solid ${W.border}`,
            background: W.bg,
            fontSize: 14,
            fontFamily: 'Nunito, sans-serif',
            resize: 'none',
            outline: 'none',
            lineHeight: 1.5,
            maxHeight: 120,
            overflowY: 'auto',
          }}
        />
        
        {/* Mic button */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={toggleVoice}
          animate={{ scale: isListening ? micScale : 1 }}
          style={{
            width: 46, height: 46, borderRadius: '50%', flexShrink: 0,
            border: 'none', cursor: 'pointer',
            background: isListening
              ? 'linear-gradient(135deg, #EF4444, #DC2626)'
              : 'linear-gradient(135deg, #7C3AED, #4F46E5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: isListening ? '0 0 20px rgba(239,68,68,0.4)' : '0 4px 12px rgba(124,58,237,0.3)',
            transition: 'background 0.3s',
          }}
          aria-label={isListening ? 'Recording band karo' : 'Bolo apni baat'}
        >
          {isListening ? <MicOff size={20} color="white" /> : <Mic size={20} color="white" />}
        </motion.button>
        
        {/* Send button */}
        {inputText.trim() && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleSend}
            style={{
              width: 46, height: 46, borderRadius: '50%', flexShrink: 0,
              border: 'none', cursor: 'pointer',
              background: 'linear-gradient(135deg, #F97316, #EA580C)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(249,115,22,0.3)',
            }}
          >
            <Send size={18} color="white" />
          </motion.button>
        )}
      </div>
      
      {/* ---- SPEAKING INDICATOR ---- */}
      <AnimatePresence>
        {isSpeaking && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            style={{
              position: 'absolute', bottom: 80, right: 16,
              background: 'rgba(0,0,0,0.75)',
              backdropFilter: 'blur(8px)',
              borderRadius: 20, padding: '8px 14px',
              display: 'flex', alignItems: 'center', gap: 8,
            }}
          >
            <motion.div
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
              style={{ width: 8, height: 8, borderRadius: '50%', background: '#10B981' }}
            />
            <span style={{ fontSize: 12, color: 'white', fontWeight: 700 }}>
              Chef bol raha hai...
            </span>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={stopSpeaking}
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'white' }}
            >
              <VolumeX size={14} />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
