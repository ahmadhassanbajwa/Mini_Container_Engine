'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '@/components/Sidebar';
import DashboardOverview from '@/components/DashboardOverview';
import ProcessManager from '@/components/ProcessManager';
import SchedulerVisualizer from '@/components/SchedulerVisualizer';
import SyncLab from '@/components/SyncLab';
import IPCBridge from '@/components/IPCBridge';
import BankerGrid from '@/components/BankerGrid';
import MemoryMap from '@/components/MemoryMap';
import SandboxExplorer from '@/components/SandboxExplorer';

export interface Process {
  id: string;
  name: string;
  pid: number;
  status: 'Running' | 'Paused' | 'Zombie';
  cpu: number;
  memory: number;
  burst: number;
  remaining: number;
}

export interface Message {
  id: string;
  from: 'User 1' | 'User 2';
  to: 'User 1' | 'User 2';
  text: string;
  time: string;
}

export default function Home() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(true);
  
  // Shared Kernel State
  const [processes, setProcesses] = useState<Process[]>([
    { id: '1', name: 'Container-Alpha', pid: 8101, status: 'Running', cpu: 14, memory: 48, burst: 6, remaining: 6 },
    { id: '2', name: 'Container-Beta', pid: 8102, status: 'Running', cpu: 10, memory: 36, burst: 4, remaining: 4 },
  ]);

  const [messages, setMessages] = useState<Message[]>([
    { id: 'm1', from: 'User 1', to: 'User 2', text: 'Kernel handshaking established.', time: '14:20' },
  ]);

  useEffect(() => {
    // Simulate "Kernel Boot" Aura
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardOverview processes={processes} />;
      case 'processes': return <ProcessManager processes={processes} setProcesses={setProcesses} />;
      case 'scheduler': return <SchedulerVisualizer processes={processes} setProcesses={setProcesses} />;
      case 'sync': return <SyncLab />;
      case 'ipc': return <IPCBridge messages={messages} setMessages={setMessages} />;
      case 'deadlock': return <BankerGrid />;
      case 'memory': return <MemoryMap />;
      case 'isolation': return <SandboxExplorer />;
      default: return <DashboardOverview processes={processes} />;
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen w-screen bg-[#020617] flex flex-col items-center justify-center p-8">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative"
        >
          <div className="w-24 h-24 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-primary/10 pulse" />
          </div>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center"
        >
          <h2 className="text-xl font-black tracking-widest uppercase gradient-text mb-2">Initializing Kernel</h2>
          <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.4em]">Allocating System Resources...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-transparent flex overflow-hidden">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="flex-1 ml-72 h-screen flex flex-col perspective-container">
        <header className="h-24 px-10 flex items-center justify-between z-40 bg-transparent">
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-1">
               <div className="w-2 h-2 rounded-full bg-primary pulse shadow-[0_0_8px_#3b82f6]" />
               <h2 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em]">Module Cluster: {activeTab}</h2>
            </div>
            <p className="text-4xl font-black tracking-tighter capitalize">{activeTab.replace('-', ' ')}</p>
          </div>
          
          <div className="flex items-center gap-8 glass-morphism px-6 py-3 rounded-2xl">
             <div className="text-right">
                <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest block mb-1">Total Entropy</span>
                <span className="text-lg font-black font-mono tracking-tight">0.024 <span className="text-primary text-xs">ms</span></span>
             </div>
             <div className="h-10 w-px bg-white/10" />
             <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                   <ActivityPulse />
                </div>
                <div>
                   <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest block">System Heartbeat</span>
                   <span className="text-xs font-bold text-emerald-500">OPTIMAL</span>
                </div>
             </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-10 pb-10 custom-scrollbar">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, rotateY: 15, z: -100, x: 20 }}
              animate={{ opacity: 1, rotateY: 0, z: 0, x: 0 }}
              exit={{ opacity: 0, rotateY: -15, z: -100, x: -20 }}
              transition={{ duration: 0.6, cubicBezier: [0.16, 1, 0.3, 1] }}
              className="h-full"
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}

const ActivityPulse = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
);
