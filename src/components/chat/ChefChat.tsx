'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Mic, Loader2, Bot } from 'lucide-react';
import { useZaykaStore } from '@/store';
import { CHEF_PROFILES } from '@/data/chefs';
import toast from 'react-hot-toast';

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
    
    // Stop any currently playing audio
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    // Set language based on app settings
    utterance.lang = language === 'english' ? 'en-US' : 'hi-IN';
    
    // Adjust pitch based on selected chef to give them distinct voices
    utterance.rate = 1.05; // Slightly faster for natural conversation
    utterance.pitch = chef.id === 'ananya' || chef.id === 'priya' || chef.id === 'savita' ? 1.2 : 0.9;
    
    window.speechSynthesis.speak(utterance);
  }, [language, chef.id]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const userMsg = message.trim();
    setMessage('');
    
    // Stop speaking if user interrupts by sending a new message
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    
    // Add user message to store
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
          chatHistory: chatHistory.slice(-10) // Send last 10 messages for context
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
        
        // SPEAK THE RESPONSE OUT LOUD! 🔊
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
    <div className="flex flex-col h-[400px] bg-[#ffffff] border border-[#e5e7eb] rounded-2xl overflow-hidden shadow-lg">
      
      {/* Header */}
      <div className="bg-[#e5e7eb] p-3 border-b border-[#e5e7eb] flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF5A5F]/20 to-[#FF5A5F]/5 flex items-center justify-center text-xl overflow-hidden border border-[#FF5A5F]">
          👨‍🍳
        </div>
        <div>
          <h3 className="font-bold text-[#FF5A5F] text-sm">{chef.name}</h3>
          <p className="text-xs text-gray-500">Online • Ready to help</p>
        </div>
      </div>

      {/* Chat Area */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar"
      >
        {/* Initial Greeting */}
        {chatHistory.length === 0 && (
          <div className="chat-bubble-chef text-sm">
            {context === 'cooking' && recipeData 
              ? `Hum ${recipeData.name} bana rahe hain! Koi doubt ho to poocho. 🔥` 
              : chef.greeting}
          </div>
        )}

        {/* Chat History */}
        {chatHistory.map((msg, idx) => (
          <div 
            key={msg.id} 
            className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div className={`text-sm ${msg.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-chef'}`}>
              {msg.content}
            </div>
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex items-start">
            <div className="chat-bubble-chef text-sm flex gap-1 items-center">
              <span className="w-1.5 h-1.5 bg-[#FF5A5F] rounded-full animate-bounce"></span>
              <span className="w-1.5 h-1.5 bg-[#FF5A5F] rounded-full animate-bounce delay-100"></span>
              <span className="w-1.5 h-1.5 bg-[#FF5A5F] rounded-full animate-bounce delay-200"></span>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-3 bg-[#e5e7eb] border-t border-[#e5e7eb] flex items-center gap-2">
        <button className="p-2 text-gray-500 hover:text-[#FF5A5F] transition-colors rounded-full bg-[#e5e7eb]">
          <Mic className="w-4 h-4" />
        </button>
        <input 
          type="text" 
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Chef se poocho..." 
          className="flex-1 bg-transparent text-sm text-gray-900 outline-none px-2 placeholder-[#a0a0a0]"
        />
        <button 
          onClick={handleSendMessage}
          disabled={!message.trim() || isTyping}
          className={`p-2 rounded-full transition-colors ${
            message.trim() && !isTyping ? 'bg-[#FF5A5F]/20 text-gray-900' : 'bg-[#e5e7eb] text-gray-500'
          }`}
        >
          {isTyping ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}
