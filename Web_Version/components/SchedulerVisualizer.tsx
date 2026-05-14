'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Cpu, Zap, Timer } from 'lucide-react';
import { Process } from '@/app/page';

interface Props {
  processes: Process[];
  setProcesses: React.Dispatch<React.SetStateAction<Process[]>>;
}

const colors = ['#3b82f6', '#8b5cf6', '#f43f5e', '#10b981', '#f59e0b', '#ec4899', '#06b6d4'];

export default function SchedulerVisualizer({ processes, setProcesses }: Props) {
  const [isRunning, setIsRunning] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [history, setHistory] = useState<{name: string, time: number, color: string}[]>([]);
  const [algo, setAlgo] = useState('RR');

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRunning) {
      timer = setInterval(() => {
        // Only consider 'Running' processes for scheduling
        const activeProcesses = processes.filter(p => p.status === 'Running' && p.remaining > 0);
        
        if (activeProcesses.length === 0) {
          setIsRunning(false);
          return;
        }

        // Logic: pick the first available running process
        const currentTask = activeProcesses[0];
        
        setHistory(h => [...h, { 
          name: currentTask.name, 
          time: currentTime, 
          color: colors[processes.indexOf(currentTask) % colors.length] 
        }]);
        
        setCurrentTime(t => t + 1);

        // Update the global state
        setProcesses(prev => prev.map(p => {
          if (p.id === currentTask.id) {
            return { ...p, remaining: p.remaining - 1 };
          }
          return p;
        }));

        // RR logic: rotate the processes list in state if quantum hit
        if (algo === 'RR' && (currentTime + 1) % 2 === 0) {
          setProcesses(prev => {
             const running = prev.filter(p => p.status === 'Running' && p.remaining > 0);
             if (running.length <= 1) return prev;
             
             // Move the first running process to the end of the running subset
             const firstRunningIndex = prev.findIndex(p => p.id === currentTask.id);
             const next = [...prev];
             const [removed] = next.splice(firstRunningIndex, 1);
             return [...next, removed];
          });
        }
      }, 800);
    }
    return () => clearInterval(timer);
  }, [isRunning, currentTime, algo, processes, setProcesses]);

  const reset = () => {
    setIsRunning(false);
    setCurrentTime(0);
    setHistory([]);
    setProcesses(prev => prev.map(p => ({ ...p, remaining: p.burst })));
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 glass-card p-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-1">Algorithm</span>
            <select 
              value={algo}
              onChange={(e) => setAlgo(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl px-5 py-3 focus:outline-none focus:border-primary text-sm font-bold min-w-[200px] hover:bg-white/[0.08] transition-all"
            >
              <option value="RR">Round Robin (Q=2)</option>
              <option value="FCFS">First-Come First-Serve</option>
            </select>
          </div>
          
          <div className="flex items-center gap-3 pt-5">
            <button 
              onClick={() => setIsRunning(!isRunning)}
              className={`flex items-center gap-3 px-8 py-3 rounded-xl font-black transition-all shadow-xl group ${
                isRunning 
                  ? 'bg-amber-500/10 text-amber-500 border border-amber-500/30' 
                  : 'bg-primary text-white shadow-primary/30'
              }`}
            >
              {isRunning ? <><Pause size={20} fill="currentColor" /> PAUSE</> : <><Play size={20} fill="currentColor" /> RUN SIMULATION</>}
            </button>
            <button 
              onClick={reset} 
              className="p-4 rounded-xl bg-white/5 border border-white/10 text-muted-foreground hover:text-foreground hover:bg-white/10 transition-all"
              title="Reset Simulation"
            >
              <RotateCcw size={20} />
            </button>
          </div>
        </div>

        <div className="flex gap-8 px-4">
          <div className="text-right">
            <span className="text-muted text-[10px] font-black uppercase tracking-[0.2em] block mb-1">Global Clock</span>
            <div className="flex items-center gap-2 text-3xl font-black font-mono">
               <Timer size={24} className="text-primary" />
               {currentTime}<span className="text-lg text-muted-foreground ml-1">s</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="flex items-center justify-between px-2">
            <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
              <Zap size={14} className="text-amber-500" />
              Process Queue
            </h4>
            <span className="text-[10px] font-mono bg-white/5 px-2 py-0.5 rounded text-muted-foreground">
              {processes.filter(p => p.remaining > 0).length} Ready
            </span>
          </div>
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {processes.map((p, idx) => (
                <motion.div 
                  key={p.id} 
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`glass-card p-4 relative overflow-hidden group ${p.status === 'Paused' ? 'opacity-40 grayscale' : ''}`}
                >
                  <div 
                    className="absolute left-0 top-0 bottom-0 w-1.5 shadow-[2px_0_10px_rgba(0,0,0,0.5)]" 
                    style={{ backgroundColor: colors[idx % colors.length] }} 
                  />
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-black text-sm tracking-tight">{p.name}</span>
                    <span className="text-[10px] font-mono font-bold text-muted-foreground">
                      {p.remaining}s <span className="opacity-30">/</span> {p.burst}s
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                    <motion.div 
                      className="h-full rounded-full shadow-[0_0_8px_rgba(0,0,0,0.3)]"
                      style={{ backgroundColor: colors[idx % colors.length] }}
                      animate={{ width: `${(p.remaining / p.burst) * 100}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {processes.length === 0 && (
              <div className="text-center py-10 opacity-30 italic text-sm">Add containers in Process Manager</div>
            )}
          </div>
        </div>

        <div className="lg:col-span-3 glass-card flex flex-col min-h-[500px] relative">
          <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
            <h4 className="text-xs font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
              <Cpu size={16} className="text-primary" />
              Live Execution Timeline
            </h4>
            <div className="flex gap-4">
              <div className="flex items-center gap-2 text-[10px] font-black text-muted-foreground">
                <div className="w-2 h-2 rounded-full bg-primary" /> EXECUTION
              </div>
              <div className="flex items-center gap-2 text-[10px] font-black text-muted-foreground">
                <div className="w-2 h-2 rounded-full bg-white/10" /> IDLE
              </div>
            </div>
          </div>
          
          <div className="flex-1 p-8 overflow-x-auto overflow-y-hidden flex items-end gap-1.5 custom-scrollbar">
            <AnimatePresence initial={false}>
              {history.map((h, i) => (
                <motion.div
                  key={`${h.name}-${i}`}
                  initial={{ height: 0, opacity: 0, scaleY: 0 }}
                  animate={{ height: '70%', opacity: 1, scaleY: 1 }}
                  className="min-w-[32px] rounded-xl flex items-center justify-center relative group shadow-xl border border-white/10"
                  style={{ backgroundColor: h.color }}
                >
                   <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                   <span className="absolute -top-10 left-1/2 -translate-x-1/2 text-[10px] font-black opacity-0 group-hover:opacity-100 transition-all bg-card p-2 rounded-lg border border-white/10 whitespace-nowrap z-20 shadow-2xl scale-90 group-hover:scale-100">
                     {h.name} @ {h.time}s
                   </span>
                   <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[9px] font-mono text-muted-foreground font-bold">
                     {h.time}
                   </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {history.length === 0 && (
              <div className="w-full h-full flex items-center justify-center flex-col opacity-10 gap-4">
                 <Cpu size={64} />
                 <p className="text-xl font-black italic tracking-tighter uppercase">Processor Ready</p>
              </div>
            )}
          </div>
          
          <div className="p-6 bg-white/[0.02] border-t border-white/5">
             <div className="flex items-center gap-4 text-xs font-bold text-muted-foreground/60 italic">
               <Zap size={14} className="text-primary" />
               Real-time kernel scheduling simulation active. Monitoring CPU affinity...
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
