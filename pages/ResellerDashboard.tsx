
import React from 'react';
import { 
  BarChart3, 
  Store as StoreIcon, 
  TrendingUp, 
  Eye, 
  Share2, 
  ChevronRight,
  ExternalLink,
  Settings
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Mon', views: 240, sales: 120 },
  { name: 'Tue', views: 300, sales: 150 },
  { name: 'Wed', views: 400, sales: 220 },
  { name: 'Thu', views: 350, sales: 180 },
  { name: 'Fri', views: 500, sales: 300 },
  { name: 'Sat', views: 650, sales: 450 },
  { name: 'Sun', views: 550, sales: 380 },
];

const ResellerDashboard: React.FC = () => {
  return (
    <div className="p-4 md:p-8 space-y-8 bg-neutral-950 min-h-screen pb-24">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Reseller Central</h1>
          <p className="text-neutral-400">Store: Urban Elite Selection</p>
        </div>
        <div className="flex items-center space-x-2">
          <button className="flex-1 md:flex-none px-6 py-3 bg-emerald-900 text-white rounded-xl font-bold flex items-center justify-center space-x-2 hover:bg-emerald-800 transition-all shadow-lg shadow-emerald-950/20">
            <Share2 size={18} />
            <span>Share Store</span>
          </button>
          <Link 
            to="/store/store1"
            target="_blank"
            className="p-3 bg-neutral-900 border border-white/10 rounded-xl text-neutral-400 hover:text-white transition-colors"
          >
            <ExternalLink size={20} />
          </Link>
        </div>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-neutral-900 border border-white/5 p-6 md:p-8 rounded-3xl shadow-2xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="font-bold text-lg">Store Traffic</h3>
              <p className="text-xs text-neutral-500">Live audience interaction</p>
            </div>
            <div className="flex items-center space-x-2 text-xs">
              <span className="flex items-center text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full font-bold">
                <TrendingUp size={12} className="mr-1" /> +12%
              </span>
            </div>
          </div>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#065f46" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#065f46" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                <XAxis dataKey="name" stroke="#555" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#555" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#171717', border: '1px solid #333', borderRadius: '12px' }}
                />
                <Area type="monotone" dataKey="views" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorViews)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-neutral-900 border border-white/5 p-6 md:p-8 rounded-3xl shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Eye className="text-blue-500" size={20} />
              </div>
              <span className="text-xs text-neutral-500">Last 7 Days</span>
            </div>
            <p className="text-3xl font-bold">2.4k</p>
            <p className="text-sm text-neutral-400 font-medium">Unique Store Views</p>
          </div>
          <div className="bg-neutral-900 border border-white/5 p-6 md:p-8 rounded-3xl shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-amber-500/10 rounded-lg">
                <BarChart3 className="text-amber-500" size={20} />
              </div>
              <span className="text-xs text-neutral-500">Earnings</span>
            </div>
            <p className="text-3xl font-bold">$842.00</p>
            <p className="text-sm text-neutral-400 font-medium">Projected Commission</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Edit Storefront', icon: StoreIcon, color: 'bg-emerald-500/10 text-emerald-500', path: '/store-settings' },
          { label: 'Discover New', icon: BarChart3, color: 'bg-blue-500/10 text-blue-500', path: '/discover' },
          { label: 'Profile Settings', icon: Settings, color: 'bg-neutral-500/10 text-neutral-400', path: '/profile' },
          { label: 'Revenue/Pay', icon: TrendingUp, color: 'bg-amber-500/10 text-amber-500', path: '/reseller' },
        ].map((action, i) => (
          <Link 
            key={i} 
            to={action.path}
            className="flex flex-col items-center justify-center p-6 bg-neutral-900 border border-white/5 rounded-3xl hover:bg-neutral-800 transition-all hover:-translate-y-1"
          >
            <div className={`p-4 rounded-2xl mb-4 ${action.color}`}>
              <action.icon size={24} />
            </div>
            <span className="text-sm font-bold">{action.label}</span>
          </Link>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-neutral-900 border border-white/5 p-6 md:p-8 rounded-3xl shadow-2xl">
        <div className="flex items-center justify-between mb-8">
          <h3 className="font-bold text-lg">Latest Conversions</h3>
          <button className="text-xs font-bold text-emerald-500 flex items-center hover:underline bg-emerald-500/10 px-3 py-1.5 rounded-full">
            View Analytics <ChevronRight size={14} className="ml-1" />
          </button>
        </div>
        <div className="space-y-4">
          {[
            { id: '#4521', item: 'Stealth Bomber Jacket', price: 129, date: '2h ago', status: 'Delivered' },
            { id: '#4520', item: 'Vortex Mesh Sneakers', price: 159, date: '5h ago', status: 'Processing' },
            { id: '#4519', item: 'Urban Cargo Pants', price: 89, date: 'Yesterday', status: 'Delivered' },
          ].map((order) => (
            <div key={order.id} className="flex items-center justify-between py-4 border-b border-white/5 last:border-0 group">
              <div className="flex items-center space-x-6">
                <div className="w-12 h-12 bg-neutral-950 rounded-xl flex items-center justify-center text-[10px] font-bold text-neutral-500 border border-white/5 group-hover:border-emerald-500/30 transition-colors">
                  {order.id}
                </div>
                <div>
                  <p className="text-sm font-bold group-hover:text-emerald-400 transition-colors">{order.item}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-[10px] text-neutral-500 uppercase font-medium">{order.date}</span>
                    <span className="text-[10px] text-neutral-600">•</span>
                    <span className={`text-[10px] font-bold uppercase ${order.status === 'Delivered' ? 'text-emerald-500' : 'text-amber-500'}`}>{order.status}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-emerald-500">+${Math.round(order.price * 0.15)}</p>
                <p className="text-[10px] text-neutral-500 uppercase font-medium">Profit</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResellerDashboard;
