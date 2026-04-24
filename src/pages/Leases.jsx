import React, { useState, useEffect } from 'react';
import { FileText, Search, Plus, X, ChevronRight } from 'lucide-react';

const fmtIDR = (v) => `Rp ${Number(v).toLocaleString('id-ID')}`;

// ─── Lease Detail Modal ───────────────────────────────────────────────────────
const LeaseDetailModal = ({ lease, onClose }) => {
  if (!lease) return null;
  const monthlyRent = parseFloat(lease.size_m2) * parseFloat(lease.base_price_per_m2);

  return (
    <div style={{ position:'fixed', inset:0, zIndex:1000, background:'rgba(0,0,0,0.65)', display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem' }}>
      <div className="card glass" style={{ width:'100%', maxWidth:'520px', border:'1px solid rgba(0,242,254,0.2)', position:'relative' }}>
        <div className="flex justify-between items-start pb-md border-b border-glass mb-md">
          <div>
            <p className="tiny text-muted">Contract ID</p>
            <h3 className="card-title text-primary">CTR-{lease.contractRef}</h3>
          </div>
          <button onClick={onClose} className="btn-icon"><X size={20}/></button>
        </div>

        <div className="grid grid-cols-2 gap-md">
          {[
            ['Tenant Brand',    lease.brand_name],
            ['Unit Lot',        lease.lot_number],
            ['Luas Unit',       `${lease.size_m2} m²`],
            ['Harga/m²',        fmtIDR(lease.base_price_per_m2)],
            ['Sewa Bulanan',    fmtIDR(monthlyRent)],
            ['Status',          lease.status || 'Occupied'],
          ].map(([k,v],i) => (
            <div key={i} style={{ background:'rgba(255,255,255,0.04)', borderRadius:'10px', padding:'12px 14px', border:'1px solid rgba(255,255,255,0.07)' }}>
              <p className="tiny text-muted">{k}</p>
              <p className="small font-bold" style={{ marginTop:'4px', color: k==='Sewa Bulanan'?'#10b981':k==='Status'?'#10b981':'white' }}>{v}</p>
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-sm mt-lg">
          <button onClick={onClose} className="btn btn-ghost" style={{ padding:'8px 20px', fontSize:'14px' }}>Tutup</button>
          <button className="btn btn-primary flex items-center gap-xs" style={{ padding:'8px 20px', fontSize:'14px' }}>
            <FileText size={15}/> Lihat PDF Kontrak
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
const Leases = () => {
  const [leases, setLeases]       = useState([]);
  const [loading, setLoading]     = useState(true);
  const [selected, setSelected]   = useState(null);
  const [search, setSearch]       = useState('');

  useEffect(() => {
    (async () => {
      try {
        const res  = await fetch('/api/lots');
        const data = await res.json();
        // Only lots with a tenant (active contract)
        const active = data.filter(l => l.brand_name).map((l, i) => ({
          ...l,
          contractRef: String(10000 + (i * 7 + 177) * 131 % 90000).padStart(5,'0'),
        }));
        setLeases(active);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    })();
  }, []);

  const filtered = leases.filter(l =>
    !search ||
    [l.brand_name, l.lot_number, l.contractRef].join(' ').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex-col gap-lg animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="card-title text-xl flex items-center gap-sm">
            <FileText size={22} className="text-primary" /> Lease Agreements
          </h2>
          <p className="text-muted small">Kelola kontrak aktif dan alokasi unit tenant.</p>
        </div>
        <button className="btn btn-primary flex items-center gap-sm">
          <Plus size={17}/> New Contract
        </button>
      </div>

      <div className="card glass">
        <div className="flex justify-between items-center mb-md">
          <div className="search-bar-container bg-card border border-glass">
            <Search size={16} className="text-muted"/>
            <input
              type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Cari kontrak, tenant, atau unit..."
              className="search-input"
            />
          </div>
          <p className="tiny text-muted">{filtered.length} kontrak aktif · Klik baris untuk detail</p>
        </div>

        <div className="table-responsive">
          <table className="w-full text-left">
            <thead>
              <tr className="text-muted tiny border-b">
                <th className="pb-sm font-normal">Contract ID</th>
                <th className="pb-sm font-normal">Tenant Brand</th>
                <th className="pb-sm font-normal">Unit Lot</th>
                <th className="pb-sm font-normal">Sewa/Bulan</th>
                <th className="pb-sm font-normal">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" className="text-center py-xl text-muted">Memuat data...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan="5" className="text-center py-xl text-muted">Tidak ada kontrak ditemukan.</td></tr>
              ) : (
                filtered.map((l) => (
                  <tr
                    key={l.id}
                    className="border-b-subtle hover-bg cursor-pointer"
                    style={{ transition: 'background 0.1s' }}
                    onClick={() => setSelected(l)}
                  >
                    <td className="py-sm font-bold text-primary small">CTR-{l.contractRef}</td>
                    <td className="py-sm small">{l.brand_name}</td>
                    <td className="py-sm small">{l.lot_number}</td>
                    <td className="py-sm small">
                      {fmtIDR(parseFloat(l.size_m2) * parseFloat(l.base_price_per_m2))}
                    </td>
                    <td className="py-sm">
                      <span className="status-pill active">Active</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selected && <LeaseDetailModal lease={selected} onClose={() => setSelected(null)} />}
    </div>
  );
};

export default Leases;
