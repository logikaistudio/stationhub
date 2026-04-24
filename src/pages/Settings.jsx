import React from 'react';
import { Settings as SettingsIcon, Bell, Shield, Database } from 'lucide-react';

const Settings = () => {
  return (
    <div className="flex-col gap-lg animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="card-title text-xl flex items-center gap-sm">
            <SettingsIcon size={24} className="text-primary" /> 
            System Settings
          </h2>
          <p className="text-muted small">Configure application preferences and integrations.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
        <div className="card glass md:col-span-2">
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
      </div>
    </div>
  );
};

export default Settings;
