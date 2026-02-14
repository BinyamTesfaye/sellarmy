
import React from 'react';
import { 
  Users, 
  ShieldCheck, 
  AlertTriangle, 
  Search, 
  ChevronRight, 
  MoreVertical,
  Flag
} from 'lucide-react';

const AdminDashboard: React.FC = () => {
  return (
    <div className="p-4 md:p-8 space-y-8 bg-neutral-950 min-h-screen">
      <div>
        <h1 className="text-2xl font-bold">Platform Admin</h1>
        <p className="text-neutral-400">Infrastructure and moderation overview.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-emerald-900/10 border border-emerald-500/20 p-6 rounded-3xl">
          <div className="flex items-center justify-between mb-4">
            <Users className="text-emerald-500" size={24} />
            <span className="text-xs text-emerald-500">Active Now</span>
          </div>
          <p className="text-4xl font-bold">18,241</p>
          <p className="text-sm text-neutral-400 mt-1">Total Active Users</p>
        </div>
        <div className="bg-blue-900/10 border border-blue-500/20 p-6 rounded-3xl">
          <div className="flex items-center justify-between mb-4">
            <ShieldCheck className="text-blue-500" size={24} />
            <span className="text-xs text-blue-500">Verified</span>
          </div>
          <p className="text-4xl font-bold">94.2%</p>
          <p className="text-sm text-neutral-400 mt-1">KYC Completion Rate</p>
        </div>
        <div className="bg-red-900/10 border border-red-500/20 p-6 rounded-3xl">
          <div className="flex items-center justify-between mb-4">
            <AlertTriangle className="text-red-500" size={24} />
            <span className="text-xs text-red-500">Urgent</span>
          </div>
          <p className="text-4xl font-bold">12</p>
          <p className="text-sm text-neutral-400 mt-1">Pending Moderation Tasks</p>
        </div>
      </div>

      <div className="bg-neutral-900 border border-white/5 rounded-3xl overflow-hidden">
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <h3 className="font-bold">Recent Activity</h3>
          <div className="relative w-64 hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={16} />
            <input 
              type="text" 
              placeholder="Filter activities..." 
              className="w-full bg-neutral-950 border border-white/10 rounded-lg py-2 pl-10 text-sm focus:outline-none"
            />
          </div>
        </div>
        <div className="divide-y divide-white/5">
          {[
            { user: "SneakerHead Wholesale", action: "listed new product", target: "Vortex Mesh", time: "3 mins ago", status: "Auto-Approved", color: "text-emerald-500" },
            { user: "Marcus Fashion", action: "reported a store", target: "ReplicaZone", time: "12 mins ago", status: "Pending Review", color: "text-amber-500" },
            { user: "Admin System", action: "processed withdrawal", target: "$1,200 to Jane D.", time: "45 mins ago", status: "Success", color: "text-blue-500" },
            { user: "New User", action: "registered as reseller", target: "TrendyVibes", time: "1h ago", status: "KYC Pending", color: "text-neutral-500" },
          ].map((activity, i) => (
            <div key={i} className="p-6 hover:bg-neutral-800/50 transition-colors flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-neutral-950 rounded-full flex items-center justify-center">
                  {i % 2 === 0 ? <Users size={18} className="text-neutral-500" /> : <Flag size={18} className="text-neutral-500" />}
                </div>
                <div>
                  <p className="text-sm font-medium">
                    <span className="text-white">{activity.user}</span> {activity.action} <span className="text-emerald-500">{activity.target}</span>
                  </p>
                  <p className="text-xs text-neutral-500 mt-0.5">{activity.time}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span className={`text-[10px] font-bold uppercase tracking-wider ${activity.color}`}>
                  {activity.status}
                </span>
                <button className="p-2 text-neutral-500 hover:text-white transition-colors">
                  <MoreVertical size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="p-4 text-center">
          <button className="text-sm text-neutral-500 hover:text-white transition-colors flex items-center justify-center w-full">
            Load More Activity <ChevronRight size={16} className="ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
