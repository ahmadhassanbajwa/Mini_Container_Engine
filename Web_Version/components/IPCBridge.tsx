'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Terminal, MessageSquare } from 'lucide-react';

export default function IPCBridge() {
  const [messages, setMessages] = useState<{sender: 'Parent' | 'Child', text: string, time: string}[]>([
    { sender: 'Parent', text: 'Kernel initialized. Establishing pipe...', time: '12:00:01' },
    { sender: 'Child', text: 'Receiver active. Monitoring FD[0].', time: '12:00:02' },
  ]);
  const [input, setInput] = useState('');

  const sendMessage = () => {
    if (!input.trim()) return;
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setMessages([...messages, { sender: 'Parent', text: input, time }]);
    setInput('');
    
    // Auto-reply from Child
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        sender: 'Child', 
        text: `ACK received: "${input}". Data synced to shared memory.`, 
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) 
      }]);
    }, 1000);
  };

  return (
    <div className="p-6 h-[calc(100vh-100px)] flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <MessageSquare className="text-primary" size={20} />
          Inter-Process Communication Bridge
        </h3>
        <div className="flex gap-4">
          <span className="flex items-center gap-2 text-xs font-mono text-muted">
             <div className="w-1.5 h-1.5 rounded-full bg-blue-500" /> PIPE_OPEN
          </span>
          <span className="flex items-center gap-2 text-xs font-mono text-muted">
             <div className="w-1.5 h-1.5 rounded-full bg-purple-500" /> SHM_ATTACHED
          </span>
        </div>
      </div>

      <div className="flex-1 glass-card overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <AnimatePresence initial={false}>
            {messages.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex flex-col ${m.sender === 'Parent' ? 'items-end' : 'items-start'}`}
              >
                <div className={`max-w-[70%] p-4 rounded-2xl ${
                  m.sender === 'Parent' 
                    ? 'bg-primary text-white rounded-tr-none' 
                    : 'bg-white/5 border border-white/10 rounded-tl-none'
                }`}>
                  <p className="text-sm font-medium">{m.text}</p>
                </div>
                <span className="text-[9px] font-mono text-muted mt-1 uppercase tracking-wider">
                  {m.sender} • {m.time}
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="p-4 bg-white/5 border-t border-border flex gap-3">
          <div className="flex-1 relative">
            <Terminal className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={16} />
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Send message through pipe..." 
              className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:border-primary transition-all text-sm font-mono"
            />
          </div>
          <button 
            onClick={sendMessage}
            className="p-3 bg-primary rounded-xl text-white hover:scale-105 transition-all shadow-lg shadow-primary/20"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
