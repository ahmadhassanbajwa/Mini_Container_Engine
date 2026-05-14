'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Cpu, 
  Activity, 
  Database, 
  Server, 
  Zap, 
  ShieldCheck, 
  Clock, 
  ArrowUpRight 
} from 'lucide-react';

const stats = [
  { label: 'CPU Cluster Load', value: '38%', icon: Cpu, color: 'text-blue-400', glow: 'glow-blue', gradient: 'from-blue-500/20 to-indigo-500/10' },
  { label: 'Kernel Processes', value: '14 Active', icon: Activity, color: 'text-emerald-400', glow: 'glow-emerald', gradient: 'from-emerald-500/20 to-teal-500/10' },
  { label: 'Memory Allocation', value: '1.4 / 4 GB', icon: Database, color: 'text-amber-400', glow: 'glow-amber', gradient: 'from-amber-500/20 to-orange-500/10' },
  { label: 'Uptime (Engine)', value: '72h 14m', icon: Server, color: 'text-rose-400', glow: 'glow-rose', gradient: 'from-rose-500/20 to-pink-500/10' },
];

export default function DashboardOverview() {
  return (
    <div className="space-y-10 p-4">
      {/* Hero Welcome Section */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-10 bg-gradient-to-br from-blue-600/10 via-purple-600/5 to-transparent relative overflow-hidden"
      >
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-primary/10 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-secondary/10 rounded-full blur-[100px] animate-pulse" />
        
        <div className="relative z-10 max-w-2xl">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-2 mb-6 px-4 py-1.5 bg-white/5 border border-white/10 rounded-full w-fit"
          >
            <Zap size={14} className="text-amber-400" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Kernel version v2.4.0-stable</span>
          </motion.div>
          
          <h1 className="text-5xl font-black tracking-tighter mb-4">
            Welcome to <span className="gradient-text">MiniEngine</span>
          </h1>
          <p className="text-lg text-muted-foreground font-medium mb-8 leading-relaxed">
            Your high-performance kernel simulation is active and monitoring <span className="text-primary font-bold">14 critical modules</span>. 
            All systems are operating within safe parameters.
          </p>
          
          <div className="flex gap-4">
            <button className="cyber-button">Launch Console</button>
            <button className="px-6 py-3 rounded-xl border border-white/10 hover:bg-white/5 transition-all text-sm font-bold flex items-center gap-2">
              View Analytics <ArrowUpRight size={18} />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Real-time Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + i * 0.1 }}
            className={`glass-card p-6 bg-gradient-to-br ${stat.gradient} ${stat.glow}`}
          >
            <div className="flex items-center justify-between mb-6">
              <div className={`p-3 rounded-2xl bg-white/5 ${stat.color} shadow-inner`}>
                <stat.icon size={24} />
              </div>
              <motion.div 
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className={`w-2 h-2 rounded-full ${stat.color.replace('text', 'bg')} shadow-[0_0_10px_currentColor]`} 
              />
            </div>
            <h3 className="text-3xl font-black mb-1 tracking-tight">{stat.value}</h3>
            <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Activity Logs Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="lg:col-span-2 glass-card p-8"
        >
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-xl font-black flex items-center gap-3 tracking-tight">
              <Clock className="text-primary" size={24} />
              Recent Kernel Activity
            </h3>
            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest bg-white/5 px-3 py-1 rounded-lg">Real-time Stream</span>
          </div>

          <div className="space-y-6">
            {[
              { title: 'New Container Spawned', desc: 'Container-X initialized with PID 8921', time: '2m ago', icon: Activity, color: 'text-emerald-400' },
              { title: 'Banker Safety Check', desc: 'Resource request granted for PID 4201', time: '12m ago', icon: ShieldCheck, color: 'text-blue-400' },
              { title: 'Page Fault Resolved', desc: 'Frame 3 remapped for Page 12', time: '24m ago', icon: Database, color: 'text-amber-400' },
            ].map((log, i) => (
              <motion.div 
                key={i}
                whileHover={{ x: 10 }}
                className="flex items-center gap-6 p-5 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-primary/20 transition-all cursor-pointer group"
              >
                <div className={`w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center ${log.color} group-hover:scale-110 transition-transform`}>
                  <log.icon size={24} />
                </div>
                <div className="flex-1">
                  <h4 className="font-black text-lg tracking-tight mb-1">{log.title}</h4>
                  <p className="text-sm text-muted-foreground font-medium">{log.desc}</p>
                </div>
                <span className="text-xs font-mono font-bold text-muted-foreground/50">{log.time}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions / System Health */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8 }}
          className="glass-card p-8 relative overflow-hidden group"
        >
          <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-primary/5 rounded-full blur-[80px] group-hover:bg-primary/10 transition-all" />
          
          <h3 className="text-xl font-black mb-10 tracking-tight">System Integrity</h3>
          
          <div className="space-y-10 relative z-10">
            {[
              { label: 'Scheduler Precision', value: 98, color: 'bg-blue-500' },
              { label: 'Memory Efficiency', value: 84, color: 'bg-emerald-500' },
              { label: 'Safety Confidence', value: 100, color: 'bg-rose-500' },
            ].map((item) => (
              <div key={item.label} className="space-y-3">
                <div className="flex justify-between text-[11px] font-black uppercase tracking-widest mb-1">
                  <span className="text-muted-foreground">{item.label}</span>
                  <span className="text-primary">{item.value}%</span>
                </div>
                <div className="h-2.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 p-[1px]">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${item.value}%` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className={`h-full rounded-full ${item.color} shadow-[0_0_15px_rgba(255,255,255,0.2)]`}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 p-6 rounded-2xl bg-white/5 border border-white/10 text-center">
             <ShieldCheck size={40} className="mx-auto text-emerald-400 mb-4 animate-bounce" />
             <p className="text-sm font-black uppercase tracking-widest mb-1">Kernel Secured</p>
             <p className="text-xs text-muted-foreground font-medium">All isolation layers active</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
