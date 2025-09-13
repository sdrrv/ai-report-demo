import React from 'react';
import { Crown } from 'lucide-react';

interface PremiumOverlayProps {
  children: React.ReactNode;
  className?: string;
}

const PremiumOverlay: React.FC<PremiumOverlayProps> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <div className={`relative ${className}`}>
      {/* Original content */}
      {children}
      
      {/* Premium overlay */}
      <div className="absolute inset-0 rounded-2xl bg-white/30 backdrop-blur-sm border border-slate-200/50 flex items-center justify-center">
        <div className="rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-2 shadow-lg backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <Crown className="h-4 w-4 text-white" />
            <span className="text-sm font-semibold text-white">Pro</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumOverlay;