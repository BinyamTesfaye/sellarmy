
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User } from '../types';
import { NAVIGATION } from '../constants';

interface BottomNavProps {
  user: User | null;
}

const BottomNav: React.FC<BottomNavProps> = ({ user }) => {
  const location = useLocation();

  if (!user || user.role === 'CUSTOMER') return null;

  const navItems = NAVIGATION[user.role as keyof typeof NAVIGATION] || [];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-neutral-900 border-t border-white/10 z-50">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link 
              key={item.path} 
              to={item.path}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
                isActive ? 'text-emerald-500' : 'text-neutral-500'
              }`}
            >
              <Icon size={20} />
              <span className="text-[10px] font-medium">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
