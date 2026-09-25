'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Mic, Loader2, Bot } from 'lucide-react';
import { useZaykaStore } from '@/store';
import { CHEF_PROFILES } from '@/data/chefs';
import toast from 'react-hot-toast';
import { W } from '@/lib/theme';



export default function ChefChat({ context = 'general', recipeData = null }: { context?: string, recipeData?: any }) {
  const { selectedChef, language, chatHistory, addChatMessage } = useZaykaStore();
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const chef = CHEF_PROFILES[selectedChef];

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory, isTyping]);

  // Voice Synthesis Function
  const speakResponse = useCallback((text: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === 'english' ? 'en-US' : 'hi-IN';
    utterance.rate = 1.05; 
    utterance.pitch = chef.id === 'ananya' || chef.id === 'priya' || chef.id === 'savita' ? 1.2 : 0.9;
    window.speechSynthesis.speak(utterance);
  }, [language, chef.id]);

  
  // Speech to Text handler
  const [isListening, setIsListening] = useState(false);
  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error("Voice input is not supported in this browser.");
      return;
    }
    
    const recognition = new SpeechRecognition();
    recognition.lang = language === "english" ? "en-US" : "hi-IN";
    recognition.interimResults = false;
    
    recognition.onstart = () => setIsListening(true);
    
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setMessage(transcript);
    };
    
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);
    
    recognition.start();
  };

const handleSendMessage = async () => {
    if (!message.trim()) return;

    const userMsg = message.trim();
    setMessage('');
    
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    
    addChatMessage({
      id: Date.now().toString(),
      role: 'user',
      content: userMsg,
      timestamp: new Date(),
      language
    });

    setIsTyping(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg,
          chefId: selectedChef,
          language,
          currentRecipe: recipeData,
          chatHistory: chatHistory.slice(-10) 
        }),
      });

      const data = await res.json();
      
      if (data.success) {
        addChatMessage({
          id: (Date.now() + 1).toString(),
          role: 'chef',
          content: data.response,
          timestamp: new Date(),
          language
        });
        speakResponse(data.response);
      } else {
        toast.error('Chef is busy right now! Try again.');
      }
    } catch (error) {
      console.error(error);
      toast.error('Network error!');
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div style={{ 
      display: 'flex', flexDirection: 'column', height: 450, 
      background: W.bg, border: `1px solid ${W.border}`, borderRadius: 24, overflow: 'hidden',
      boxShadow: '0 8px 32px rgba(0,0,0,0.04)' 
    }}>
      
      {/* Header */}
      <div style={{ 
        background: 'white', padding: '16px', borderBottom: `1px solid ${W.border}`, 
        display: 'flex', alignItems: 'center', gap: 12 
      }}>
        <div style={{ 
          width: 44, height: 44, borderRadius: '50%', background: '#FFF0E6', 
          display: 'flex', alignItems: 'center', justifyContent: 'center', 
          fontSize: 22, border: `2px solid ${W.primary}`
        }}>
          👩‍🍳
        </div>
        <div>
          <h3 style={{ fontWeight: 800, color: W.text, fontSize: 16 }}>{chef.name}</h3>
          <p style={{ fontSize: 12, color: W.primary, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: W.primary, display: 'inline-block', animation: 'pulse 2s infinite' }}></span>
            Online • Ready to help
          </p>
        </div>
      </div>

      {/* Chat Area */}
      <div 
        ref={chatContainerRef}
        style={{ flex: 1, overflowY: 'auto', padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 16 }}
        className="no-scrollbar"
      >
        {/* Initial Greeting */}
        {chatHistory.length === 0 && (
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <div style={{ 
              background: W.chefBubble, color: W.chefText, padding: '12px 16px', 
              borderRadius: '16px 16px 16px 4px', fontSize: 14, fontWeight: 600, 
              border: `1px solid ${W.border}`, boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
              maxWidth: '85%', lineHeight: 1.5
            }}>
              {context === 'cooking' && recipeData 
                ? `Hum ${recipeData.name} bana rahe hain! Koi doubt ho to poocho. 🔥` 
                : chef.greeting}
            </div>
          </div>
        )}

        {/* Chat History */}
        {chatHistory.map((msg, idx) => {
          const isUser = msg.role === 'user';
          return (
            <motion.div 
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              key={msg.id} 
              style={{ display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start' }}
            >
              <div style={{ 
                background: isUser ? W.userBubble : W.chefBubble, 
                color: isUser ? W.userText : W.chefText, 
                padding: '12px 16px', 
                borderRadius: isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px', 
                fontSize: 14, fontWeight: isUser ? 700 : 600, 
                border: isUser ? 'none' : `1px solid ${W.border}`, 
                boxShadow: isUser ? '0 4px 12px rgba(249,115,22,0.2)' : '0 2px 8px rgba(0,0,0,0.02)',
                maxWidth: '85%', lineHeight: 1.5
              }}>
                {msg.content}
              </div>
            </motion.div>
          );
        })}

        {/* Typing Indicator */}
        {isTyping && (
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <div style={{ 
              background: W.chefBubble, padding: '12px 16px', 
              borderRadius: '16px 16px 16px 4px', border: `1px solid ${W.border}`,
              display: 'flex', gap: 4, alignItems: 'center'
            }}>
              <motion.span animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} style={{ width: 6, height: 6, background: W.primary, borderRadius: '50%' }} />
              <motion.span animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} style={{ width: 6, height: 6, background: W.primary, borderRadius: '50%' }} />
              <motion.span animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} style={{ width: 6, height: 6, background: W.primary, borderRadius: '50%' }} />
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div style={{ 
        padding: '12px 16px', background: 'white', borderTop: `1px solid ${W.border}`, 
        display: 'flex', alignItems: 'center', gap: 10 
      }}>
        <motion.button 
  whileTap={{ scale: 0.9 }}
  onClick={startListening}
  style={{ 
    padding: 10, background: isListening ? "#FEE2E2" : "#FFF0E6", color: isListening ? "#EF4444" : W.primary, 
    borderRadius: "50%", border: "none", display: "flex", alignItems: "center", justifyContent: "center",
    cursor: "pointer"
  }}>
  <Mic size={18} className={isListening ? "animate-pulse" : ""} />
</motion.button>
        <div style={{ 
          flex: 1, background: W.bg, border: `1px solid ${W.border}`, 
          borderRadius: 100, display: 'flex', alignItems: 'center', padding: '4px 4px 4px 16px' 
        }}>
          <input 
            type="text" 
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Chef se poocho..." 
            style={{ 
              flex: 1, background: 'transparent', border: 'none', outline: 'none', 
              fontSize: 14, color: W.text, fontWeight: 600 
            }}
          />
          <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={handleSendMessage}
            disabled={!message.trim() || isTyping}
            style={{ 
              padding: 10, borderRadius: '50%', border: 'none', 
              background: message.trim() && !isTyping ? W.primary : W.border, 
              color: message.trim() && !isTyping ? 'white' : W.muted,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: message.trim() && !isTyping ? 'pointer' : 'default',
              transition: 'all 0.2s'
            }}
          >
            {isTyping ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
          </motion.button>
        </div>
      </div>
    </div>
  );
}

