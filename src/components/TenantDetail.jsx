import React, { useState, useEffect } from 'react';
import {
  ArrowLeft, FileText, Zap, DollarSign, Layout, Wrench, AlertCircle,
  Building2, User, Phone, Mail, MapPin, Edit3, Trash2, X, Plus, Clock, Send
} from 'lucide-react';

const API = '';
const fmtDate = (d) => new Date(d).toLocaleDateString('id-ID', { day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' });

const PRIORITY_OPTS = ['Normal','Tinggi','Kritis'];
const STATUS_OPTS   = ['Open','In Progress','Resolved'];
const CATEGORY_OPTS = ['AC & Ventilasi','Listrik','Plumbing','Konstruksi','Kebersihan','Umum'];
const STATUS_COLOR  = { Open:'#f59e0b', 'In Progress':'#00f2fe', Resolved:'#10b981' };
const PRIORITY_COLOR = { Normal:'#94a3b8', Tinggi:'#f59e0b', Kritis:'#ef4444' };

// ─── Ticket Modal ────────────────────────────────────────────────────────────
const TicketModal = ({ ticket, onClose, onUpdated }) => {
  const [detail, setDetail] = useState(null);
  const [msg, setMsg]       = useState('');
  const [by, setBy]         = useState('Staff');
  const [newStatus, setNewStatus] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch(`${API}/api/tickets/${ticket.id}`)
      .then(r => r.json()).then(setDetail);
  }, [ticket.id]);

  const submit = async () => {
    if (!msg.trim()) return;
    setSubmitting(true);
    await fetch(`${API}/api/tickets/${ticket.id}/updates`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: msg, updated_by: by, new_status: newStatus || undefined }),
    });
    const updated = await fetch(`${API}/api/tickets/${ticket.id}`).then(r => r.json());
    setDetail(updated);
    setMsg(''); setNewStatus(''); setSubmitting(false);
    onUpdated?.();
  };

  return (
    <div style={{ position:'fixed', inset:0, zIndex:1000, background:'rgba(0,0,0,0.65)', display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem' }}>
      <div className="card glass" style={{ width:'100%', maxWidth:'600px', maxHeight:'90vh', overflowY:'auto', position:'relative', border:'1px solid rgba(0,242,254,0.2)' }}>
        {/* Header */}
        <div className="flex justify-between items-start pb-md border-b border-glass mb-md">
          <div>
            <h3 className="card-title">{ticket.title}</h3>
            <p className="tiny text-muted mt-xs">{ticket.category} · Dibuat {fmtDate(ticket.created_at)}</p>
          </div>
          <button onClick={onClose} className="btn-icon"><X size={20} /></button>
        </div>

        {/* Status & Priority pills */}
        <div className="flex gap-sm mb-md" style={{ flexWrap:'wrap' }}>
          <span className="status-pill" style={{ color: STATUS_COLOR[ticket.status], borderColor: STATUS_COLOR[ticket.status] }}>{ticket.status}</span>
          <span className="status-pill" style={{ color: PRIORITY_COLOR[ticket.priority], borderColor: PRIORITY_COLOR[ticket.priority] }}>Prioritas: {ticket.priority}</span>
          {ticket.brand_name && <span className="status-pill" style={{ color:'#94a3b8', borderColor:'rgba(255,255,255,0.15)' }}>{ticket.brand_name}</span>}
        </div>

        {ticket.description && (
          <p className="small text-muted mb-md" style={{ background:'rgba(255,255,255,0.04)', padding:'10px 12px', borderRadius:'8px' }}>{ticket.description}</p>
        )}

        {/* Timeline */}
        <div className="flex-col gap-sm mb-md">
          <h4 className="small font-bold flex items-center gap-xs mb-sm"><Clock size={14} /> Riwayat Update</h4>
          {!detail
            ? <p className="tiny text-muted">Memuat...</p>
            : detail.updates?.length === 0
              ? <p className="tiny text-muted">Belum ada update.</p>
              : detail.updates.map((u, i) => (
                <div key={i} style={{ borderLeft:'2px solid rgba(0,242,254,0.3)', paddingLeft:'12px', marginLeft:'4px' }}>
                  <p className="small">{u.message}</p>
                  <p className="tiny text-muted">{u.updated_by} · {fmtDate(u.created_at)}
                    {u.new_status && <span style={{ marginLeft:'8px', color: STATUS_COLOR[u.new_status] || '#94a3b8' }}>→ {u.new_status}</span>}
                  </p>
                </div>
              ))
          }
        </div>

        {/* Add Update Form */}
        <div style={{ background:'rgba(255,255,255,0.04)', borderRadius:'12px', padding:'14px', border:'1px solid rgba(255,255,255,0.08)' }}>
          <h4 className="small font-bold mb-sm">Tambah Update</h4>
          <textarea
            value={msg} onChange={e => setMsg(e.target.value)}
            placeholder="Tulis update / catatan progress..."
            style={{ width:'100%', background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'8px', padding:'10px', color:'white', fontSize:'14px', fontFamily:'inherit', resize:'vertical', minHeight:'80px' }}
          />
          <div className="flex gap-sm mt-sm" style={{ flexWrap:'wrap' }}>
            <input value={by} onChange={e => setBy(e.target.value)} placeholder="Nama pelapor"
              style={{ flex:1, minWidth:'120px', background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'8px', padding:'8px 12px', color:'white', fontSize:'13px', fontFamily:'inherit' }}
            />
            <select value={newStatus} onChange={e => setNewStatus(e.target.value)}
              style={{ flex:1, minWidth:'140px', background:'rgba(20,27,45,0.9)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'8px', padding:'8px 12px', color: newStatus ? STATUS_COLOR[newStatus] : '#94a3b8', fontSize:'13px', fontFamily:'inherit' }}
            >
              <option value="">-- Update Status --</option>
              {STATUS_OPTS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <button onClick={submit} disabled={submitting || !msg.trim()}
              className="btn btn-primary flex items-center gap-xs"
              style={{ padding:'8px 16px', fontSize:'13px', opacity: submitting || !msg.trim() ? 0.5 : 1 }}
            >
              <Send size={14} /> Kirim
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Utility Card ─────────────────────────────────────────────────────────────
const UtilCard = ({ icon, label, color, rows }) => (
  <div className="card" style={{ background:'rgba(255,255,255,0.04)', border:`1px solid ${color}30`, borderRadius:'12px', padding:'1rem' }}>
    <div className="flex items-center gap-sm mb-md" style={{ color }}>
      {icon} <span className="font-bold">{label}</span>
    </div>
    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'8px' }}>
      {rows.map(([k, v], i) => (
        <div key={i}>
          <p className="tiny text-muted">{k}</p>
          <p className="small font-bold" style={{ color:'white', marginTop:'2px' }}>{v}</p>
        </div>
      ))}
    </div>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const TenantDetail = ({ tenant, onBack }) => {
  const [activeTab, setActiveTab] = useState('kontrak');
  const [tickets, setTickets]     = useState([]);
  const [selTicket, setSelTicket] = useState(null);
  const [showNewForm, setShowNewForm] = useState(false);
  const [newTicket, setNewTicket] = useState({ title:'', description:'', category:'Umum', priority:'Normal' });

  const tabs = [
    { id:'kontrak',     label:'Kontrak',            icon:<FileText size={15}/> },
    { id:'bangunan',    label:'Bangunan & Utilities', icon:<Zap size={15}/> },
    { id:'billing',     label:'Billing',             icon:<DollarSign size={15}/> },
    { id:'layout',      label:'Layout',              icon:<Layout size={15}/> },
    { id:'maintenance', label:'Maintenance History', icon:<Wrench size={15}/> },
    { id:'pengajuan',   label:'Pengajuan Perbaikan', icon:<AlertCircle size={15}/> },
  ];

  useEffect(() => {
    if (activeTab === 'pengajuan') fetchTickets();
  }, [activeTab]);

  const fetchTickets = async () => {
    try {
      const r = await fetch(`${API}/api/tickets/tenant/${tenant.id}`);
      if (r.ok) setTickets(await r.json());
    } catch (e) { console.error(e); }
  };

  const submitNewTicket = async () => {
    if (!newTicket.title.trim()) return;
    await fetch(`${API}/api/tickets`, {
      method:'POST',
      headers:{ 'Content-Type':'application/json' },
      body: JSON.stringify({ ...newTicket, tenant_id: tenant.id }),
    });
    setNewTicket({ title:'', description:'', category:'Umum', priority:'Normal' });
    setShowNewForm(false);
    fetchTickets();
  };

  return (
    <div className="flex-col gap-md animate-fade-in w-full">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-glass pb-md">
        <div className="flex items-center gap-md">
          <button onClick={onBack} className="btn-icon bg-card border border-glass hover-bg p-xs rounded-md">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="card-title text-xl">{tenant.brand_name}</h2>
            <p className="text-muted small">{tenant.company_name} · {tenant.business_category}</p>
          </div>
        </div>
        <div className="flex items-center gap-sm">
          <button className="btn btn-ghost flex items-center gap-xs" style={{ padding:'8px 18px', fontSize:'14px' }}>
            <Edit3 size={15}/> Edit
          </button>
          <button className="btn btn-danger flex items-center gap-xs" style={{ padding:'8px 18px', fontSize:'14px' }}>
            <Trash2 size={15}/> Delete
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col lg:flex-row gap-lg mt-md">
        {/* Sidebar */}
        <div className="card glass h-fit" style={{ width:'100%', maxWidth:'240px', padding:'1.25rem' }}>
          <div className="text-center pb-md border-b border-glass mb-md">
            <h3 className="font-bold">{tenant.brand_name}</h3>
            <span className="status-pill active mt-xs inline-block">Active Tenant</span>
          </div>
          <div className="flex-col gap-sm" style={{ fontSize:'14px' }}>
            <p className="tiny text-muted uppercase tracking-wider font-bold mb-xs">Kontak PIC</p>
            <div className="flex items-start gap-sm"><User size={14} className="text-muted shrink-0" /><span>{tenant.pic_name}</span></div>
            <div className="flex items-start gap-sm"><Phone size={14} className="text-muted shrink-0" /><span>{tenant.pic_phone}</span></div>
            <div className="flex items-start gap-sm"><Mail size={14} className="text-muted shrink-0" /><span style={{ wordBreak:'break-all' }}>{tenant.pic_email}</span></div>
            <p className="tiny text-muted uppercase tracking-wider font-bold mt-sm mb-xs">Legal</p>
            <div className="flex items-start gap-sm"><Building2 size={14} className="text-muted shrink-0" /><span>{tenant.company_name}</span></div>
            <div className="flex items-start gap-sm"><FileText size={14} className="text-muted shrink-0" /><span>NPWP: {tenant.npwp || '-'}</span></div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col gap-md">
          <div className="tab-nav">
            {tabs.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}>
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          <div className="card glass" style={{ minHeight:'380px' }}>
            {/* ── Kontrak ── */}
            {activeTab === 'kontrak' && (
              <div className="animate-fade-in flex-col gap-md">
                <h3 className="card-title border-b border-glass pb-sm mb-md">Informasi Kontrak</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
                  {[['No Kontrak','CTR-2026-001'],['Tanggal Mulai','01 Jan 2026'],['Tanggal Berakhir','31 Dec 2027'],['Nilai Sewa/Bulan','Rp 15.000.000']].map(([k,v],i) => (
                    <div key={i} style={{ background:'rgba(255,255,255,0.04)', borderRadius:'10px', padding:'14px', border:'1px solid rgba(255,255,255,0.07)' }}>
                      <p className="tiny text-muted">{k}</p>
                      <p className="font-bold" style={{ marginTop:'4px', color: k==='Nilai Sewa/Bulan'?'#10b981':'white' }}>{v}</p>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-center gap-sm text-muted cursor-pointer hover-bg transition-colors"
                  style={{ border:'1px dashed rgba(255,255,255,0.2)', borderRadius:'10px', padding:'14px', marginTop:'4px' }}>
                  <FileText size={18}/> Lihat Dokumen Kontrak (PDF)
                </div>
              </div>
            )}

            {/* ── Bangunan ── */}
            {activeTab === 'bangunan' && (
              <div className="animate-fade-in flex-col gap-md">
                <h3 className="card-title border-b border-glass pb-sm mb-md">Data Bangunan Sewa & Utilities</h3>

                {/* Informasi Fisik Unit */}
                <div style={{ background:'rgba(255,255,255,0.03)', borderRadius:'10px', padding:'14px', border:'1px solid rgba(255,255,255,0.07)', marginBottom:'8px' }}>
                  <p className="tiny text-muted uppercase tracking-wider font-bold mb-md">Informasi Fisik Unit</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-md">
                    {[['Nomor Unit','L1-A05'],['Lantai','1 (Concourse)'],['Luas Bangunan','120 m²'],['Zona','Main Concourse']].map(([k,v],i) => (
                      <div key={i}>
                        <p className="tiny text-muted">{k}</p>
                        <p className="small font-bold" style={{ color:'white', marginTop:'3px' }}>{v}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Utility Cards */}
                <p className="tiny text-muted uppercase tracking-wider font-bold mt-xs">Data Meter Utilities</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
                  <UtilCard
                    icon={<Zap size={18}/>} label="Listrik" color="#f59e0b"
                    rows={[['Kapasitas','10,600 VA'],['Tarif/kWh','Rp 1.444'],['Meter Awal','12.450 kWh'],['Meter Akhir','13.200 kWh'],['Pemakaian','750 kWh'],['Est. Tagihan','Rp 1.083.000']]}
                  />
                  <UtilCard
                    icon={<AlertCircle size={18}/>} label="Air (PAM)" color="#00f2fe"
                    rows={[['Kapasitas','Standard'],['Tarif/m³','Rp 7.800'],['Meter Awal','340 m³'],['Meter Akhir','385 m³'],['Pemakaian','45 m³'],['Est. Tagihan','Rp 351.000']]}
                  />
                  <UtilCard
                    icon={<AlertCircle size={18}/>} label="Gas" color="#10b981"
                    rows={[['Instalasi','Tersedia'],['Tarif/m³','Rp 4.500'],['Meter Awal','120 m³'],['Meter Akhir','145 m³'],['Pemakaian','25 m³'],['Est. Tagihan','Rp 112.500']]}
                  />
                </div>
              </div>
            )}

            {/* ── Billing ── */}
            {activeTab === 'billing' && (
              <div className="animate-fade-in flex-col gap-md">
                <h3 className="card-title border-b border-glass pb-sm mb-md">Riwayat Billing</h3>
                <div className="table-responsive">
                  <table className="w-full text-left">
                    <thead><tr className="text-muted tiny border-b">
                      <th className="pb-sm font-normal">Invoice No</th>
                      <th className="pb-sm font-normal">Bulan</th>
                      <th className="pb-sm font-normal">Total</th>
                      <th className="pb-sm font-normal">Status</th>
                    </tr></thead>
                    <tbody>
                      <tr className="border-b-subtle"><td className="py-sm small">INV-2604-01</td><td className="py-sm small">Apr 2026</td><td className="py-sm small">Rp 17.500.000</td><td className="py-sm"><span className="status-pill" style={{ background:'rgba(255,255,255,0.05)', color:'#94a3b8' }}>Unpaid</span></td></tr>
                      <tr className="border-b-subtle"><td className="py-sm small">INV-2603-01</td><td className="py-sm small">Mar 2026</td><td className="py-sm small">Rp 17.200.000</td><td className="py-sm"><span className="status-pill active">Paid</span></td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ── Layout ── */}
            {activeTab === 'layout' && (
              <div className="animate-fade-in flex-col gap-md">
                <h3 className="card-title border-b border-glass pb-sm mb-md">Layout Unit</h3>
                <div style={{ background:'rgba(255,255,255,0.04)', borderRadius:'12px', border:'1px solid rgba(255,255,255,0.08)', padding:'2rem', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minHeight:'220px' }}>
                  <MapPin size={40} className="text-muted mb-md" style={{ opacity:0.5 }}/>
                  <p className="font-bold">Unit L1-A05</p>
                  <p className="small text-muted">Luas: 120 m²</p>
                  <button className="btn btn-primary mt-md" style={{ padding:'8px 20px', fontSize:'14px' }}>Lihat di Peta Interaktif</button>
                </div>
              </div>
            )}

            {/* ── Maintenance ── */}
            {activeTab === 'maintenance' && (
              <div className="animate-fade-in flex-col gap-md">
                <h3 className="card-title border-b border-glass pb-sm mb-md">Maintenance History</h3>
                {[
                  { title:'Pembersihan Grease Trap', date:'15 Mar 2026', by:'Tim Facility' },
                  { title:'Pengecekan Panel Listrik', date:'02 Feb 2026', by:'Teknisi Eksternal' },
                ].map((m,i) => (
                  <div key={i} className="flex justify-between items-center" style={{ background:'rgba(255,255,255,0.04)', borderRadius:'10px', padding:'12px 14px', border:'1px solid rgba(255,255,255,0.07)' }}>
                    <div>
                      <p className="small font-bold" style={{ color:'white' }}>{m.title}</p>
                      <p className="tiny text-muted">{m.date} · Oleh: {m.by}</p>
                    </div>
                    <span className="status-pill active">Selesai</span>
                  </div>
                ))}
              </div>
            )}

            {/* ── Pengajuan ── */}
            {activeTab === 'pengajuan' && (
              <div className="animate-fade-in flex-col gap-md">
                <div className="flex justify-between items-center border-b border-glass pb-sm mb-md">
                  <h3 className="card-title">Daftar Pengajuan Perbaikan</h3>
                  <button onClick={() => setShowNewForm(!showNewForm)} className="btn btn-primary flex items-center gap-xs" style={{ padding:'7px 14px', fontSize:'13px' }}>
                    <Plus size={14}/> Pengajuan Baru
                  </button>
                </div>

                {/* New Ticket Form */}
                {showNewForm && (
                  <div style={{ background:'rgba(0,242,254,0.05)', border:'1px solid rgba(0,242,254,0.2)', borderRadius:'12px', padding:'16px', marginBottom:'8px' }}>
                    <h4 className="small font-bold mb-md">Form Pengajuan Baru</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
                      <div style={{ gridColumn:'1/-1' }}>
                        <label className="tiny text-muted">Judul Kendala *</label>
                        <input value={newTicket.title} onChange={e => setNewTicket(p=>({...p,title:e.target.value}))}
                          placeholder="Contoh: AC Bocor di Area Kasir"
                          style={{ width:'100%', marginTop:'4px', background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.12)', borderRadius:'8px', padding:'9px 12px', color:'white', fontSize:'14px', fontFamily:'inherit' }}
                        />
                      </div>
                      <div>
                        <label className="tiny text-muted">Kategori</label>
                        <select value={newTicket.category} onChange={e => setNewTicket(p=>({...p,category:e.target.value}))}
                          style={{ width:'100%', marginTop:'4px', background:'rgba(20,27,45,0.95)', border:'1px solid rgba(255,255,255,0.12)', borderRadius:'8px', padding:'9px 12px', color:'white', fontSize:'14px', fontFamily:'inherit' }}>
                          {CATEGORY_OPTS.map(c => <option key={c}>{c}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="tiny text-muted">Prioritas</label>
                        <select value={newTicket.priority} onChange={e => setNewTicket(p=>({...p,priority:e.target.value}))}
                          style={{ width:'100%', marginTop:'4px', background:'rgba(20,27,45,0.95)', border:'1px solid rgba(255,255,255,0.12)', borderRadius:'8px', padding:'9px 12px', color: PRIORITY_COLOR[newTicket.priority], fontSize:'14px', fontFamily:'inherit' }}>
                          {PRIORITY_OPTS.map(p => <option key={p}>{p}</option>)}
                        </select>
                      </div>
                      <div style={{ gridColumn:'1/-1' }}>
                        <label className="tiny text-muted">Deskripsi</label>
                        <textarea value={newTicket.description} onChange={e => setNewTicket(p=>({...p,description:e.target.value}))}
                          placeholder="Detail permasalahan..."
                          style={{ width:'100%', marginTop:'4px', background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.12)', borderRadius:'8px', padding:'9px 12px', color:'white', fontSize:'14px', fontFamily:'inherit', resize:'vertical', minHeight:'70px' }}
                        />
                      </div>
                    </div>
                    <div className="flex gap-sm mt-md">
                      <button onClick={submitNewTicket} className="btn btn-primary" style={{ padding:'8px 18px', fontSize:'13px' }}>Simpan</button>
                      <button onClick={() => setShowNewForm(false)} className="btn btn-ghost" style={{ padding:'8px 18px', fontSize:'13px' }}>Batal</button>
                    </div>
                  </div>
                )}

                {/* Ticket List */}
                <div className="table-responsive">
                  <table className="w-full text-left">
                    <thead><tr className="text-muted tiny border-b">
                      <th className="pb-sm font-normal">Kendala</th>
                      <th className="pb-sm font-normal">Kategori</th>
                      <th className="pb-sm font-normal">Prioritas</th>
                      <th className="pb-sm font-normal">Status</th>
                      <th className="pb-sm font-normal">Tgl</th>
                    </tr></thead>
                    <tbody>
                      {tickets.length === 0
                        ? <tr><td colSpan="5" className="text-center py-md text-muted">Belum ada pengajuan.</td></tr>
                        : tickets.map((tk, i) => (
                          <tr key={i} className="border-b-subtle hover-bg cursor-pointer" onClick={() => setSelTicket(tk)}>
                            <td className="py-sm small font-bold">{tk.title}</td>
                            <td className="py-sm tiny text-muted">{tk.category}</td>
                            <td className="py-sm">
                              <span style={{ fontSize:'11px', fontWeight:600, color: PRIORITY_COLOR[tk.priority] }}>{tk.priority}</span>
                            </td>
                            <td className="py-sm">
                              <span className="status-pill" style={{ color: STATUS_COLOR[tk.status], borderColor: STATUS_COLOR[tk.status], background:'transparent', fontSize:'11px' }}>{tk.status}</span>
                            </td>
                            <td className="py-sm tiny text-muted">{new Date(tk.created_at).toLocaleDateString('id-ID')}</td>
                          </tr>
                        ))
                      }
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Ticket Modal */}
      {selTicket && (
        <TicketModal
          ticket={selTicket}
          onClose={() => setSelTicket(null)}
          onUpdated={() => { fetchTickets(); setSelTicket(null); }}
        />
      )}
    </div>
  );
};

export default TenantDetail;
