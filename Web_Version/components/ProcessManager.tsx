'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Square, RefreshCcw, Search, Plus, Terminal } from 'lucide-react';
import { Process } from '@/app/page';

interface Props {
  processes: Process[];
  setProcesses: React.Dispatch<React.SetStateAction<Process[]>>;
}

export default function ProcessManager({ processes, setProcesses }: Props) {
  const spawnProcess = () => {
    const nextChar = String.fromCharCode(64 + processes.length + 1);
    const newProcess: Process = {
      id: Math.random().toString(36).substr(2, 9),
      name: `Container-${nextChar}`,
      pid: 4200 + processes.length + 1,
      status: 'Running',
      cpu: Math.floor(Math.random() * 25),
      memory: Math.floor(Math.random() * 80) + 20,
      burst: Math.floor(Math.random() * 6) + 2,
      remaining: 0 // Will be set by scheduler or just used for sync
    };
    newProcess.remaining = newProcess.burst;
    setProcesses([...processes, newProcess]);
  };

  const killProcess = (id: string) => {
    setProcesses(processes.filter(p => p.id !== id));
  };

  const togglePause = (id: string) => {
    setProcesses(processes.map(p => {
      if (p.id === id) {
        return { 
          ...p, 
          status: p.status === 'Running' ? 'Paused' : 'Running',
          cpu: p.status === 'Running' ? 0 : Math.floor(Math.random() * 20)
        };
      }
      return p;
    }));
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex-1 w-full relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-primary transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Filter kernel processes..." 
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 focus:outline-none focus:border-primary/50 focus:bg-white/[0.08] transition-all text-sm font-medium"
          />
        </div>
        <button 
          onClick={spawnProcess}
          className="cyber-button w-full md:w-auto flex items-center justify-center gap-3 whitespace-nowrap"
        >
          <Plus size={20} strokeWidth={3} />
          New Container
        </button>
      </div>

      <div className="glass-card overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-white/5 bg-white/[0.02] flex items-center gap-3">
          <Terminal size={18} className="text-primary" />
          <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Active Process Table</h3>
        </div>
        <table className="w-full text-left">
          <thead className="bg-white/[0.03] text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
            <tr>
              <th className="px-8 py-5">Process Name</th>
              <th className="px-8 py-5">PID</th>
              <th className="px-8 py-5">Status</th>
              <th className="px-8 py-5">Resource Usage</th>
              <th className="px-8 py-5 text-right">Kernel Controls</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            <AnimatePresence mode="popLayout">
              {processes.map((p) => (
                <motion.tr 
                  key={p.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="hover:bg-white/[0.03] transition-colors group"
                >
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                       <div className={`w-1.5 h-8 rounded-full ${p.status === 'Running' ? 'bg-primary shadow-[0_0_10px_rgba(59,130,246,0.5)]' : 'bg-yellow-500'}`} />
                       <span className="font-bold text-lg tracking-tight">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 font-mono font-bold text-muted-foreground">{p.pid}</td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border ${
                      p.status === 'Running' 
                        ? 'bg-primary/10 text-primary border-primary/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]' 
                        : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                    }`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between text-[10px] font-bold">
                        <span className="text-muted-foreground">CPU</span>
                        <span className="text-foreground">{p.cpu}%</span>
                      </div>
                      <div className="h-1.5 w-32 bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${p.cpu}%` }}
                          className={`h-full ${p.status === 'Running' ? 'bg-primary' : 'bg-muted'}`}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-3">
                      <button 
                        onClick={() => togglePause(p.id)}
                        className={`p-3 rounded-xl transition-all border ${
                          p.status === 'Running' 
                            ? 'hover:bg-yellow-500/10 text-muted hover:text-yellow-500 border-transparent hover:border-yellow-500/20' 
                            : 'hover:bg-green-500/10 text-muted hover:text-green-500 border-transparent hover:border-green-500/20'
                        }`}
                        title={p.status === 'Running' ? 'Pause Process' : 'Resume Process'}
                      >
                        {p.status === 'Running' ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
                      </button>
                      <button className="p-3 rounded-xl hover:bg-white/10 text-muted hover:text-foreground transition-all border border-transparent hover:border-white/10">
                        <RefreshCcw size={18} />
                      </button>
                      <button 
                        onClick={() => killProcess(p.id)}
                        className="p-3 rounded-xl hover:bg-rose-500/10 text-muted hover:text-rose-500 transition-all border border-transparent hover:border-rose-500/20"
                        title="Kill Process"
                      >
                        <Square size={18} fill="currentColor" strokeWidth={0} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
        {processes.length === 0 && (
          <div className="p-20 text-center space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto opacity-20">
              <Terminal size={32} />
            </div>
            <p className="text-muted-foreground font-medium italic">No active kernel containers found. System idle.</p>
          </div>
        )}
      </div>
    </div>
  );
}
