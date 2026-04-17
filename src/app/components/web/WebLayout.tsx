import { ReactNode, useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import {
  LayoutGrid, TrendingUp, Package, Store, ArrowLeftRight,
  Bell, User, Menu, X, Smartphone, Settings, ChevronDown
} from 'lucide-react';

const navItems = [
  { path: '/web', icon: LayoutGrid, label: 'Dashboard' },
  { path: '/web/inventory', icon: Package, label: 'Inventory' },
  { path: '/web/transfer', icon: ArrowLeftRight, label: 'Transfer' },
  { path: '/web/stores', icon: Store, label: 'Stores' },
  { path: '/web/monitor', icon: TrendingUp, label: 'Monitor' },
];

interface WebLayoutProps {
  children: ReactNode;
  title?: string;
}

export function WebLayout({ children, title }: WebLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#F7F6F4' }}>
      {/* Top Header */}
      <header
        className="px-6 py-3 flex items-center justify-between sticky top-0 z-30"
        style={{ background: '#F7F6F4', borderBottom: '1.5px solid #E5E0D8', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}
      >
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-2 rounded-lg transition-colors"
            style={{ color: '#8B9EAD' }}
            onMouseEnter={e => (e.currentTarget.style.background = '#F0EDE8')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#8B9EAD' }}>
              <Package className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold italic" style={{ color: '#2C3540' }}>RetailFlow Pro</span>
          </div>
          <span style={{ color: '#E5E0D8' }} className="text-lg">|</span>
          <span className="text-sm font-medium" style={{ color: '#9AA0A8' }}>Web Admin</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/mobile')}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
            style={{ border: '1.5px solid #E5E0D8', color: '#6A7580' }}
            onMouseEnter={e => (e.currentTarget.style.background = '#F0EDE8')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            <Smartphone className="w-4 h-4" />
            <span>Mobile</span>
          </button>

          <div className="relative">
            <button
              className="relative p-2 rounded-lg transition-colors"
              style={{ color: '#9AA0A8' }}
              onMouseEnter={e => (e.currentTarget.style.background = '#F0EDE8')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <Bell className="w-5 h-5" />
              <span
                className="absolute -top-0.5 -right-0.5 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center"
                style={{ background: '#BF8888' }}
              >5</span>
            </button>
          </div>

          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg transition-colors"
              onMouseEnter={e => (e.currentTarget.style.background = '#F0EDE8')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: '#8B9EAD' }}>
                <User className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-medium" style={{ color: '#2C3540' }}>Regional Manager</span>
              <ChevronDown className="w-4 h-4" style={{ color: '#9AA0A8' }} />
            </button>
            {showUserMenu && (
              <div
                className="absolute right-0 mt-1 w-48 rounded-xl shadow-lg z-50"
                style={{ background: '#F7F6F4', border: '1.5px solid #E5E0D8', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}
              >
                <div className="p-3" style={{ borderBottom: '1px solid #ECEAE5' }}>
                  <div className="font-bold text-sm" style={{ color: '#2C3540' }}>Jianguo Wang</div>
                  <div className="text-xs" style={{ color: '#9AA0A8' }}>Regional Manager · Shanghai</div>
                </div>
                <div className="p-2">
                  <button
                    className="w-full text-left px-3 py-2 text-sm rounded-lg flex items-center gap-2 transition-colors"
                    style={{ color: '#2C3540' }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#F0EDE8')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <Settings className="w-4 h-4" />
                    Settings
                  </button>
                  <button
                    onClick={() => navigate('/')}
                    className="w-full text-left px-3 py-2 text-sm rounded-lg flex items-center gap-2 transition-colors"
                    style={{ color: '#BF8888' }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#EFE5E5')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <X className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside
          className={`${sidebarCollapsed ? 'w-16' : 'w-56'} flex flex-col transition-all duration-200 sticky top-14 h-[calc(100vh-56px)]`}
          style={{ background: '#F7F6F4', borderRight: '1.5px solid #E5E0D8' }}
        >
          <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
            {navItems.map(({ path, icon: Icon, label }) => {
              const isActive = location.pathname === path ||
                (path !== '/web' && location.pathname.startsWith(path));
              return (
                <button
                  key={path}
                  onClick={() => navigate(path)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all`}
                  style={isActive
                    ? { background: '#8B9EAD', color: 'white', boxShadow: '0 2px 8px rgba(139,158,173,0.30)' }
                    : { color: '#6A7580' }
                  }
                  onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = '#F0EDE8'; }}
                  onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                  title={sidebarCollapsed ? label : undefined}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {!sidebarCollapsed && <span className="text-sm font-medium">{label}</span>}
                </button>
              );
            })}
          </nav>

          {!sidebarCollapsed && (
            <div className="p-4" style={{ borderTop: '1px solid #ECEAE5' }}>
              <div className="rounded-xl p-3" style={{ background: '#F0EDE8', border: '1px solid #E5E0D8' }}>
                <div className="text-xs font-bold mb-1" style={{ color: '#8B9EAD' }}>📅 Today's Overview</div>
                <div className="text-xs" style={{ color: '#9AA0A8' }}>2026-04-16</div>
                <div className="text-xs mt-1" style={{ color: '#9AA0A8' }}>5 Stores · 3 Pending</div>
              </div>
            </div>
          )}
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto" style={{ background: '#ffffff' }}>
          {children}
        </main>
      </div>
    </div>
  );
}