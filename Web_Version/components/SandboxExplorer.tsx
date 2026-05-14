'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Folder, File, Shield, ChevronRight, HardDrive, Lock } from 'lucide-react';

export default function SandboxExplorer() {
  const [selectedContainer, setSelectedContainer] = useState('Container-A');

  const fileSystem = {
    'Container-A': [
      { name: 'logs/', type: 'folder', files: ['access.log', 'error.log'] },
      { name: 'config.json', type: 'file' },
      { name: 'app.bin', type: 'file' },
    ],
    'Container-B': [
      { name: 'tmp/', type: 'folder', files: ['sess_982.tmp'] },
      { name: 'index.html', type: 'file' },
    ],
    'Container-C': [
      { name: 'data.db', type: 'file' },
    ]
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Shield className="text-primary" size={20} />
          Container Workspace Isolation
        </h3>
        <div className="flex items-center gap-2 text-xs font-mono bg-rose-500/10 text-rose-500 px-3 py-1 rounded-full border border-rose-500/20">
          <Lock size={12} />
          FILESYSTEM_RESTRICTED
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 glass-card p-4 space-y-2">
          <h4 className="text-[10px] font-mono text-muted uppercase tracking-widest mb-4 px-2">Active Containers</h4>
          {Object.keys(fileSystem).map((name) => (
            <button
              key={name}
              onClick={() => setSelectedContainer(name)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                selectedContainer === name ? 'bg-primary/20 text-primary' : 'text-muted hover:bg-white/5'
              }`}
            >
              <HardDrive size={18} />
              <span className="text-sm font-medium">{name}</span>
            </button>
          ))}
        </div>

        <div className="lg:col-span-3 glass-card p-0 flex flex-col overflow-hidden">
          <div className="bg-white/5 p-4 border-b border-border flex items-center gap-2">
            <span className="text-xs text-muted font-mono">root / workspaces /</span>
            <span className="text-xs font-bold text-primary font-mono">{selectedContainer} /</span>
          </div>

          <div className="flex-1 p-6 space-y-2">
            {(fileSystem as any)[selectedContainer].map((item: any) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center justify-between p-4 rounded-xl hover:bg-white/5 transition-all group border border-transparent hover:border-white/10"
              >
                <div className="flex items-center gap-4">
                  {item.type === 'folder' ? (
                    <Folder className="text-blue-400" size={20} />
                  ) : (
                    <File className="text-muted" size={20} />
                  )}
                  <div>
                    <p className="text-sm font-medium">{item.name}</p>
                    {item.type === 'folder' && (
                      <p className="text-[10px] text-muted">{item.files.length} items</p>
                    )}
                  </div>
                </div>
                <ChevronRight className="text-muted opacity-0 group-hover:opacity-100 transition-opacity" size={16} />
              </motion.div>
            ))}
          </div>

          <div className="p-4 bg-white/[0.02] border-t border-border mt-auto">
             <div className="flex items-center gap-3 text-xs text-amber-500/80 italic">
               <AlertTriangle size={14} />
               Cross-container file access is prohibited by kernel-level chroot.
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const AlertTriangle = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
);
