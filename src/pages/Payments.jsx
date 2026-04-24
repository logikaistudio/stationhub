import React from 'react';
import { CreditCard, Download, Search } from 'lucide-react';

const Payments = () => {
  const invoices = [
    { id: 'INV-2604-01', tenant: 'Kopi Kenangan', amount: 'Rp 7.500.000', status: 'Paid', date: '2026-04-01' },
    { id: 'INV-2604-02', tenant: 'Indomaret Point', amount: 'Rp 6.750.000', status: 'Paid', date: '2026-04-02' },
    { id: 'INV-2604-03', tenant: 'McDonalds', amount: 'Rp 6.000.000', status: 'Unpaid', date: '2026-04-05' },
    { id: 'INV-2604-04', tenant: 'ATM Mandiri', amount: 'Rp 16.000.000', status: 'Paid', date: '2026-04-10' },
    { id: 'INV-2604-05', tenant: 'Erafone', amount: 'Rp 7.200.000', status: 'Overdue', date: '2026-04-15' },
  ];

  return (
    <div className="flex-col gap-lg animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="card-title text-xl flex items-center gap-sm">
            <CreditCard size={24} className="text-primary" /> 
            Billing & Payments
          </h2>
          <p className="text-muted small">Manage invoices and track utility payments.</p>
        </div>
        <button className="btn btn-primary flex items-center gap-sm">
          Generate Invoices
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-lg mb-md">
        <div className="card glass text-center">
          <p className="text-muted small">Total Collected (Apr)</p>
          <h2 className="text-2xl font-bold text-success mt-xs">Rp 30.250.000</h2>
        </div>
        <div className="card glass text-center">
          <p className="text-muted small">Pending Payments</p>
          <h2 className="text-2xl font-bold text-primary mt-xs">Rp 6.000.000</h2>
        </div>
        <div className="card glass text-center">
          <p className="text-muted small">Overdue Bills</p>
          <h2 className="text-2xl font-bold text-warning mt-xs">Rp 7.200.000</h2>
        </div>
      </div>

      <div className="card glass">
        <div className="flex justify-between items-center mb-md">
           <h3 className="card-title">Recent Invoices</h3>
           <div className="search-bar-container bg-card border border-glass">
             <Search size={16} className="text-muted" />
             <input type="text" placeholder="Search invoice..." className="search-input" />
           </div>
        </div>

        <div className="table-responsive">
          <table className="w-full text-left">
            <thead>
              <tr className="text-muted tiny border-b">
                <th className="pb-sm font-normal">Invoice No</th>
                <th className="pb-sm font-normal">Tenant Name</th>
                <th className="pb-sm font-normal">Amount</th>
                <th className="pb-sm font-normal">Issue Date</th>
                <th className="pb-sm font-normal">Status</th>
                <th className="pb-sm font-normal text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv, i) => (
                <tr key={i} className="border-b-subtle hover-bg">
                  <td className="py-md font-bold text-primary small">{inv.id}</td>
                  <td className="py-md small">{inv.tenant}</td>
                  <td className="py-md small">{inv.amount}</td>
                  <td className="py-md small text-muted">{inv.date}</td>
                  <td className="py-md">
                    <span className={`status-pill ${inv.status === 'Paid' ? 'active' : inv.status === 'Unpaid' ? 'bg-card' : 'expiring'}`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="py-md text-right">
                     <button className="text-muted hover:text-primary transition-colors"><Download size={18} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Payments;
