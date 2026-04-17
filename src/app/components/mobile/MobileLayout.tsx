import { ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { Home, Package, ArrowLeftRight, RotateCcw, User } from 'lucide-react';
import { useMode } from '../../context/ModeContext';

interface MobileLayoutProps {
  children: ReactNode;
  showNav?: boolean;
}

const navItems = [
  { path: '/mobile', icon: Home, label: 'Home' },
  { path: '/mobile/inventory', icon: Package, label: 'Stock' },
  { path: '/mobile/inbound', icon: ArrowLeftRight, label: 'Inbound' },
  { path: '/mobile/return', icon: RotateCcw, label: 'Return' },
  { path: '/mobile/profile', icon: User, label: 'Profile' },
];

export function MobileLayout({ children, showNav = true }: MobileLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { isField } = useMode();

  return (
    <div className="min-h-screen flex justify-center" style={{ background: '#F0F1F5' }}>
      <div
        className="relative w-full max-w-md flex flex-col min-h-screen"
        style={{
          background: isField ? '#222B45' : '#F7F6F4',
          borderLeft: '1.5px solid #D8D9E0',
          borderRight: '1.5px solid #D8D9E0',
          boxShadow: '0 0 40px rgba(0,0,0,0.10)',
        }}
      >
        <div className="flex-1 overflow-y-auto relative">
          {children}
        </div>
        {showNav && (
          <div
            className="sticky bottom-0 grid grid-cols-5 z-40"
            style={{
              background: isField ? '#1A2035' : '#F7F6F4',
              borderTop: isField ? '1.5px solid #374268' : '1.5px solid #E5E0D8',
            }}
          >
            {navItems.map(({ path, icon: Icon, label }) => {
              const isActive = location.pathname === path ||
                (path !== '/mobile' && location.pathname.startsWith(path));
              return (
                <button
                  key={path}
                  onClick={() => navigate(path)}
                  className="flex flex-col items-center gap-1 py-3 transition-colors"
                  style={{
                    color: isField
                      ? (isActive ? '#D4A040' : '#5A6280')
                      : (isActive ? '#8B9EAD' : '#9AA0A8'),
                  }}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs">{label}</span>
                  {isActive && (
                    <div
                      className="w-1 h-1 rounded-full"
                      style={{ background: isField ? '#D4A040' : '#8B9EAD' }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
