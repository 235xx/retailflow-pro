import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Search, AlertTriangle, ChevronRight, Package, Clock, Zap, Store } from 'lucide-react';
import { MobileLayout } from './MobileLayout';
import { ModeSwitcher } from './ModeSwitcher';
import { useMode } from '../../context/ModeContext';
import { useAppData } from '../../context/AppDataContext';
import { F } from '../../colors';

const statusMap: Record<string, string> = {
  'Pending': 'Pending',
  'Completed': 'Completed',
  'Partially Received': 'Partial',
};

const statusColors: Record<string, { bg: string; text: string; border: string }> = {
  'Pending': { bg: '#E8F0F5', text: '#8B9EAD', border: '#CCDBE5' },
  'Completed': { bg: '#E5EEEC', text: '#6A9A7A', border: '#C8DDD9' },
  'Partial': { bg: '#F5EDE0', text: '#A87A45', border: '#DECA9A' },
};

const priorityConfig = {
  high: { label: 'High Priority', short: 'High', dot: '#BF8888', text: '#BF8888', badge: { bg: '#EFE5E5', border: '#D4AAAA', text: '#BF8888' } },
  medium: { label: 'Medium Priority', short: 'Med', dot: '#C4A97A', text: '#A87A45', badge: { bg: '#F5EDE0', border: '#DECA9A', text: '#A87A45' } },
  low: { label: 'Low Priority', short: 'Low', dot: '#8B9EAD', text: '#8B9EAD', badge: { bg: '#E8F0F5', border: '#CCDBE5', text: '#8B9EAD' } },
};

type StatusTab = 'All' | 'Pending' | 'Partial' | 'Completed';
type PriorityFilter = 'all' | 'high' | 'medium' | 'low';

const statusTabConfig = [
  { key: 'All' as StatusTab, activeColor: '#8B9EAD', inactiveBg: '#E8F0F5', inactiveText: '#8B9EAD' },
  { key: 'Pending' as StatusTab, activeColor: '#9AB3C4', inactiveBg: '#E8F0F5', inactiveText: '#8B9EAD' },
  { key: 'Partial' as StatusTab, activeColor: '#C4A97A', inactiveBg: '#F5EDE0', inactiveText: '#A87A45' },
  { key: 'Completed' as StatusTab, activeColor: '#6A9A7A', inactiveBg: '#E5EEEC', inactiveText: '#6A9A7A' },
];

