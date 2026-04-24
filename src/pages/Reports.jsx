import React from 'react';
import { BarChart3, TrendingUp, Users, Download } from 'lucide-react';

const Reports = () => {
  return (
    <div className="flex-col gap-lg animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="card-title text-xl flex items-center gap-sm">
            <BarChart3 size={24} className="text-primary" /> 
            Analytics & Reports
          </h2>
          <p className="text-muted small">Generate insights and export property data.</p>
        </div>
        <button className="btn btn-primary flex items-center gap-sm">
          <Download size={18} /> Export PDF
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
        <div className="card glass lg:col-span-2">
           <h3 className="card-title mb-md flex items-center gap-sm"><TrendingUp size={18}/> Revenue Trends (YTD)</h3>
           <div className="h-64 flex items-center justify-center border border-glass rounded-lg bg-card text-muted">
              [Chart Visualization Placeholder]
           </div>
        </div>
        <div className="card glass">
           <h3 className="card-title mb-md flex items-center gap-sm"><Users size={18}/> Tenant Demographics</h3>
           <div className="h-64 flex items-center justify-center border border-glass rounded-lg bg-card text-muted">
              [Pie Chart Placeholder]
           </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
