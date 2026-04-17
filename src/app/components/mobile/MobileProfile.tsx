import { useNavigate } from 'react-router';
import { ArrowLeft, User, Zap, BarChart2, Bell, Shield, ChevronRight, LogOut, Monitor } from 'lucide-react';
import { MobileLayout } from './MobileLayout';
import { useMode } from '../../context/ModeContext';
import { F } from '../../colors';

export function MobileProfile() {
  const navigate = useNavigate();
  const { mode, setMode, isField } = useMode();

  const menuItems = [
    { icon: Bell, label: 'Notifications', badge: '3 Unread' },
    { icon: Shield, label: 'Permissions', badge: '' },
    { icon: Monitor, label: 'Switch to Web', action: () => navigate('/web'), badge: '' },
  ];

  return (
    <MobileLayout>
      <div className="min-h-screen" style={{ background: isField ? F.bg : '#F7F6F4' }}>
        {/* Header */}
        <div
          className="p-4 flex items-center justify-between"
          style={{
            background: isField ? F.header : '#F7F6F4',
            borderBottom: `1.5px solid ${isField ? F.border : '#E5E0D8'}`,
          }}
        >
          <button onClick={() => navigate('/mobile')} style={{ color: isField ? F.textMid : '#9AA0A8' }}>
            <ArrowLeft className="w-5 h-5" />
          </button>
          <span className="font-bold" style={{ color: isField ? F.text : '#2C3540' }}>Profile</span>
          <div className="w-5" />
        </div>

        {/* Profile Card */}
        <div
          className="p-6"
          style={{
            background: isField ? F.surface : '#ffffff',
            borderBottom: `1.5px solid ${isField ? F.border : '#E5E0D8'}`,
          }}
        >
          <div className="flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{ background: isField ? F.accent : '#8B9EAD' }}
            >
              <User className="w-8 h-8" style={{ color: isField ? F.accentText : 'white' }} />
            </div>
            <div>
              <h2 className="text-xl font-bold" style={{ color: isField ? F.text : '#2C3540' }}>Zhang Wei</h2>
              <p className="text-sm" style={{ color: isField ? F.textMid : '#9AA0A8' }}>People's Square Flagship · Store Manager</p>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className="text-xs px-2 py-0.5 rounded-full"
                  style={{
                    background: isField ? 'rgba(212,160,64,0.2)' : '#E5EEEC',
                    color: isField ? F.accent : '#6A9A7A',
                  }}
                >
                  On Duty
                </span>
                <span className="text-xs" style={{ color: isField ? F.textSoft : '#9AA0A8' }}>Last Login: Today 08:30</span>
              </div>
            </div>
          </div>
        </div>

        {/* Mode Switcher Section */}
        <div className="p-4">
          <div
            className="rounded-xl p-4 mb-4"
            style={{
              background: isField ? F.surface : 'white',
              border: `1.5px solid ${isField ? F.accentBorder : '#E5E0D8'}`,
            }}
          >
            <h3 className="font-bold mb-3" style={{ color: isField ? F.text : '#2C3540' }}>Work Mode Settings</h3>

            <div
              className="p-3 rounded-lg mb-3"
              style={{
                background: isField ? F.accentBg : '#E8F0F5',
                border: `1px solid ${isField ? F.accentBorder : '#CCDBE5'}`,
              }}
            >
              <div className="flex items-center gap-2">
                {isField ? <Zap className="w-4 h-4" style={{ color: F.accent }} /> : <BarChart2 className="w-4 h-4" style={{ color: '#8B9EAD' }} />}
                <span className="font-bold" style={{ color: isField ? F.accent : '#8B9EAD' }}>
                  Current Mode: {isField ? '⚡ Field Mode' : '📊 Standard Mode'}
                </span>
              </div>
              <p className="text-xs mt-1 opacity-80" style={{ color: isField ? F.textMid : '#6A7580' }}>
                {isField ? 'Large buttons, critical info, ideal for warehouse operations' : 'Full features, ideal for office analysis and decision making'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setMode('standard')}
                className="py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all"
                style={{
                  border: '1.5px solid',
                  borderColor: mode === 'standard' ? '#8B9EAD' : (isField ? F.border : '#E5E0D8'),
                  background: mode === 'standard' ? '#8B9EAD' : (isField ? F.surface : 'white'),
                  color: mode === 'standard' ? 'white' : (isField ? F.textMid : '#9AA0A8'),
                }}
              >
                <BarChart2 className="w-4 h-4" />
                Standard Mode
              </button>
              <button
                onClick={() => setMode('field')}
                className="py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all"
                style={{
                  border: '1.5px solid',
                  borderColor: mode === 'field' ? F.accentBorder : (isField ? F.border : '#E5E0D8'),
                  background: mode === 'field' ? F.accent : (isField ? F.surface : 'white'),
                  color: mode === 'field' ? F.accentText : (isField ? F.textMid : '#9AA0A8'),
                }}
              >
                <Zap className="w-4 h-4" />
                Field Mode
              </button>
            </div>
          </div>

          {/* Mode Descriptions */}
          <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
            <div className="rounded-xl p-3" style={{ background: isField ? F.surface : 'white', border: `1.5px solid ${isField ? F.border : '#E5E0D8'}` }}>
              <div className="font-bold mb-2" style={{ color: isField ? F.text : '#2C3540' }}>📊 Standard Mode</div>
              <ul className="space-y-1 text-xs" style={{ color: isField ? F.textSoft : '#9AA0A8' }}>
                <li>• Detailed product info</li><li>• Full filtering & search</li>
                <li>• Chart analysis</li><li>• Office use</li>
              </ul>
            </div>
            <div className="rounded-xl p-3" style={{ background: isField ? F.surface : 'white', border: `1.5px solid ${isField ? F.accentBorder : '#E5E0D8'}` }}>
              <div className="font-bold mb-2" style={{ color: isField ? F.accent : '#2C3540' }}>⚡ Field Mode</div>
              <ul className="space-y-1 text-xs" style={{ color: isField ? F.textSoft : '#9AA0A8' }}>
                <li>• Large buttons/text</li><li>• Critical info only</li>
                <li>• Navy theme</li><li>• Warehouse use</li>
              </ul>
            </div>
          </div>

          {/* Menu Items */}
          <div className="rounded-xl overflow-hidden mb-4" style={{ background: isField ? F.surface : 'white', border: `1.5px solid ${isField ? F.border : '#E5E0D8'}` }}>
            {menuItems.map(({ icon: Icon, label, badge, action }, index) => (
              <button
                key={label}
                onClick={action}
                className="w-full flex items-center justify-between p-4 text-left transition-colors"
                style={{ borderBottom: index < menuItems.length - 1 ? `1px solid ${isField ? F.border : '#ECEAE5'}` : 'none' }}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5" style={{ color: isField ? F.textSoft : '#9AA0A8' }} />
                  <span className="font-medium text-sm" style={{ color: isField ? F.text : '#2C3540' }}>{label}</span>
                </div>
                <div className="flex items-center gap-2">
                  {badge && (
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: isField ? 'rgba(168,56,80,0.2)' : '#EFE5E5', color: '#BF8888' }}>
                      {badge}
                    </span>
                  )}
                  <ChevronRight className="w-4 h-4" style={{ color: isField ? F.border : '#E5E0D8' }} />
                </div>
              </button>
            ))}
          </div>

          {/* Tip */}
          <div className="rounded-xl p-4 mb-4" style={{ background: isField ? F.surface : '#F7F6F4', border: `1px solid ${isField ? F.border : '#E5E0D8'}` }}>
            <p className="text-xs" style={{ color: isField ? F.textSoft : '#9AA0A8' }}>
              💡 Tip: After switching modes, all pages will update accordingly. Use the mode switcher at the top of any page for quick switching.
            </p>
          </div>

          {/* Logout */}
          <button
            onClick={() => navigate('/')}
            className="w-full py-3 rounded-xl flex items-center justify-center gap-2 font-bold transition-colors"
            style={{ border: `1.5px solid ${isField ? F.alertHighBorder : '#D4AAAA'}`, color: isField ? F.alertHighBorder : '#BF8888', background: 'transparent' }}
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </div>
    </MobileLayout>
  );
}