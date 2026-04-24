import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Building2, User, Phone, Mail, FileText, Briefcase,
  Plus, Loader2, X, Save, Trash2, Edit3
} from 'lucide-react';
import TenantDetail from '../components/TenantDetail';

const API = '';
const CAT_OPTIONS = ['F&B', 'Retail', 'Services', 'Kiosk'];

// ─── Add Tenant Modal ─────────────────────────────────────────────────────────
const AddTenantModal = ({ onClose, onSaved }) => {
  const [form, setForm] = useState({
    company_name: '', brand_name: '', pic_name: '',
    pic_phone: '', pic_email: '', npwp: '', business_category: 'F&B'
  });
  const [saving, setSaving] = useState(false);

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`${API}/api/tenants`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form)
      });
      if (res.ok) { onSaved(); onClose(); }
    } finally { setSaving(false); }
  };

  return (
    <div style={{ position:'fixed', inset:0, zIndex:1000, background:'rgba(0,0,0,0.65)', display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem' }}>
      <div className="card glass form-card" style={{ width:'100%', maxWidth:'580px', maxHeight:'90vh', overflowY:'auto', border:'1px solid rgba(0,242,254,0.2)' }}>
        <div className="flex justify-between items-center mb-lg">
          <h3 className="card-title">Register New Tenant</h3>
          <button onClick={onClose} className="btn-icon"><X size={20}/></button>
        </div>
        <form onSubmit={save} className="form-grid">
          <div className="form-group">
            <label>Company Legal Name</label>
            <div className="input-wrapper"><Building2 size={18} className="input-icon"/>
              <input required type="text" value={form.company_name} onChange={e=>setForm(p=>({...p,company_name:e.target.value}))} placeholder="PT Mega Sejahtera"/>
            </div>
          </div>
          <div className="form-group">
            <label>Brand Name (DBA)</label>
            <div className="input-wrapper"><Briefcase size={18} className="input-icon"/>
              <input required type="text" value={form.brand_name} onChange={e=>setForm(p=>({...p,brand_name:e.target.value}))} placeholder="Kopi Kenangan"/>
            </div>
          </div>
          <div className="form-group">
            <label>Business Category</label>
            <div className="input-wrapper">
              <select value={form.business_category} onChange={e=>setForm(p=>({...p,business_category:e.target.value}))} className="glass-select w-full">
                {CAT_OPTIONS.map(c=><option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="form-group">
            <label>NPWP (Tax ID)</label>
            <div className="input-wrapper"><FileText size={18} className="input-icon"/>
              <input type="text" value={form.npwp} onChange={e=>setForm(p=>({...p,npwp:e.target.value}))} placeholder="01.234.567.8-901.000"/>
            </div>
          </div>
          <div className="form-section-title col-span-2 mt-md">Kontak PIC</div>
          <div className="form-group">
            <label>Nama Lengkap PIC</label>
            <div className="input-wrapper"><User size={18} className="input-icon"/>
              <input required type="text" value={form.pic_name} onChange={e=>setForm(p=>({...p,pic_name:e.target.value}))} placeholder="John Doe"/>
            </div>
          </div>
          <div className="form-group">
            <label>No. HP PIC</label>
            <div className="input-wrapper"><Phone size={18} className="input-icon"/>
              <input required type="tel" value={form.pic_phone} onChange={e=>setForm(p=>({...p,pic_phone:e.target.value}))} placeholder="+62 812-3456-7890"/>
            </div>
          </div>
          <div className="form-group col-span-2">
            <label>Email PIC</label>
            <div className="input-wrapper"><Mail size={18} className="input-icon"/>
              <input required type="email" value={form.pic_email} onChange={e=>setForm(p=>({...p,pic_email:e.target.value}))} placeholder="john.doe@example.com"/>
            </div>
          </div>
          <div className="col-span-2 flex justify-end gap-sm mt-md">
            <button type="button" onClick={onClose} className="btn btn-ghost" style={{padding:'9px 20px',fontSize:'14px'}}>Batal</button>
            <button type="submit" className="btn btn-primary" disabled={saving} style={{padding:'9px 20px',fontSize:'14px'}}>
              {saving ? <Loader2 className="animate-spin" size={18}/> : <><Save size={16}/> Simpan</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─── Edit Tenant Modal ────────────────────────────────────────────────────────
const EditTenantModal = ({ tenant, onClose, onSaved, onDeleted }) => {
  const [form, setForm] = useState({ ...tenant });
  const [saving, setSaving] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await fetch(`${API}/api/tenants/${tenant.id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form)
      });
      onSaved(); onClose();
    } finally { setSaving(false); }
  };

  const deleteTenant = async () => {
    if (!confirming) { setConfirming(true); return; }
    await fetch(`${API}/api/tenants/${tenant.id}`, { method: 'DELETE' });
    onDeleted(); onClose();
  };

  return (
    <div style={{ position:'fixed', inset:0, zIndex:1000, background:'rgba(0,0,0,0.65)', display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem' }}>
      <div className="card glass form-card" style={{ width:'100%', maxWidth:'580px', maxHeight:'90vh', overflowY:'auto', border:'1px solid rgba(0,242,254,0.2)' }}>
        <div className="flex justify-between items-center mb-lg">
          <h3 className="card-title flex items-center gap-sm"><Edit3 size={18} className="text-primary"/> Edit Tenant</h3>
          <button onClick={onClose} className="btn-icon"><X size={20}/></button>
        </div>
        <form onSubmit={save} className="form-grid">
          <div className="form-group">
            <label>Company Legal Name</label>
            <div className="input-wrapper"><Building2 size={18} className="input-icon"/>
              <input required type="text" value={form.company_name||''} onChange={e=>setForm(p=>({...p,company_name:e.target.value}))}/>
            </div>
          </div>
          <div className="form-group">
            <label>Brand Name</label>
            <div className="input-wrapper"><Briefcase size={18} className="input-icon"/>
              <input required type="text" value={form.brand_name||''} onChange={e=>setForm(p=>({...p,brand_name:e.target.value}))}/>
            </div>
          </div>
          <div className="form-group">
            <label>Business Category</label>
            <div className="input-wrapper">
              <select value={form.business_category||'F&B'} onChange={e=>setForm(p=>({...p,business_category:e.target.value}))} className="glass-select w-full">
                {CAT_OPTIONS.map(c=><option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="form-group">
            <label>NPWP</label>
            <div className="input-wrapper"><FileText size={18} className="input-icon"/>
              <input type="text" value={form.npwp||''} onChange={e=>setForm(p=>({...p,npwp:e.target.value}))}/>
            </div>
          </div>
          <div className="form-section-title col-span-2 mt-md">Kontak PIC</div>
          <div className="form-group">
            <label>Nama PIC</label>
            <div className="input-wrapper"><User size={18} className="input-icon"/>
              <input required type="text" value={form.pic_name||''} onChange={e=>setForm(p=>({...p,pic_name:e.target.value}))}/>
            </div>
          </div>
          <div className="form-group">
            <label>No. HP PIC</label>
            <div className="input-wrapper"><Phone size={18} className="input-icon"/>
              <input required type="tel" value={form.pic_phone||''} onChange={e=>setForm(p=>({...p,pic_phone:e.target.value}))}/>
            </div>
          </div>
          <div className="form-group col-span-2">
            <label>Email PIC</label>
            <div className="input-wrapper"><Mail size={18} className="input-icon"/>
              <input required type="email" value={form.pic_email||''} onChange={e=>setForm(p=>({...p,pic_email:e.target.value}))}/>
            </div>
          </div>
          <div className="col-span-2 flex justify-between items-center mt-md">
            <button type="button" onClick={deleteTenant} className="btn btn-danger flex items-center gap-xs" style={{padding:'9px 18px',fontSize:'14px'}}>
              <Trash2 size={15}/> {confirming ? 'Konfirmasi Hapus?' : 'Hapus Tenant'}
            </button>
            <div className="flex gap-sm">
              <button type="button" onClick={onClose} className="btn btn-ghost" style={{padding:'9px 18px',fontSize:'14px'}}>Batal</button>
              <button type="submit" className="btn btn-primary flex items-center gap-xs" disabled={saving} style={{padding:'9px 18px',fontSize:'14px'}}>
                {saving ? <Loader2 className="animate-spin" size={16}/> : <><Save size={15}/> Simpan</>}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
const Tenants = () => {
  const { stationId }                     = useParams();
  const [tenants, setTenants]             = useState([]);
  const [stationName, setStationName]     = useState('');
  const [selectedTenant, setSelectedTenant] = useState(null);
  const [showAdd, setShowAdd]             = useState(false);
  const [editTenant, setEditTenant]       = useState(null);
  const [filterStation, setFilterStation] = useState('');
  const [filterCat, setFilterCat]         = useState('');
  const [searchQ, setSearchQ]             = useState('');

  const fetchTenants = async () => {
    try {
      const url = stationId ? `${API}/api/tenants?station_id=${stationId}` : `${API}/api/tenants`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setTenants(data);
        if (stationId && data.length > 0) setStationName(data[0].station_name || '');
        else setStationName('');
      }
    } catch (e) { console.error(e); }
  };

  useEffect(() => { fetchTenants(); }, [stationId]);

  // Derive station list from data
  const stations = [...new Set(tenants.map(t => t.station_name).filter(Boolean))].sort();

  const filtered = tenants.filter(t => {
    const matchStation = !filterStation || t.station_name === filterStation;
    const matchCat     = !filterCat     || t.business_category === filterCat;
    const matchSearch  = !searchQ       || [t.brand_name, t.company_name, t.pic_name].join(' ').toLowerCase().includes(searchQ.toLowerCase());
    return matchStation && matchCat && matchSearch;
  });

  if (selectedTenant) {
    return (
      <TenantDetail
        tenant={selectedTenant}
        onBack={() => setSelectedTenant(null)}
        onEdit={(t) => { setEditTenant(t); setSelectedTenant(null); }}
      />
    );
  }

  return (
    <div className="flex-col gap-lg">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="card-title text-xl">
            {stationName ? `Tenant — ${stationName}` : 'Tenant Management'}
          </h2>
          <p className="text-muted small">
            {stationName
              ? `Menampilkan ${filtered.length} tenant di ${stationName}.`
              : `Kelola semua tenant multi-stasiun (${tenants.length} tenant, ${stations.length} stasiun).`}
          </p>
        </div>
        <button className="btn btn-primary flex items-center gap-sm" onClick={() => setShowAdd(true)}>
          <Plus size={17}/> Tambah Tenant
        </button>
      </div>

      {/* Filters */}
      <div className="card glass" style={{ padding: '14px 20px' }}>
        <div className="flex flex-wrap gap-md items-center">
          <input
            value={searchQ} onChange={e => setSearchQ(e.target.value)}
            placeholder="Cari nama brand / perusahaan / PIC..."
            style={{ flex:1, minWidth:'200px', background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'20px', padding:'8px 16px', color:'white', fontSize:'14px', fontFamily:'inherit', outline:'none' }}
          />
          <select value={filterStation} onChange={e => setFilterStation(e.target.value)}
            style={{ background:'rgba(20,27,45,0.95)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'20px', padding:'8px 16px', color: filterStation?'white':'#94a3b8', fontSize:'13px', fontFamily:'inherit', cursor:'pointer' }}>
            <option value="">Semua Stasiun</option>
            {stations.map(s=><option key={s} value={s}>{s}</option>)}
          </select>
          <select value={filterCat} onChange={e => setFilterCat(e.target.value)}
            style={{ background:'rgba(20,27,45,0.95)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'20px', padding:'8px 16px', color: filterCat?'white':'#94a3b8', fontSize:'13px', fontFamily:'inherit', cursor:'pointer' }}>
            <option value="">Semua Kategori</option>
            {CAT_OPTIONS.map(c=><option key={c} value={c}>{c}</option>)}
          </select>
          {(filterStation||filterCat||searchQ) && (
            <button onClick={()=>{setFilterStation('');setFilterCat('');setSearchQ('');}} className="tiny text-muted" style={{ cursor:'pointer', background:'none', border:'none', color:'#94a3b8' }}>
              × Reset
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="card glass">
        <div className="flex justify-between items-center mb-md">
          <h3 className="card-title">Daftar Tenant <span className="text-muted" style={{fontWeight:400,fontSize:'0.875rem'}}>({filtered.length} tampil)</span></h3>
          <p className="tiny text-muted">Klik baris untuk melihat detail · Double-click untuk edit</p>
        </div>
        <div className="table-responsive">
          <table className="w-full text-left">
            <thead>
              <tr className="text-muted tiny border-b">
                <th className="pb-sm font-normal">Brand</th>
                <th className="pb-sm font-normal">Perusahaan</th>
                <th className="pb-sm font-normal">Stasiun</th>
                <th className="pb-sm font-normal">Kategori</th>
                <th className="pb-sm font-normal">PIC</th>
                <th className="pb-sm font-normal">Unit</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0
                ? <tr><td colSpan="6" className="text-center py-xl text-muted">Tidak ada tenant ditemukan.</td></tr>
                : filtered.map(t => (
                  <tr
                    key={t.id}
                    className="border-b-subtle hover-bg cursor-pointer"
                    style={{ transition: 'background 0.12s' }}
                    onClick={() => setSelectedTenant(t)}
                    onDoubleClick={(e) => { e.stopPropagation(); setEditTenant(t); }}
                    title="Klik: lihat detail | Double-click: edit"
                  >
                    <td className="py-sm">
                      <span className="font-bold">{t.brand_name}</span>
                    </td>
                    <td className="py-sm small text-muted">{t.company_name}</td>
                    <td className="py-sm small">{t.station_name || '—'}</td>
                    <td className="py-sm">
                      <span className="status-pill active" style={{ fontSize: '11px' }}>{t.business_category}</span>
                    </td>
                    <td className="py-sm small">
                      <div>{t.pic_name}</div>
                      <div className="tiny text-muted">{t.pic_phone}</div>
                    </td>
                    <td className="py-sm small">{t.lot_number || '—'}</td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      {showAdd && <AddTenantModal onClose={() => setShowAdd(false)} onSaved={fetchTenants} />}
      {editTenant && (
        <EditTenantModal
          tenant={editTenant}
          onClose={() => setEditTenant(null)}
          onSaved={fetchTenants}
          onDeleted={fetchTenants}
        />
      )}
    </div>
  );
};

export default Tenants;
