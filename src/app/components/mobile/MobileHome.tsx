import { useNavigate } from 'react-router';
import { Bell, ChevronRight } from 'lucide-react';
import { mockAlerts, mockReturnOrders } from '../../data/mockData';
import { MobileLayout } from './MobileLayout';
import { ModeSwitcher } from './ModeSwitcher';
import { useMode } from '../../context/ModeContext';
import { F } from '../../colors';

export function MobileHome() {
  const navigate = useNavigate();
  const { isField } = useMode();

  const urgentAlerts = mockAlerts.filter(a => a.severity === 'high');
  const pendingReturns = mockReturnOrders.filter(r => r.status === 'Pending').length;

  // ── Field Mode ──────────────────────────────────────────────
  if (isField) {
    return (
      <MobileLayout>
        <div className="min-h-screen" style={{ background: F.bg }}>
          {/* Field Header */}
          <div className="p-4 flex items-center justify-between" style={{ background: F.header, borderBottom: `1.5px solid ${F.border}` }}>
            <div>
              <div className="flex items-center gap-1.5 text-xs mb-0.5" style={{ color: F.accent }}>
                <span>⚡</span> Field Mode
              </div>
              <h1 className="text-xl font-bold" style={{ color: F.text }}>RetailFlow Pro</h1>
            </div>
            <ModeSwitcher compact />
          </div>

          {/* Urgent Banner */}
          {urgentAlerts.length > 0 && (
            <div className="p-4" style={{ background: F.alertHighBg, borderBottom: `1.5px solid ${F.alertHighBorder}` }}>
              <div className="font-bold text-lg" style={{ color: F.alertHighBorder }}>{urgentAlerts.length} Urgent Alerts</div>
              <div className="text-sm" style={{ color: F.alertHigh }}>Requires immediate attention</div>
            </div>
          )}

          {/* Alert Cards */}
          <div className="p-4 space-y-4">
            <div className="text-sm font-bold mb-2" style={{ color: F.accent }}>Alerts</div>
            {mockAlerts.map((alert) => (
              <div
                key={alert.id}
                onClick={() => navigate(`/mobile/alert/${alert.id}`)}
                className="rounded-xl p-4 cursor-pointer active:opacity-80"
                style={{
                  background: F.surface,
                  border: `2px solid ${alert.severity === 'high' ? F.alertHighBorder :
                    alert.severity === 'medium' ? F.alertMedBorder :
                      F.border
                    }`,
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className="px-2 py-1 rounded text-xs font-bold"
                    style={{
                      background: alert.severity === 'high' ? F.alertHigh :
                        alert.severity === 'medium' ? F.alertMed : F.border,
                      color: F.text,
                    }}
                  >
                    {alert.status === 'OUT_OF_STOCK' ? 'Out of Stock' : alert.status === 'URGENT' ? 'Urgent' : 'Low Stock'}
                  </span>
                  <span className="text-sm" style={{ color: F.textMid }}>{alert.location}</span>
                </div>
                <div className="text-xl font-bold mb-1" style={{ color: F.text }}>{alert.productName}</div>
                <div className="flex items-center gap-4 mb-4">
                  <div>
                    <div className="text-xs" style={{ color: F.textSoft }}>Current Stock</div>
                    <div className="text-2xl font-bold" style={{
                      color: alert.currentStock === 0 ? F.alertHighBorder : F.accent
                    }}>{alert.currentStock}</div>
                  </div>
                  <div style={{ color: F.border }} className="text-xl">/</div>
                  <div>
                    <div className="text-xs" style={{ color: F.textSoft }}>Safety Level</div>
                    <div className="text-2xl font-bold" style={{ color: F.textMid }}>{alert.safetyStock}</div>
                  </div>
                  <div className="ml-auto">
                    <div className="text-xs" style={{ color: F.textSoft }}>Daily Sales</div>
                    <div className="text-2xl font-bold" style={{ color: F.text }}>{alert.dailySales}</div>
                  </div>
                </div>
                <div className="flex items-center justify-between" style={{ color: F.textSoft }}>
                  <span className="text-sm">View Details</span>
                  <ChevronRight className="w-5 h-5" />
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="p-4 grid grid-cols-2 gap-4">
            <button
              onClick={() => navigate('/mobile/inbound')}
              className="p-5 rounded-xl text-center"
              style={{ background: `linear-gradient(135deg, ${F.surface}, ${F.surfaceLight})`, border: `2px solid ${F.border}` }}
            >
              <div className="font-bold" style={{ color: F.text }}>Inbound Inspection</div>
              <div className="text-sm mt-1" style={{ color: F.accent }}>4 Pending</div>
            </button>
            <button
              onClick={() => navigate('/mobile/return')}
              className="p-5 rounded-xl text-center"
              style={{ background: F.accent, border: `2px solid ${F.accentBorder}` }}
            >
              <div className="font-bold" style={{ color: F.accentText }}>Return Inspection</div>
              <div className="text-sm mt-1" style={{ color: '#5A4020' }}>{pendingReturns} Pending</div>
            </button>
          </div>
        </div>
      </MobileLayout>
    );
  }

  // ── Standard Mode ───────────────────────────────────────────
  return (
    <MobileLayout>
      <div className="min-h-screen" style={{ background: '#F7F6F4' }}>
        {/* Header */}
        <div className="px-4 py-4 flex items-center justify-between" style={{ background: '#F7F6F4', borderBottom: '1.5px solid #E5E0D8' }}>
          <div>
            <h1 className="text-xl font-bold" style={{ color: '#2C3540' }}>RetailFlow Pro</h1>
            <p className="text-xs" style={{ color: '#9AA0A8' }}>Retail Flow Management</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Bell className="w-6 h-6" style={{ color: '#9AA0A8' }} />
              {urgentAlerts.length > 0 && (
                <span
                  className="absolute -top-1 -right-1 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center"
                  style={{ background: '#BF8888' }}
                >
                  {urgentAlerts.length}
                </span>
              )}
            </div>
            <ModeSwitcher compact />
          </div>
        </div>

        {/* Today Summary */}
        <div className="p-4">
          <div
            className="rounded-2xl p-5 text-white mb-5 shadow-sm"
            style={{ background: 'linear-gradient(135deg, #8B9EAD, #7A8EA0)' }}
          >
            <div className="text-sm mb-3" style={{ color: 'rgba(255,255,255,0.75)' }}>Today Overview · 2026-04-16</div>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">¥1.28M</div>
                <div className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.65)' }}>Sales</div>
              </div>
              <div className="text-center" style={{ borderLeft: '1px solid rgba(255,255,255,0.25)', borderRight: '1px solid rgba(255,255,255,0.25)' }}>
                <div className="text-2xl font-bold text-white">{urgentAlerts.length}</div>
                <div className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.65)' }}>Urgent Alerts</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">4</div>
                <div className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.65)' }}>Pending Inbound</div>
              </div>
            </div>
          </div>

          {/* Urgent Alerts */}
          <div className="mb-5">
            <div className="flex items-center justify-between mb-3 px-1">
              <div className="flex items-center gap-2">
                <span className="font-bold" style={{ color: '#2C3540' }}>Urgent Alerts</span>
                <span
                  className="text-white text-xs px-2 py-0.5 rounded-full"
                  style={{ background: '#BF8888' }}
                >
                  {urgentAlerts.length}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              {mockAlerts.map((alert) => (
                <div
                  key={alert.id}
                  onClick={() => navigate(`/mobile/alert/${alert.id}`)}
                  className="rounded-2xl p-4 cursor-pointer active:scale-[0.98] transition-transform"
                  style={{
                    background: '#ffffff',
                    border: alert.severity === 'high' ? '1.5px solid #D4AAAA' :
                      alert.severity === 'medium' ? '1.5px solid #DECA9A' :
                        '1.5px solid #E5E0D8',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                  }}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className="px-2.5 py-1 rounded-full text-xs font-bold"
                          style={{
                            background: alert.status === 'OUT_OF_STOCK' ? '#EFE5E5' :
                              alert.status === 'URGENT' ? '#EFE5E5' : '#F5EDE0',
                            color: alert.status === 'OUT_OF_STOCK' ? '#BF8888' :
                              alert.status === 'URGENT' ? '#BF8888' : '#A87A45',
                          }}
                        >
                          {alert.status === 'OUT_OF_STOCK' ? 'Out of Stock' : alert.status === 'URGENT' ? 'Urgent' : 'Low Stock'}
                        </span>
                        <span className="text-xs" style={{ color: '#9AA0A8' }}>{alert.location}</span>
                      </div>
                      <div className="font-bold mb-2" style={{ color: '#2C3540' }}>{alert.productName}</div>
                      <div className="flex items-center gap-3 text-sm">
                        <div>
                          <span className="text-xs" style={{ color: '#9AA0A8' }}>Stock </span>
                          <span className="font-bold" style={{ color: alert.currentStock === 0 ? '#BF8888' : '#C4A97A' }}>
                            {alert.currentStock}
                          </span>
                          <span className="text-xs" style={{ color: '#C0BCB8' }}> / {alert.safetyStock}</span>
                        </div>
                        <div style={{ color: '#E5E0D8' }}>|</div>
                        <div>
                          <span className="text-xs" style={{ color: '#9AA0A8' }}>Daily </span>
                          <span className="font-bold" style={{ color: '#2C3540' }}>{alert.dailySales}</span>
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 flex-shrink-0 mt-1" style={{ color: '#C0BCB8' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mb-4">
            <div className="font-bold mb-3 px-1" style={{ color: '#2C3540' }}>Quick Actions</div>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => navigate('/mobile/inbound')}
                className="p-5 rounded-2xl text-center shadow-sm active:scale-[0.98] transition-transform"
                style={{ background: 'linear-gradient(135deg, #8B9EAD, #7A8EA0)' }}
              >
                <div className="font-bold text-white">Inbound Inspection</div>
                <div className="text-xs mt-2" style={{ color: 'rgba(255,255,255,0.75)' }}>4 Pending</div>
              </button>
              <button
                onClick={() => navigate('/mobile/return')}
                className="p-5 rounded-2xl text-center shadow-sm active:scale-[0.98] transition-transform"
                style={{ background: 'linear-gradient(135deg, #C4A97A, #B09060)' }}
              >
                <div className="font-bold text-white">Return Inspection</div>
                <div className="text-xs mt-2" style={{ color: 'rgba(255,255,255,0.75)' }}>{pendingReturns} Pending</div>
              </button>
              <button
                onClick={() => navigate('/mobile/inventory')}
                className="p-5 rounded-2xl text-center shadow-sm active:scale-[0.98] transition-transform"
                style={{ background: 'linear-gradient(135deg, #8AB5AF, #6A9E98)' }}
              >
                <div className="font-bold text-white">Inventory</div>
                <div className="text-xs mt-2" style={{ color: 'rgba(255,255,255,0.75)' }}>Real-time</div>
              </button>
              <button
                onClick={() => navigate('/web')}
                className="p-5 rounded-2xl text-center shadow-sm active:scale-[0.98] transition-transform"
                style={{ background: 'linear-gradient(135deg, #BF8888, #A07070)' }}
              >
                <div className="font-bold text-white">Web Dashboard</div>
                <div className="text-xs mt-2" style={{ color: 'rgba(255,255,255,0.75)' }}>Deep Analytics</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}