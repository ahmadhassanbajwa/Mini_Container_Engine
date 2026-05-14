'use client';

import React from 'react';
import { 
  LayoutDashboard, 
  Cpu, 
  Lock, 
  MessageSquare, 
  AlertTriangle, 
  HardDrive, 
  ShieldCheck,
  Terminal,
  Activity
} from 'lucide-react';
import { motion } from 'framer-motion';

const menuItems = [
  { id: 'dashboard', label: 'Mission Control', icon: LayoutDashboard, color: 'text-blue-400' },
  { id: 'processes', label: 'Process Matrix', icon: Terminal, color: 'text-emerald-400' },
  { id: 'scheduler', label: 'CPU Cluster', icon: Cpu, color: 'text-amber-400' },
  { id: 'sync', label: 'Concurrency Lab', icon: Activity, color: 'text-rose-400' },
  { id: 'ipc', label: 'IPC Bridge', icon: MessageSquare, color: 'text-indigo-400' },
  { id: 'deadlock', label: 'Safety Controller', icon: AlertTriangle, color: 'text-orange-400' },
  { id: 'memory', label: 'Memory Map', icon: HardDrive, color: 'text-purple-400' },
  { id: 'isolation', label: 'Sandbox Explorer', icon: ShieldCheck, color: 'text-teal-400' },
];

export default function Sidebar({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (tab: string) => void }) {
  return (
    <div className="w-72 h-screen glass border-r border-white/5 p-6 flex flex-col fixed left-0 top-0 z-50">
      <div className="flex items-center gap-4 mb-12 px-2 group cursor-pointer">
        <motion.div 
          whileHover={{ rotate: 180 }}
          className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary to-secondary flex items-center justify-center shadow-2xl shadow-primary/40 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-white/20 animate-pulse" />
          <Cpu className="text-white relative z-10" size={28} />
        </motion.div>
        <div>
          <h1 className="text-2xl font-black tracking-tighter leading-none mb-1">MINI<span className="text-primary">ENGINE</span></h1>
          <p className="text-[9px] text-muted font-black uppercase tracking-[0.3em] opacity-60">OS Control OS/24</p>
        </div>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group relative overflow-hidden ${
              activeTab === item.id 
                ? 'bg-white/5 text-foreground shadow-xl border border-white/10' 
                : 'text-muted-foreground hover:text-foreground hover:bg-white/[0.03] border border-transparent'
            }`}
          >
            {activeTab === item.id && (
              <motion.div 
                layoutId="sidebarActive"
                className={`absolute left-0 top-0 bottom-0 w-1.5 ${item.color.replace('text', 'bg')} shadow-[2px_0_15px_currentColor]`}
              />
            )}
            <item.icon 
              size={22} 
              className={`${activeTab === item.id ? item.color : 'group-hover:text-foreground transition-colors'}`} 
            />
            <span className={`font-black text-sm tracking-tight ${activeTab === item.id ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'}`}>
              {item.label}
            </span>
            
            {activeTab === item.id && (
               <motion.div 
                 initial={{ scale: 0 }}
                 animate={{ scale: 1 }}
                 className="ml-auto w-2 h-2 rounded-full bg-primary pulse shadow-[0_0_10px_rgba(59,130,246,0.8)]"
               />
            )}
          </button>
        ))}
      </nav>

      <div className="mt-auto space-y-4">
        <div className="p-5 rounded-2xl bg-gradient-to-br from-white/[0.05] to-transparent border border-white/5 group hover:border-primary/20 transition-all">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500">Kernel Active</span>
          </div>
          <div className="space-y-1.5">
            <div className="flex justify-between text-[8px] font-bold text-muted-foreground uppercase">
              <span>Security Layer</span>
              <span className="text-primary">Shielded</span>
            </div>
            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
               <motion.div initial={{ width: 0 }} animate={{ width: '100%' }} className="h-full bg-primary" />
            </div>
          </div>
        </div>
        
        <p className="text-[9px] text-muted-foreground/30 font-mono text-center uppercase tracking-widest px-4">
          v2.4.0-stable • Build_9821-X
        </p>
      </div>
    </div>
  );
}
