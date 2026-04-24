import React, { useState, useEffect } from 'react';
import { Map, MapPin, Maximize2, AlertTriangle, CheckCircle, Info } from 'lucide-react';

const Units = () => {
  const [lots, setLots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLot, setSelectedLot] = useState(null);

  useEffect(() => {
    const fetchLots = async () => {
      try {
        const res = await fetch('/api/lots');
        const data = await res.json();
        setLots(data);
      } catch (error) {
        console.error("Error fetching lots:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLots();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Available': return 'rgba(16, 185, 129, 0.6)'; // emerald
      case 'Occupied': return 'rgba(239, 68, 68, 0.6)';   // red
      case 'Maintenance': return 'rgba(245, 158, 11, 0.6)';// amber
      default: return 'rgba(255, 255, 255, 0.1)';
    }
  };
  
  const getStatusBorder = (status) => {
    switch (status) {
      case 'Available': return '#10b981';
      case 'Occupied': return '#ef4444';
      case 'Maintenance': return '#f59e0b';
      default: return '#ffffff';
    }
  };

  return (
    <div className="flex-col gap-lg animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="card-title text-xl flex items-center gap-sm">
            <Map size={24} className="text-primary" /> 
            Spatial Map & Units
          </h2>
          <p className="text-muted small">Interactive floor plan of Station Central Main Concourse.</p>
        </div>
        <div className="flex gap-md text-sm">
           <div className="flex items-center gap-xs"><div className="w-3 h-3 rounded-full bg-success"></div> Available</div>
           <div className="flex items-center gap-xs"><div className="w-3 h-3 rounded-full bg-danger"></div> Occupied</div>
           <div className="flex items-center gap-xs"><div className="w-3 h-3 rounded-full bg-warning"></div> Maintenance</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
        {/* Interactive Map Section */}
        <div className="card glass md:col-span-2 map-container relative">
           <div className="flex justify-between items-center mb-md">
             <h3 className="card-title">Main Concourse (Level 1)</h3>
             <button className="btn-icon"><Maximize2 size={18} /></button>
           </div>
           
           <div className="map-svg-wrapper">
              {loading ? (
                 <div className="flex justify-center items-center h-full"><p className="text-muted">Loading map data...</p></div>
              ) : (
                 <svg viewBox="0 0 200 200" className="w-full h-full floor-plan" preserveAspectRatio="xMidYMid meet">
                    {/* Floor Base */}
                    <rect x="5" y="5" width="190" height="190" rx="4" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
                    
                    {/* Entrances / Pathways */}
                    <path d="M 5 45 L 195 45 M 5 55 L 195 55" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
                    <text x="100" y="52" fill="rgba(255,255,255,0.2)" fontSize="4" textAnchor="middle" fontWeight="bold">MAIN CORRIDOR</text>

                    {/* Render Lots */}
                    {lots.map((lot) => {
                      const coords = typeof lot.coordinates_json === 'string' ? JSON.parse(lot.coordinates_json) : lot.coordinates_json;
                      if (!coords) return null;
                      
                      const isSelected = selectedLot?.id === lot.id;
                      
                      return (
                        <g 
                          key={lot.id} 
                          className={`lot-group ${isSelected ? 'selected' : ''}`}
                          onClick={() => setSelectedLot(lot)}
                        >
                          <rect 
                            x={coords.x} 
                            y={coords.y} 
                            width={coords.width} 
                            height={coords.height} 
                            rx="2"
                            fill={getStatusColor(lot.status)}
                            stroke={getStatusBorder(lot.status)}
                            strokeWidth={isSelected ? "1" : "0.5"}
                            className="lot-rect cursor-pointer transition-all hover:opacity-80"
                          />
                          <text 
                            x={coords.x + coords.width/2} 
                            y={coords.y + coords.height/2} 
                            fill="white" 
                            fontSize="3" 
                            textAnchor="middle" 
                            dominantBaseline="middle"
                            fontWeight="bold"
                            className="pointer-events-none"
                          >
                            {lot.lot_number}
                          </text>
                        </g>
                      );
                    })}
                 </svg>
              )}
           </div>
        </div>

        {/* Lot Details Sidebar */}
        <div className="card glass details-card">
           <h3 className="card-title mb-lg border-b pb-sm">Lot Details</h3>
           
           {!selectedLot ? (
             <div className="text-center text-muted py-xl flex-col items-center gap-sm">
                <MapPin size={32} opacity={0.5} />
                <p>Select a unit on the map to view details.</p>
             </div>
           ) : (
             <div className="animate-fade-in flex-col gap-md">
                <div className="flex justify-between items-start">
                   <div>
                     <h1 className="text-2xl font-bold text-primary">{selectedLot.lot_number}</h1>
                     <span className={`status-pill mt-xs inline-block ${selectedLot.status === 'Available' ? 'active' : selectedLot.status === 'Occupied' ? 'bg-danger' : 'expiring'}`}>
                       {selectedLot.status}
                     </span>
                   </div>
                   <div className="text-right">
                     <p className="text-muted small">Size</p>
                     <p className="font-bold">{selectedLot.size_m2} m²</p>
                   </div>
                </div>
                
                <div className="mt-md p-md bg-card rounded-lg border border-glass">
                   <h4 className="font-bold text-sm mb-sm text-muted">Financials</h4>
                   <div className="flex justify-between small mb-xs">
                     <span>Base Price (m²)</span>
                     <span>Rp {parseFloat(selectedLot.base_price_per_m2).toLocaleString('id-ID')}</span>
                   </div>
                   <div className="flex justify-between small font-bold border-t border-glass pt-xs mt-xs text-primary">
                     <span>Est. Monthly</span>
                     <span>Rp {(parseFloat(selectedLot.base_price_per_m2) * parseFloat(selectedLot.size_m2)).toLocaleString('id-ID')}</span>
                   </div>
                </div>
                
                {selectedLot.status === 'Occupied' && (
                  <div className="mt-sm p-md bg-card rounded-lg border border-glass">
                     <h4 className="font-bold text-sm mb-sm text-muted">Current Tenant</h4>
                     <div className="flex items-center gap-sm">
                        <div className="tenant-avatar small bg-danger text-white">
                          {selectedLot.brand_name ? selectedLot.brand_name.substring(0, 2).toUpperCase() : 'NA'}
                        </div>
                        <span className="font-bold">{selectedLot.brand_name || 'Unknown Tenant'}</span>
                     </div>
                  </div>
                )}
                
                <div className="mt-xl">
                   {selectedLot.status === 'Available' && (
                     <button className="btn btn-primary w-full">Assign Tenant</button>
                   )}
                   {selectedLot.status === 'Occupied' && (
                     <button className="btn w-full border border-glass hover-bg">View Contract</button>
                   )}
                   {selectedLot.status === 'Maintenance' && (
                     <button className="btn w-full border border-warning text-warning hover-bg">Resolve Issue</button>
                   )}
                </div>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default Units;
