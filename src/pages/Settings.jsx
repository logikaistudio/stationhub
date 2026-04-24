import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Bell, Shield, Database, Building2, Plus, Edit3, Trash2, X, Loader2 } from 'lucide-react';

const API = '';

const StationModal = ({ station, onClose, onSaved }) => {
  const [name, setName] = useState(station ? station.name : '');
  const [saving, setSaving] = useState(false);

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (station) {
        await fetch(`${API}/api/stations/${station.id}`, {
          method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name })
        });
      } else {
        await fetch(`${API}/api/stations`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name })
        });
      }
      onSaved();
      onClose();
    } catch (err) { console.error(err); setSaving(false); }
  };

  return (
    <div style={{ position:'fixed', inset:0, zIndex:1000, background:'rgba(0,0,0,0.65)', display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem' }}>
      <div className="card glass form-card" style={{ width:'100%', maxWidth:'400px' }}>
        <div className="flex justify-between items-center mb-md">
          <h3 className="card-title">{station ? 'Edit Stasiun' : 'Tambah Stasiun'}</h3>
          <button onClick={onClose} className="btn-icon"><X size={20}/></button>
        </div>
        <form onSubmit={save}>
          <input
            required autoFocus
            placeholder="Nama Stasiun (e.g., Stasiun Bekasi)"
            className="w-full mb-md"
            style={{ background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'10px', padding:'10px 14px', color:'white', outline:'none' }}
            value={name}
            onChange={e => setName(e.target.value)}
          />
          <div className="flex justify-end gap-sm">
            <button type="button" onClick={onClose} className="btn btn-ghost">Batal</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? <Loader2 className="animate-spin" size={16}/> : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Settings = () => {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showStationModal, setShowStationModal] = useState(false);
  const [editStation, setEditStation] = useState(null);

  const fetchStations = async () => {
    try {
      const res = await fetch(`${API}/api/stations`);
      if (res.ok) {
        const data = await res.json();
        setStations(data.sort((a, b) => a.name.localeCompare(b.name)));
      }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchStations(); }, []);

  const handleDeleteStation = async (id) => {
    if (!window.confirm('Yakin ingin menghapus stasiun ini? Ini akan gagal jika stasiun masih memiliki lot atau tenant yang aktif.')) return;
    try {
      const res = await fetch(`${API}/api/stations/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json();
        alert(`Gagal: ${data.error || 'Server error'}`);
      } else {
        fetchStations();
      }
    } catch (e) { console.error(e); alert('Error deleting station'); }
  };

  return (
    <div className="flex-col gap-lg animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="card-title text-xl flex items-center gap-sm">
            <SettingsIcon size={24} className="text-primary" /> 
            System Settings
          </h2>
          <p className="text-muted small">Konfigurasi aplikasi dan manajemen master data.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-lg">
        {/* General Configuration */}
        <div className="card glass">
           <h3 className="card-title mb-lg border-b border-glass pb-sm">General Configuration</h3>
           <div className="flex-col gap-md">
             <div className="flex justify-between items-center bg-card p-md rounded-lg border border-glass">
                <div className="flex items-center gap-md">
                   <div className="p-sm bg-primary bg-opacity-20 rounded-md text-primary"><Bell size={20} /></div>
                   <div>
                     <p className="font-bold">Email Notifications</p>
                     <p className="tiny text-muted">Receive alerts for expiring contracts</p>
                   </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
             </div>

             <div className="flex justify-between items-center bg-card p-md rounded-lg border border-glass">
                <div className="flex items-center gap-md">
                   <div className="p-sm bg-success bg-opacity-20 rounded-md text-success"><Shield size={20} /></div>
                   <div>
                     <p className="font-bold">Two-Factor Authentication</p>
                     <p className="tiny text-muted">Enhanced security for admin login</p>
                   </div>
                </div>
                <button className="btn border border-glass hover-bg px-md py-xs tiny">Enable</button>
             </div>

             <div className="flex justify-between items-center bg-card p-md rounded-lg border border-glass">
                <div className="flex items-center gap-md">
                   <div className="p-sm bg-warning bg-opacity-20 rounded-md text-warning"><Database size={20} /></div>
                   <div>
                     <p className="font-bold">Database Backup</p>
                     <p className="tiny text-muted">Manual trigger for Postgres dump</p>
                   </div>
                </div>
                <button className="btn border border-glass hover-bg px-md py-xs tiny text-primary">Backup Now</button>
             </div>
           </div>
        </div>

        {/* Station Management */}
        <div className="card glass">
           <div className="flex justify-between items-center mb-lg border-b border-glass pb-sm">
             <h3 className="card-title">Manajemen Stasiun</h3>
             <button onClick={() => { setEditStation(null); setShowStationModal(true); }} className="btn btn-primary flex items-center gap-xs" style={{ padding: '6px 12px', fontSize: '13px' }}>
               <Plus size={14}/> Tambah
             </button>
           </div>
           
           <div className="flex-col gap-sm">
             {loading ? <p className="text-muted small text-center py-md">Memuat stasiun...</p> : 
              stations.length === 0 ? <p className="text-muted small text-center py-md">Belum ada stasiun.</p> :
              stations.map(s => (
               <div key={s.id} className="flex justify-between items-center bg-card p-md rounded-lg border border-glass hover-bg">
                  <div className="flex items-center gap-md">
                     <div className="p-sm bg-primary bg-opacity-10 rounded-md text-primary"><Building2 size={18} /></div>
                     <p className="font-bold small">{s.name}</p>
                  </div>
                  <div className="flex gap-xs">
                    <button onClick={() => { setEditStation(s); setShowStationModal(true); }} className="btn-icon text-muted hover-text-main p-xs rounded-md border border-glass" title="Edit">
                      <Edit3 size={14} />
                    </button>
                    <button onClick={() => handleDeleteStation(s.id)} className="btn-icon text-danger p-xs rounded-md border border-glass" title="Hapus">
                      <Trash2 size={14} />
                    </button>
                  </div>
               </div>
             ))}
           </div>
        </div>
      </div>

      {showStationModal && (
        <StationModal 
          station={editStation} 
          onClose={() => setShowStationModal(false)} 
          onSaved={fetchStations} 
        />
      )}
    </div>
  );
};

export default Settings;