export function MobileInboundList() {
  const navigate = useNavigate();
  const { isField } = useMode();
  const { inboundOrders } = useAppData();
  const [statusTab, setStatusTab] = useState<StatusTab>('All');
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>('all');
  const [searchText, setSearchText] = useState('');
  const [fieldTab, setFieldTab] = useState<string>('All');

  const statusCounts = (status: StatusTab) => {
    if (status === 'All') return inboundOrders.length;
    return inboundOrders.filter(o => statusMap[o.status] === status).length;
  };

  const filteredOrders = inboundOrders.filter(order => {
    const statusText = statusMap[order.status] || order.status;
    if (statusTab !== 'All' && statusText !== statusTab) return false;
    if (priorityFilter !== 'all' && order.priority !== priorityFilter) return false;
    if (searchText && !order.orderId.includes(searchText) && !order.supplier.includes(searchText)) return false;
    return true;
  });

  // ── Field Mode ─────────────────────────────────────────────
  if (isField) {
    const fieldFiltered = inboundOrders.filter(order => {
      const statusText = statusMap[order.status] || order.status;
      if (fieldTab === 'Pending' && statusText !== 'Pending') return false;
      if (fieldTab === 'Partial' && statusText !== 'Partial') return false;
      return true;
    });

    return (
      <MobileLayout>
        <div className="min-h-screen" style={{ background: F.bg }}>
          <div className="p-4 flex items-center justify-between" style={{ background: F.header, borderBottom: `1.5px solid ${F.border}` }}>
            <div>
              <div className="flex items-center gap-1 text-xs mb-0.5" style={{ color: F.accent }}>
                <Zap className="w-3 h-3" /> Field Mode
              </div>
              <h1 className="text-xl font-bold" style={{ color: F.text }}>Inbound Inspection</h1>
            </div>
            <ModeSwitcher compact />
          </div>

          <div className="p-4" style={{ background: F.surface, borderBottom: `1.5px solid ${F.border}` }}>
            <div className="grid grid-cols-3 gap-3">
              {['All', 'Pending', 'Partial'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setFieldTab(tab)}
                  className="py-3 rounded-lg font-bold text-sm transition-all"
                  style={{
                    background: fieldTab === tab ? F.accent : F.border,
                    color: fieldTab === tab ? F.accentText : F.textMid,
                  }}
                >
                  {tab}
                  {tab !== 'All' && (
                    <span className="ml-1 opacity-70">
                      ({inboundOrders.filter(o => statusMap[o.status] === tab).length})
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 space-y-4">
            {fieldFiltered.map((order) => {
              const statusText = statusMap[order.status] || order.status;
              const totalQty = order.items.reduce((sum, i) => sum + i.expected, 0);
              return (
                <div
                  key={order.id}
                  className="rounded-xl p-4 cursor-pointer active:scale-95 transition-all"
                  style={{
                    background: F.surface,
                    border: `2px solid ${statusText === 'Completed' ? F.successBorder : F.border}`,
                  }}
                  onClick={() => navigate(`/mobile/inbound/${order.id}`)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="text-2xl font-bold" style={{ color: F.text }}>{order.orderId}</div>
                      <div className="mt-1 flex items-center gap-1" style={{ color: F.textMid }}>
                        <Store className="w-4 h-4" />
                        <span>{order.supplier}</span>
                      </div>
                    </div>
                    <div
                      className="px-3 py-1 rounded-full text-sm font-bold"
                      style={statusColors[statusText]
                        ? { background: statusColors[statusText].bg, color: statusColors[statusText].text }
                        : { background: F.border, color: F.textMid }
                      }
                    >
                      {statusText}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-xs" style={{ color: F.textSoft }}>Total Qty</div>
                      <div className="text-2xl font-bold" style={{ color: F.accent }}>{totalQty}</div>
                    </div>
                    {order.estimatedArrival && (
                      <div className="flex items-center gap-1" style={{ color: F.accent }}>
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">{order.estimatedArrival}</span>
                      </div>
                    )}
                  </div>
                  <button
                    className="w-full py-4 font-bold rounded-lg"
                    style={{ background: F.accent, color: F.accentText }}
                  >
                    Inspect Now →
                  </button>
                </div>
              );
            })}

            {fieldFiltered.length === 0 && (
              <div className="text-center py-12" style={{ color: F.textSoft }}>
                <Package className="w-12 h-12 mx-auto mb-4" style={{ color: F.border }} />
                <p>No inbound orders</p>
              </div>
            )}
          </div>
        </div>
      </MobileLayout>
    );
  }

  // ── Standard Mode ──────────────────────────────────────────
  return (
    <MobileLayout>
      <div className="min-h-screen" style={{ background: '#F7F6F4' }}>
        <div className="p-4" style={{ background: '#F7F6F4', borderBottom: '1.5px solid #E5E0D8' }}>
          <h1 className="font-bold text-center" style={{ color: '#2C3540' }}>Inbound Inspection</h1>
        </div>

        <ModeSwitcher />

        <div className="p-4">
          {/* Status Tab Cards */}
          <div className="grid grid-cols-4 gap-2 mb-4">
            {statusTabConfig.map(tab => {
              const isActive = statusTab === tab.key;
              const count = statusCounts(tab.key);
              return (
                <button
                  key={tab.key}
                  onClick={() => setStatusTab(isActive && tab.key !== 'All' ? 'All' : tab.key)}
                  className="rounded-xl p-2 text-center transition-all"
                  style={{
                    border: '1.5px solid',
                    borderColor: isActive ? tab.activeColor : '#E5E0D8',
                    background: isActive ? tab.activeColor : tab.inactiveBg,
                    color: isActive ? 'white' : tab.inactiveText,
                    transform: isActive ? 'scale(1.05)' : 'scale(1)',
                  }}
                >
                  <div className="text-xl font-bold">{count}</div>
                  <div className="text-xs mt-0.5 leading-tight">
                    {tab.key === 'All' ? 'All' : tab.key === 'Partial' ? 'Partial' : tab.key}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Priority Filter */}
          <div className="flex gap-2 mb-3 overflow-x-auto">
            {([
              { key: 'all' as const, label: 'All' },
              { key: 'high' as const, label: '⚡ High' },
              { key: 'medium' as const, label: '📌 Med' },
              { key: 'low' as const, label: '📄 Low' },
            ]).map(p => (
              <button
                key={p.key}
                onClick={() => setPriorityFilter(p.key)}
                className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-colors"
                style={{
                  border: '1.5px solid',
                  borderColor: priorityFilter === p.key ? '#8B9EAD' : '#F7F6F4',
                  background: priorityFilter === p.key ? '#8B9EAD' : 'white',
                  color: priorityFilter === p.key ? 'white' : '#9AA0A8',
                }}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#9AA0A8' }} />
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search order ID or supplier..."
              className="w-full rounded-lg pl-9 pr-4 py-2.5 text-sm outline-none"
              style={{ border: '1.5px solid #E5E0D8', color: '#2C3540', background: '#ffffff' }}
            />
          </div>

          {/* Order List */}
          <div className="space-y-3">
            {filteredOrders.map((order) => {
              const statusText = statusMap[order.status] || order.status;
              const totalQty = order.items.reduce((sum, i) => sum + i.expected, 0);
              return (
                <div
                  key={order.id}
                  className="bg-white rounded-xl p-4 cursor-pointer active:scale-95 transition-all"
                  style={{ border: '1.5px solid #E5E0D8' }}
                  onClick={() => navigate(`/mobile/inbound/${order.id}`)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold" style={{ color: '#2C3540' }}>{order.orderId}</span>
                      {order.priority && (
                        <span
                          className="text-xs px-2 py-0.5 rounded-full font-bold"
                          style={{
                            background: priorityConfig[order.priority].badge.bg,
                            color: priorityConfig[order.priority].badge.text,
                            border: `1px solid ${priorityConfig[order.priority].badge.border}`,
                          }}
                        >
                          {priorityConfig[order.priority].short}
                        </span>
                      )}
                    </div>
                    <span
                      className="text-xs px-2 py-1 rounded-full flex-shrink-0"
                      style={statusColors[statusText] ? {
                        background: statusColors[statusText].bg,
                        color: statusColors[statusText].text,
                        border: `1px solid ${statusColors[statusText].border}`,
                      } : {}}
                    >
                      {statusText}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-y-1 text-sm mb-3" style={{ color: '#9AA0A8' }}>
                    <div className="flex items-center gap-1">
                      <Store className="w-3 h-3" />
                      <span>Supplier:</span>
                      <span className="font-medium" style={{ color: '#8B9EAD' }}>{order.supplier}</span>
                    </div>
                    <div>Total Qty: <span className="font-medium" style={{ color: '#2C3540' }}>{totalQty}</span></div>
                    {order.estimatedArrival && (
                      <div className="flex items-center gap-1" style={{ color: '#9AA0A8' }}>
                        <Clock className="w-3 h-3" />
                        Est.: <span className="font-medium" style={{ color: '#2C3540' }}>{order.estimatedArrival}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-xs" style={{ color: '#9AA0A8' }}>{order.date}</div>
                    <ChevronRight className="w-5 h-5" style={{ color: '#E5E0D8' }} />
                  </div>
                </div>
              );
            })}

            {filteredOrders.length === 0 && (
              <div className="text-center py-12" style={{ color: '#9AA0A8' }}>
                <Package className="w-10 h-10 mx-auto mb-3" style={{ color: '#E5E0D8' }} />
                <p className="text-sm">No matching inbound orders</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}
