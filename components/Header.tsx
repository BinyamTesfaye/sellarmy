
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { User } from '../types';
import { LogOut, User as UserIcon, LayoutDashboard, ChevronDown } from 'lucide-react';
import { NAVIGATION } from '../constants';

interface HeaderProps {
  user: User | null;
  logout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, logout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const getDashboardPath = () => {
    if (!user) return '/';
    switch (user.role) {
      case 'SELLER': return '/seller';
      case 'RESELLER': return '/reseller';
      case 'ADMIN': return '/admin';
      default: return '/';
    }
  };

  const navItems = user ? (NAVIGATION[user.role as keyof typeof NAVIGATION] || []) : [];

  return (
    <header className="sticky top-0 z-50 w-full bg-neutral-950/80 backdrop-blur-md border-b border-white/10">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to={user ? getDashboardPath() : "/"} className="flex items-center space-x-2 shrink-0">
          <div className="w-8 h-8 bg-emerald-900 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">S</span>
          </div>
          <span className="text-xl font-bold tracking-tight text-white hidden xs:block">SellArmy</span>
        </Link>

        {/* Desktop Navigation */}
        {user && (
          <div className="hidden md:flex items-center space-x-1 mx-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                    isActive 
                      ? 'bg-emerald-500/10 text-emerald-500 shadow-[inset_0_0_20px_rgba(16,185,129,0.05)]' 
                      : 'text-neutral-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon size={16} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        )}

        <div className="flex items-center space-x-2 sm:space-x-4">
          {!user ? (
            <Link 
              to="/login" 
              className="px-6 py-2 bg-emerald-900 text-white rounded-full text-sm font-semibold hover:bg-emerald-800 transition-colors shadow-lg shadow-emerald-900/20"
            >
              Get Started
            </Link>
          ) : (
            <div className="flex items-center space-x-2">
              <div className="h-8 w-px bg-white/10 mx-2 hidden md:block"></div>

              <Link 
                to="/profile"
                className={`flex items-center space-x-2 p-2 sm:px-3 sm:py-2 rounded-xl transition-all ${
                  location.pathname === '/profile' ? 'text-emerald-500 bg-emerald-500/10' : 'text-neutral-400 hover:text-white'
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center border border-white/10 overflow-hidden">
                  {user.avatarUrl ? <img src={user.avatarUrl} alt="" /> : <UserIcon size={16} />}
                </div>
                <span className="hidden lg:inline text-sm font-bold">{user.name.split(' ')[0]}</span>
              </Link>

              <button 
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                className="p-2 text-neutral-500 hover:text-red-400 transition-colors rounded-xl hover:bg-red-500/5"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
