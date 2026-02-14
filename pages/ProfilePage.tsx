
import React, { useState } from 'react';
import { User } from '../types';
import { Camera, Mail, User as UserIcon, Shield, CreditCard, Bell, ChevronRight, Save } from 'lucide-react';

interface ProfilePageProps {
  user: User;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ user }) => {
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1500);
  };

  return (
    <div className="p-4 md:p-8 bg-neutral-950 min-h-screen">
      <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8">
        {/* Left Column: Summary */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-neutral-900 border border-white/5 p-8 rounded-3xl text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500"></div>
            <div className="relative inline-block mb-4">
              <div className="w-24 h-24 bg-neutral-800 rounded-full flex items-center justify-center border-4 border-neutral-950 overflow-hidden mx-auto">
                <UserIcon size={40} className="text-neutral-600" />
              </div>
              <button className="absolute bottom-0 right-0 p-2 bg-emerald-900 text-white rounded-full border-2 border-neutral-950 hover:bg-emerald-800 transition-colors">
                <Camera size={14} />
              </button>
            </div>
            <h2 className="text-xl font-bold">{user.name}</h2>
            <p className="text-emerald-500 text-sm font-medium uppercase tracking-wider mb-2">{user.role}</p>
            <p className="text-neutral-500 text-sm">Joined Oct 2024</p>
          </div>

          <div className="bg-neutral-900 border border-white/5 rounded-3xl overflow-hidden">
            {[
              { label: 'Security', icon: Shield },
              { label: 'Billing', icon: CreditCard },
              { label: 'Notifications', icon: Bell },
            ].map((item, i) => (
              <button key={i} className="w-full flex items-center justify-between p-4 hover:bg-neutral-800/50 transition-colors border-b border-white/5 last:border-0">
                <div className="flex items-center space-x-3 text-neutral-400">
                  <item.icon size={18} />
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
                <ChevronRight size={16} className="text-neutral-600" />
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Settings */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-neutral-900 border border-white/5 p-6 md:p-8 rounded-3xl">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold">Public Profile</h3>
              <button 
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center space-x-2 px-4 py-2 bg-emerald-900 text-white rounded-lg text-sm font-bold hover:bg-emerald-800 transition-all disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : <><Save size={16} /><span>Save Changes</span></>}
              </button>
            </div>

            <div className="grid gap-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm text-neutral-400">Full Name</label>
                  <div className="relative">
                    <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" size={16} />
                    <input 
                      type="text" 
                      defaultValue={user.name}
                      className="w-full bg-neutral-950 border border-white/10 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-neutral-400">Display Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" size={16} />
                    <input 
                      type="email" 
                      defaultValue={user.email}
                      className="w-full bg-neutral-950 border border-white/10 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-neutral-400">Short Bio</label>
                <textarea 
                  rows={4}
                  placeholder="Tell us about yourself..."
                  className="w-full bg-neutral-950 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-emerald-500 transition-colors resize-none"
                />
              </div>

              <div className="pt-4 border-t border-white/5">
                <h4 className="font-bold mb-4">Verification Status</h4>
                <div className="flex items-center space-x-4 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
                  <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white">
                    <Shield size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-emerald-500">Identity Verified</p>
                    <p className="text-xs text-emerald-500/70">Verified via Government ID on Oct 12, 2024</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
