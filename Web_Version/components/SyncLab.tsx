'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Unlock, Play, Users } from 'lucide-react';

export default function SyncLab() {
  const [isLocked, setIsLocked] = useState(false);
  const [queue, setQueue] = useState<string[]>([]);
  const [activeThread, setActiveThread] = useState<string | null>(null);

  const spawnThread = () => {
    const newThread = `Thread-${Math.floor(Math.random() * 1000)}`;
    if (!isLocked && !activeThread) {
      setIsLocked(true);
      setActiveThread(newThread);
      setTimeout(() => {
        setIsLocked(false);
        setActiveThread(null);
        // Process next in queue
        setQueue(prev => {
          if (prev.length > 0) {
            const [next, ...rest] = prev;
            setTimeout(() => {
               setIsLocked(true);
               setActiveThread(next);
               setTimeout(() => { setIsLocked(false); setActiveThread(null); }, 2000);
            }, 100);
            return rest;
          }
          return prev;
        });
      }, 2000);
    } else {
      setQueue([...queue, newThread]);
    }
  };

  return (
    <div className="p-6 space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Lock className="text-primary" size={20} />
          Synchronization Lab
        </h3>
        <button 
          onClick={spawnThread}
          className="cyber-button flex items-center gap-2"
        >
          <Play size={18} fill="currentColor" />
          Spawn Resource-Hungry Thread
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-card p-12 flex flex-col items-center justify-center space-y-8 relative overflow-hidden">
          <div className="absolute top-4 left-6 flex items-center gap-2 text-xs font-mono text-muted uppercase tracking-widest">
            <div className={`w-2 h-2 rounded-full ${isLocked ? 'bg-rose-500 animate-pulse' : 'bg-green-500'}`} />
            Resource Mutex
          </div>

          <motion.div
            animate={{ 
              scale: isLocked ? 1.1 : 1,
              rotate: isLocked ? 0 : 360
            }}
            transition={{ type: 'spring', stiffness: 200 }}
            className={`w-32 h-32 rounded-full flex items-center justify-center border-4 ${
              isLocked ? 'border-rose-500 text-rose-500 bg-rose-500/10' : 'border-green-500 text-green-500 bg-green-500/10'
            }`}
          >
            {isLocked ? <Lock size={48} /> : <Unlock size={48} />}
          </motion.div>

          <div className="text-center">
            <h4 className={`text-xl font-bold ${isLocked ? 'text-rose-500' : 'text-green-500'}`}>
              {isLocked ? 'MUTEX LOCKED' : 'MUTEX AVAILABLE'}
            </h4>
            <p className="text-sm text-muted">
              {activeThread ? `Controlled by ${activeThread}` : 'Ready for next request'}
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <h4 className="text-xs font-mono text-muted uppercase tracking-widest flex items-center gap-2">
            <Users size={14} />
            Waiting Queue ({queue.length})
          </h4>
          <div className="space-y-3">
            <AnimatePresence>
              {activeThread && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="p-4 rounded-xl border-2 border-primary bg-primary/10 flex items-center justify-between"
                >
                  <span className="font-bold text-primary italic">EXECUTING: {activeThread}</span>
                  <div className="w-4 h-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                </motion.div>
              )}
              {queue.map((t, i) => (
                <motion.div
                  key={t}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  layout
                  className="p-4 rounded-xl border border-white/10 bg-white/5 flex items-center justify-between"
                >
                  <span className="text-sm font-medium text-muted-foreground">{t}</span>
                  <span className="text-[10px] font-mono bg-white/10 px-2 py-0.5 rounded uppercase">Waiting...</span>
                </motion.div>
              ))}
              {!activeThread && queue.length === 0 && (
                <div className="h-48 flex flex-col items-center justify-center opacity-20 italic">
                   <Users size={48} className="mb-4" />
                   <p>No threads waiting</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
