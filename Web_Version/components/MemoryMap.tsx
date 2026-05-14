'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, Plus, RefreshCw } from 'lucide-react';

export default function MemoryMap() {
  const [frames, setFrames] = useState<(number | null)[]>([null, null, null, null, null, null, null, null]);
  const [history, setHistory] = useState<{page: number, frame: number, type: 'hit' | 'fault'}[]>([]);
  const [nextPage, setNextPage] = useState('');

  const accessPage = () => {
    const page = parseInt(nextPage);
    if (isNaN(page)) return;

    const hitIndex = frames.indexOf(page);
    if (hitIndex !== -1) {
      setHistory(prev => [{page, frame: hitIndex, type: 'hit'}, ...prev].slice(0, 5));
    } else {
      const emptyIndex = frames.indexOf(null);
      const replaceIndex = emptyIndex !== -1 ? emptyIndex : Math.floor(Math.random() * frames.length);
      
      const newFrames = [...frames];
      newFrames[replaceIndex] = page;
      setFrames(newFrames);
      setHistory(prev => [{page, frame: replaceIndex, type: 'fault'}, ...prev].slice(0, 5));
    }
    setNextPage('');
  };

  const reset = () => {
    setFrames([null, null, null, null, null, null, null, null]);
    setHistory([]);
  };

  return (
    <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Database className="text-primary" size={20} />
            Physical Memory Frames
          </h3>
          <button onClick={reset} className="p-2 rounded-lg hover:bg-white/5 text-muted transition-colors">
            <RefreshCw size={18} />
          </button>
        </div>

        <div className="grid grid-cols-4 gap-4">
          {frames.map((content, i) => (
            <motion.div
              key={i}
              layout
              className={`h-24 rounded-2xl glass-card flex flex-col items-center justify-center border-2 transition-all ${
                content !== null ? 'border-primary/50 shadow-lg shadow-primary/10' : 'border-white/5 opacity-50'
              }`}
            >
              <span className="text-[10px] font-mono text-muted absolute top-2 left-3">FRAME {i}</span>
              <AnimatePresence mode="wait">
                {content !== null ? (
                  <motion.div
                    key={content}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    className="text-3xl font-bold font-mono gradient-text"
                  >
                    {content}
                  </motion.div>
                ) : (
                  <span className="text-muted-foreground/20 text-2xl">EMPTY</span>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        <div className="flex gap-2">
          <input 
            type="number" 
            value={nextPage}
            onChange={(e) => setNextPage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && accessPage()}
            placeholder="Access Page #..." 
            className="flex-1 bg-white/5 border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-all font-mono"
          />
          <button 
            onClick={accessPage}
            className="cyber-button px-8"
          >
            Access
          </button>
        </div>
      </div>

      <div className="glass-card p-6 flex flex-col">
        <h3 className="text-xs font-mono text-muted uppercase tracking-widest mb-6">Access Log (FIFO)</h3>
        <div className="flex-1 space-y-3">
          <AnimatePresence>
            {history.map((log, i) => (
              <motion.div
                key={`${log.page}-${i}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${log.type === 'hit' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]'}`} />
                  <span className="text-sm font-medium">Page {log.page} Accessed</span>
                </div>
                <span className={`text-[10px] font-bold uppercase ${log.type === 'hit' ? 'text-green-500' : 'text-rose-500'}`}>
                  {log.type}
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
          {history.length === 0 && (
             <div className="h-full flex items-center justify-center text-muted text-sm italic">
               No history yet. Access a page.
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
