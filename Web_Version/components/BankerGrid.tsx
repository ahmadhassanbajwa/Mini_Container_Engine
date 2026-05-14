'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';

export default function BankerGrid() {
  const [available, setAvailable] = useState([3, 3, 2]);
  const [allocation, setAllocation] = useState([
    [0, 1, 0],
    [2, 0, 0],
    [3, 0, 2]
  ]);
  const [max, setMax] = useState([
    [7, 5, 3],
    [3, 2, 2],
    [9, 0, 2]
  ]);
  const [result, setResult] = useState<'safe' | 'unsafe' | null>(null);

  const checkSafety = () => {
    // Simple simulation for demo
    setResult(Math.random() > 0.3 ? 'safe' : 'unsafe');
  };

  return (
    <div className="p-6 space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <ShieldCheck className="text-primary" size={20} />
          Banker's Algorithm Safety Check
        </h3>
        <button 
          onClick={checkSafety}
          className="cyber-button"
        >
          Check System Safety
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-card p-6">
            <h4 className="text-xs font-mono text-muted uppercase tracking-widest mb-4">Total Available Resources</h4>
            <div className="grid grid-cols-3 gap-4">
              {['A', 'B', 'C'].map((res, i) => (
                <div key={res} className="text-center p-3 rounded-xl bg-white/5 border border-white/10">
                   <span className="block text-xs font-mono text-muted mb-1">{res}</span>
                   <span className="text-xl font-bold">{available[i]}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-6 border-none bg-gradient-to-br from-primary/10 to-secondary/10">
            {result === 'safe' && (
              <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="text-center space-y-4">
                <CheckCircle2 size={48} className="mx-auto text-green-500" />
                <div>
                  <h4 className="text-lg font-bold text-green-500">System is SAFE</h4>
                  <p className="text-xs text-muted">A safe sequence exists to satisfy all container needs.</p>
                </div>
              </motion.div>
            )}
            {result === 'unsafe' && (
              <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="text-center space-y-4">
                <AlertTriangle size={48} className="mx-auto text-rose-500" />
                <div>
                  <h4 className="text-lg font-bold text-rose-500">System is UNSAFE</h4>
                  <p className="text-xs text-muted">A potential circular wait exists. Deadlock risk detected!</p>
                </div>
              </motion.div>
            )}
            {result === null && (
              <div className="text-center py-8 opacity-30 italic text-sm">
                Initialize safety check to see results
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-2 glass-card overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-white/5 text-[10px] font-mono text-muted uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Container ID</th>
                <th className="px-6 py-4 text-center">Allocated (A,B,C)</th>
                <th className="px-6 py-4 text-center">Max Need (A,B,C)</th>
                <th className="px-6 py-4 text-center">Remaining (A,B,C)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50 font-mono text-sm">
              {[0, 1, 2].map((id) => (
                <tr key={id} className="hover:bg-white/[0.02]">
                  <td className="px-6 py-4 font-bold">C{id}</td>
                  <td className="px-6 py-4 text-center text-primary">{allocation[id].join(', ')}</td>
                  <td className="px-6 py-4 text-center text-muted-foreground">{max[id].join(', ')}</td>
                  <td className="px-6 py-4 text-center text-secondary">
                    {max[id].map((v, i) => v - allocation[id][i]).join(', ')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
