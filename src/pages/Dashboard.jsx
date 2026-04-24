import React, { useState, useEffect } from 'react';
import { MoreVertical, Loader2, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import GaugeChart from '../components/GaugeChart';
import RevenueLineChart from '../components/RevenueLineChart';

const fmtIDR = (v) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(v);
const PRIORITY_COLOR = { Kritis: '#ef4444', Tinggi: '#f59e0b', Normal: '#4facfe' };
const STATUS_COLOR   = { Open: '#f59e0b', 'In Progress': '#00f2fe', Resolved: '#10b981' };

const Dashboard = () => {
  const [data, setData] = useState({
    occupancy_rate: 0, active_tenants: 0, monthly_revenue: 0,
    recent_tenants: [], revenue_chart: [], tickets: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/dashboard');
        if (!res.ok) throw new Error(`${res.status}`);
        setData(await res.json());
      } catch (e) { console.error('Dashboard fetch error:', e); }
      finally { setLoading(false); }
    })();
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center" style={{ minHeight: '60vh' }}>
      <Loader2 className="animate-spin text-primary" size={32} />
    </div>
  );

  const totalTenants = data.recent_tenants.length;
  const MAX_TENANTS  = 30; // 6 stations × 5 tenants

  return (
    <div className="flex flex-col gap-lg animate-fade-in">

      {/* ── Row 1: Gauges LEFT + Revenue Chart RIGHT ───────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">

        {/* LEFT column: 2 stacked gauges */}
        <div className="flex flex-col gap-lg">
          {/* Gauge 1: Occupancy Rate */}
          <div className="card glass gauge-card flex-1 flex items-center justify-center">
            <div style={{ width: '82%', margin: '0 auto' }}>
              <GaugeChart
                label="Occupancy Rate"
                value={`${data.occupancy_rate}%`}
                percentage={data.occupancy_rate}
                colorStart="#00f2fe" colorEnd="#4facfe"
                showNeedle={false}
              />
            </div>
          </div>

          {/* Gauge 2: Total Active Tenants */}
          <div className="card glass gauge-card flex-1 flex items-center justify-center">
            <div style={{ width: '82%', margin: '0 auto' }}>
              <GaugeChart
                label="Active Tenants"
                value={`${data.active_tenants}`}
                percentage={Math.round((data.active_tenants / MAX_TENANTS) * 100)}
                colorStart="#4facfe" colorEnd="#00f2fe"
                showNeedle={false}
              />
            </div>
          </div>
        </div>

        {/* RIGHT: Revenue Forecast Chart (spans 2 cols) */}
        <div className="card glass lg:col-span-2 flex flex-col">
          <div className="flex justify-between items-center mb-md">
            <div>
              <h3 className="card-title">Forecast Pendapatan 12 Bulan</h3>
              <p className="text-muted small">Target vs Realisasi — {new Date().getFullYear()}</p>
            </div>
            <MoreVertical size={16} className="text-muted" />
          </div>
          <RevenueLineChart data={data.revenue_chart} />
        </div>
      </div>

      {/* ── Row 2: KPI Cards ───────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
        <div className="card glass">
          <p className="text-muted small">Est. Pendapatan Bulan Ini</p>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 700, marginTop: '6px' }}>{fmtIDR(data.monthly_revenue)}</h2>
        </div>
        <div className="card glass">
          <p className="text-muted small">Total Stasiun</p>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 700, marginTop: '6px', color: 'var(--primary)' }}>6 Stasiun</h2>
        </div>
        <div className="card glass">
          <p className="text-muted small">Unit Tersewa</p>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 700, marginTop: '6px', color: '#10b981' }}>{data.active_tenants} / {data.active_tenants + 3} Unit</h2>
        </div>
      </div>

      {/* ── Row 3: Tenant List + Tickets ──────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-lg">

        {/* Recent Tenants */}
        <div className="card glass overflow-hidden">
          <div className="flex justify-between items-center mb-md">
            <h3 className="card-title">Daftar Tenant Terkini</h3>
            <Link to="/tenants" className="btn btn-primary" style={{ padding: '6px 14px', fontSize: '13px' }}>+ Tambah</Link>
          </div>
          <div className="table-responsive">
            <table className="w-full text-left">
              <thead>
                <tr className="text-muted tiny border-b">
                  <th className="pb-sm font-normal">Tenant</th>
                  <th className="pb-sm font-normal">Unit</th>
                  <th className="pb-sm font-normal">Status</th>
                </tr>
              </thead>
              <tbody>
                {data.recent_tenants.length === 0
                  ? <tr><td colSpan="3" className="text-center py-md text-muted">Belum ada data</td></tr>
                  : data.recent_tenants.map((t, i) => (
                    <tr key={i} className="border-b-subtle hover-bg">
                      <td className="py-sm">
                        <p className="small font-bold">{t.brand_name}</p>
                        <p className="tiny text-muted">{t.business_category}</p>
                      </td>
                      <td className="py-sm small">{t.lot_number || '—'}</td>
                      <td className="py-sm">
                        <span className={`status-pill ${t.status === 'Active' ? 'active' : 'expiring'}`}>
                          {t.status || 'Pending'}
                        </span>
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
        </div>

        {/* Complaints / Tickets */}
        <div className="card glass overflow-hidden">
          <div className="flex justify-between items-center mb-md">
            <h3 className="card-title flex items-center gap-xs">
              <AlertCircle size={17} className="text-warning" /> Daftar Pengaduan
            </h3>
            <Link to="/tenants" className="tiny text-muted" style={{ fontSize: '12px' }}>Lihat Semua →</Link>
          </div>
          <div className="table-responsive">
            <table className="w-full text-left">
              <thead>
                <tr className="text-muted tiny border-b">
                  <th className="pb-sm font-normal">Kendala</th>
                  <th className="pb-sm font-normal">Tenant</th>
                  <th className="pb-sm font-normal">Prioritas</th>
                  <th className="pb-sm font-normal">Status</th>
                </tr>
              </thead>
              <tbody>
                {data.tickets.length === 0
                  ? <tr><td colSpan="4" className="text-center py-md text-muted">Tidak ada pengaduan</td></tr>
                  : data.tickets.map((tk, i) => (
                    <tr key={i} className="border-b-subtle hover-bg">
                      <td className="py-sm">
                        <p className="small font-bold" style={{ maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{tk.title}</p>
                        <p className="tiny text-muted">{tk.category}</p>
                      </td>
                      <td className="py-sm small">{tk.brand_name || '—'}</td>
                      <td className="py-sm">
                        <span style={{ fontSize: '11px', fontWeight: 600, color: PRIORITY_COLOR[tk.priority] || '#94a3b8' }}>
                          {tk.priority}
                        </span>
                      </td>
                      <td className="py-sm">
                        <span className="status-pill" style={{
                          color: STATUS_COLOR[tk.status] || '#94a3b8',
                          borderColor: STATUS_COLOR[tk.status] || '#94a3b8',
                          background: 'transparent', fontSize: '11px'
                        }}>
                          {tk.status}
                        </span>
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
