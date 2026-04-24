import React from 'react';
import { MoreVertical } from 'lucide-react';

const GaugeChart = ({ value, label, percentage, colorStart, colorEnd, showNeedle }) => {
  const radius = 60;
  const circumference = Math.PI * radius; // Half circle
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="gauge-container">
      <div className="flex justify-between items-center mb-md">
        <h3 className="card-title">{label}</h3>
        <MoreVertical size={16} className="text-muted" />
      </div>
      <div className="gauge-svg-container">
        <svg viewBox="0 0 160 100" className="gauge-svg">
          {/* Background Arc */}
          <path
            d="M 20 80 A 60 60 0 0 1 140 80"
            fill="none"
            stroke="rgba(255, 255, 255, 0.05)"
            strokeWidth="12"
            strokeLinecap="round"
          />
          {/* Foreground Arc */}
          <path
            d="M 20 80 A 60 60 0 0 1 140 80"
            fill="none"
            stroke={`url(#gradient-${label.replace(/\s+/g, '')})`}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
          />
          <defs>
            <linearGradient id={`gradient-${label.replace(/\s+/g, '')}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={colorStart} />
              <stop offset="100%" stopColor={colorEnd} />
            </linearGradient>
          </defs>
          
          {/* Needle - Optional */}
          {showNeedle && (
            <g transform={`rotate(${(percentage / 100) * 180 - 90} 80 80)`}>
               <line x1="80" y1="80" x2="80" y2="35" stroke="var(--text-main)" strokeWidth="2" strokeLinecap="round" />
               <circle cx="80" cy="80" r="4" fill="var(--text-main)" />
            </g>
          )}
        </svg>
        <div className="gauge-value-container">
          <h2 className="gauge-value">{value}</h2>
          {label === 'Occupancy Rate' ? (
             <p className="gauge-sub">Occupancy</p>
          ) : (
             <p className="gauge-sub">Units</p>
          )}
        </div>
      </div>
      <div className="flex justify-between gauge-labels">
        <span className="tiny text-muted">{percentage === 92.5 ? '92.5%' : ''}</span>
        <span className="tiny text-success">{percentage === 92.5 ? 'High' : '92.5%'}</span>
      </div>
    </div>
  );
};

export default GaugeChart;
