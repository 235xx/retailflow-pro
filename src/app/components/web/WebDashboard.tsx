import { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  ShoppingCart, Users, Archive, TrendingUp, AlertTriangle,
  ArrowUpRight, ArrowDownRight, ChevronRight, RefreshCw
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, Legend
} from 'recharts';
import { mockStores, mockTopAlerts, salesTrendData, weeklyStoreData, dashboardKpiData } from '../../data/mockData';
import { useAppData } from '../../context/AppDataContext';
import { StockConflictDialog } from '../dialogs/StockConflictDialog';
import { DispatchApprovalDialog } from '../dialogs/DispatchApprovalDialog';
import { WebLayout } from './WebLayout';

const formatNumber = (num: number): string => {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + 'M';
  }
  return num.toLocaleString();
};

const getKpiData = () => {
  const sales = dashboardKpiData.find(d => d.label === "Today's Sales")?.value || 0;
  const orders = dashboardKpiData.find(d => d.label === 'Orders')?.value || 0;
  const traffic = dashboardKpiData.find(d => d.label === 'Foot Traffic')?.value || 0;
  const inventory = dashboardKpiData.find(d => d.label === 'Total Inventory')?.value || 0;

  return [
    {
      icon: ShoppingCart, label: "Today's Sales", value: '¥' + formatNumber(sales),
      change: '+12.5%', up: true, sub: 'vs yesterday',
      accentColor: '#8B9EAD', accentBg: '#E8F0F5',
    },
    {
      icon: ShoppingCart, label: 'Orders', value: orders.toLocaleString(),
      change: '+8.3%', up: true, sub: 'items',
      accentColor: '#8AB5AF', accentBg: '#E5EEEC',
    },
    {
      icon: Users, label: 'Foot Traffic', value: traffic.toLocaleString(),
      change: '-2.1%', up: false, sub: 'visitors',
      accentColor: '#C4A97A', accentBg: '#F5EDE0',
    },
    {
      icon: Archive, label: 'Total Inventory', value: inventory.toLocaleString(),
      change: '+3.7%', up: true, sub: 'units',
      accentColor: '#BF8888', accentBg: '#EFE5E5',
    },
  ];
};

const kpiData = getKpiData();

const recentHandoffs = [
  { id: '1', user: 'David Chen', action: 'Transfer Request', product: 'Nestle Milk Powder', time: '09:35', status: 'pending' },
  { id: '2', user: 'Emily Wong', action: 'Transfer Request', product: 'Yili Pure Milk', time: '08:50', status: 'done' },
];

const cardStyle = {
  background: '#F7F6F4',
  border: '1px solid #E5E0D8',
  boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
};

export function WebDashboard() {
  const navigate = useNavigate();
  const { alerts, storeAlertCount } = useAppData();
  const [showConflictDialog, setShowConflictDialog] = useState(false);
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);
  const [lastRefresh, setLastRefresh] = useState('09:35:22');

  return (
    <WebLayout title="Dashboard">
      <div className="p-6">
        {/* Page Title */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold" style={{ color: '#2C3540' }}>Dashboard</h2>
            <p className="text-sm mt-1" style={{ color: '#9AA0A8' }}>2026-04-16 · Real-time Data</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setLastRefresh(new Date().toLocaleTimeString())}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors"
              style={{ background: '#F7F6F4', border: '1.5px solid #E5E0D8', color: '#9AA0A8' }}
              onMouseEnter={e => (e.currentTarget.style.background = '#F0EDE8')}
              onMouseLeave={e => (e.currentTarget.style.background = '#F7F6F4')}
            >
              <RefreshCw className="w-4 h-4" />
              Refresh · {lastRefresh}
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {kpiData.map((kpi, i) => {
            const Icon = kpi.icon;
            return (
              <div key={i} className="rounded-xl p-5" style={cardStyle}>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: kpi.accentBg }}>
                    <Icon className="w-5 h-5" style={{ color: kpi.accentColor }} />
                  </div>
                  <div
                    className="flex items-center gap-1 text-sm font-bold"
                    style={{ color: kpi.up ? '#6A9A7A' : '#BF8888' }}
                  >
                    {kpi.up ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                    {kpi.change}
                  </div>
                </div>
                <div className="text-sm mb-1" style={{ color: '#9AA0A8' }}>{kpi.label}</div>
                <div className="text-2xl font-bold" style={{ color: '#2C3540' }}>{kpi.value}</div>
                <div className="mt-2 h-0.5 rounded-full" style={{ background: kpi.accentBg }}>
                  <div className="h-full rounded-full w-3/4" style={{ background: kpi.accentColor }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-3 gap-6 mb-6">
          {/* Sales Trend Chart */}
          <div className="col-span-2 rounded-xl p-6" style={cardStyle}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold" style={{ color: '#2C3540' }}>Sales Trend</h3>
                <p className="text-sm" style={{ color: '#9AA0A8' }}>This Week vs Last Week</p>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <span className="flex items-center gap-1" style={{ color: '#9AA0A8' }}>
                  <span className="w-3 h-3 rounded-full inline-block" style={{ background: '#8B9EAD' }} />This Week
                </span>
                <span className="flex items-center gap-1" style={{ color: '#9AA0A8' }}>
                  <span className="w-3 h-3 rounded-full inline-block" style={{ background: '#8AB5AF' }} />Last Week
                </span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={salesTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ECEAE5" />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#9AA0A8' }} />
                <YAxis tick={{ fontSize: 12, fill: '#9AA0A8' }} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #E5E0D8', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} />
                <Line type="monotone" dataKey="value" stroke="#8B9EAD" strokeWidth={2.5} dot={{ r: 4, fill: '#8B9EAD' }} name="This Week" />
                <Line type="monotone" dataKey="lastWeek" stroke="#8AB5AF" strokeWidth={2} strokeDasharray="4 4" dot={false} name="Last Week" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Handoff & Quick Actions */}
          <div className="space-y-4">
            {/* Handoff Panel */}
            <div className="rounded-xl p-4" style={cardStyle}>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#8B9EAD' }}>
                  <span className="text-white text-sm">⇄</span>
                </div>
                <h3 className="font-bold" style={{ color: '#2C3540' }}>Handoff Tasks</h3>
                <span
                  className="text-xs px-2 py-0.5 rounded-full"
                  style={{ background: '#EFE5E5', color: '#BF8888', border: '1px solid #D4AAAA' }}
                >
                  {recentHandoffs.filter(h => h.status === 'pending').length} Pending
                </span>
              </div>
              <div className="space-y-2">
                {recentHandoffs.map(handoff => (
                  <div
                    key={handoff.id}
                    className="p-3 rounded-lg cursor-pointer transition-colors"
                    style={{
                      border: handoff.status === 'pending' ? '1px solid #CCDBE5' : '1px solid #ECEAE5',
                      background: handoff.status === 'pending' ? '#E8F0F5' : '#F4F3F0',
                    }}
                    onClick={() => navigate(`/web/product/${handoff.id}`)}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-bold" style={{ color: '#2C3540' }}>{handoff.user}</span>
                      <span className="text-xs" style={{ color: '#9AA0A8' }}>{handoff.time}</span>
                    </div>
                    <div className="text-xs" style={{ color: '#6A7580' }}>{handoff.action} · {handoff.product}</div>
                    {handoff.status === 'pending' && (
                      <button
                        onClick={(e) => { e.stopPropagation(); navigate(`/web/product/${handoff.id}`); }}
                        className="mt-2 w-full text-white text-xs py-1.5 rounded font-bold transition-colors"
                        style={{ background: '#8B9EAD' }}
                      >
                        Open Decision Panel →
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Demo Buttons */}
            <div className="rounded-xl p-4 space-y-2" style={cardStyle}>
              <h3 className="font-bold text-sm mb-3" style={{ color: '#2C3540' }}>Dialog Demo</h3>
              <button
                onClick={() => setShowConflictDialog(true)}
                className="w-full py-2.5 text-sm rounded-xl font-bold flex items-center justify-center gap-2 transition-colors"
                style={{ background: '#EFE5E5', border: '1.5px solid #D4AAAA', color: '#BF8888' }}
              >
                <AlertTriangle className="w-4 h-4" />
                Stock Conflict Alert
              </button>
              <button
                onClick={() => setShowApprovalDialog(true)}
                className="w-full py-2.5 text-sm rounded-xl font-bold flex items-center justify-center gap-2 transition-colors"
                style={{ background: '#E5EEEC', border: '1.5px solid #C8DDD9', color: '#6A9A7A' }}
              >
                <TrendingUp className="w-4 h-4" />
                Transfer Approval Demo
              </button>
              <button
                onClick={() => navigate('/web/transfer')}
                className="w-full text-white py-2.5 text-sm rounded-xl font-bold transition-colors"
                style={{ background: '#8B9EAD' }}
              >
                Go to Transfer Center →
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Alert Table */}
          <div className="col-span-2 rounded-xl overflow-hidden" style={cardStyle}>
            <div className="px-5 py-4 flex items-center justify-between" style={{ background: '#8B9EAD' }}>
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-white/80" />
                <h3 className="font-bold text-white">Top 5 Alerts Focus</h3>
              </div>
              <button
                onClick={() => navigate('/web/monitor')}
                className="text-sm text-white/70 hover:text-white flex items-center gap-1"
              >
                View All <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="divide-y" style={{ borderColor: '#ECEAE5' }}>
              <div
                className="grid grid-cols-5 gap-4 px-5 py-3 text-xs font-bold uppercase tracking-wide"
                style={{ background: '#EDE9E3', color: '#9AA0A8' }}
              >
                <div>Level</div>
                <div className="col-span-2">Description</div>
                <div>Store</div>
                <div>Status</div>
              </div>
              {mockTopAlerts.map((alert, index) => (
                <div
                  key={index}
                  className="grid grid-cols-5 gap-4 px-5 py-3.5 cursor-pointer transition-colors"
                  style={{ borderBottom: '1px solid #ECEAE5' }}
                  onClick={() => navigate(`/web/product/${alert.productId}`)}
                  onMouseEnter={e => (e.currentTarget.style.background = '#F7F6F4')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{
                      background: alert.severity === 'high' ? '#BF8888' : alert.severity === 'medium' ? '#C4A97A' : '#9AA0A8'
                    }} />
                    <span className="text-xs font-bold" style={{
                      color: alert.severity === 'high' ? '#BF8888' : alert.severity === 'medium' ? '#C4A97A' : '#9AA0A8'
                    }}>
                      {alert.severity === 'high' ? 'High' : alert.severity === 'medium' ? 'Medium' : 'Low'}
                    </span>
                  </div>
                  <div className="col-span-2 text-sm font-medium" style={{ color: '#2C3540' }}>{alert.description}</div>
                  <div
                    className="text-sm cursor-pointer hover:underline"
                    style={{ color: '#8B9EAD' }}
                    onClick={(e) => { e.stopPropagation(); navigate(`/web/store/${alert.storeId}`); }}
                  >
                    {alert.store}
                  </div>
                  <div>
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{
                      background: alert.status === 'URGENT' ? '#EFE5E5' : alert.status === 'LOW_STOCK' ? '#E8F0F5' : '#E5EEEC',
                      color: alert.status === 'URGENT' ? '#BF8888' : alert.status === 'LOW_STOCK' ? '#8B9EAD' : '#6A9A7A',
                    }}>
                      {alert.status === 'URGENT' ? 'Urgent' : alert.status === 'LOW_STOCK' ? 'Low Stock' : 'Out of Stock'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Store Ranking */}
          <div className="rounded-xl overflow-hidden" style={cardStyle}>
            <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid #E5E0D8' }}>
              <h3 className="font-bold" style={{ color: '#2C3540' }}>Store Sales Ranking</h3>
              <button
                onClick={() => navigate('/web/stores')}
                className="text-sm hover:underline"
                style={{ color: '#8B9EAD' }}
              >
                All Stores
              </button>
            </div>
            <div className="p-4 space-y-3">
              {mockStores.map((store) => (
                <div
                  key={store.id}
                  className="flex items-center gap-3 cursor-pointer rounded-lg p-2 -mx-2 transition-colors"
                  onClick={() => navigate(`/web/store/${store.id}`)}
                  onMouseEnter={e => (e.currentTarget.style.background = '#F0EDE8')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0" style={{
                    background: store.rank === 1 ? '#C4A97A' : store.rank === 2 ? '#8AB5AF' : store.rank === 3 ? '#9AB3C4' : '#ECEAE5',
                    color: store.rank <= 3 ? 'white' : '#9AA0A8',
                  }}>
                    {store.rank}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate" style={{ color: '#2C3540' }}>{store.name}</div>
                    <div className="flex items-center gap-1 mt-0.5">
                      <div className="flex-1 h-1.5 rounded-full" style={{ background: '#ECEAE5' }}>
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${(store.sales / 450000) * 100}%`, background: '#8B9EAD' }}
                        />
                      </div>
                      <span className="text-xs flex-shrink-0" style={{ color: '#9AA0A8' }}>¥{(store.sales / 10000).toFixed(0)}w</span>
                    </div>
                  </div>
                  {store.alerts > 0 && (
                    <div
                      className="w-5 h-5 text-white text-xs rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: '#BF8888' }}
                    >
                      {storeAlertCount(store.id)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Weekly Store Chart */}
        <div className="mt-6 rounded-xl p-6" style={cardStyle}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold" style={{ color: '#2C3540' }}>Weekly Sales Comparison</h3>
            <button
              onClick={() => navigate('/web/stores')}
              className="text-sm hover:underline flex items-center gap-1"
              style={{ color: '#8B9EAD' }}
            >
              Detailed Analysis <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={weeklyStoreData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ECEAE5" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#9AA0A8' }} />
              <YAxis tick={{ fontSize: 11, fill: '#9AA0A8' }} unit="w" />
              <Tooltip
                formatter={(val) => [`$${val}0K`, '']}
                contentStyle={{ borderRadius: '12px', border: '1px solid #E5E0D8', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
              />
              <Legend />
              <Bar dataKey="sales" name="Actual Sales" fill="#8B9EAD" radius={[4, 4, 0, 0]} />
              <Bar dataKey="target" name="Target" fill="#8AB5AF" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {showConflictDialog && (
        <StockConflictDialog
          product={{ name: 'Nestle Milk Powder (900g)', currentStock: 150, safetyStock: 200, pendingOrders: 5 }}
          onResolve={(action) => {
            setShowConflictDialog(false);
            alert(`Selected: ${action === 'priority' ? 'Priority Allocation' : action === 'split' ? 'Proportional Allocation' : 'Postpone'}`);
          }}
          onClose={() => setShowConflictDialog(false)}
        />
      )}

      {showApprovalDialog && (
        <DispatchApprovalDialog
          request={{
            id: 'DISP-2026-001',
            productName: 'Nestle Milk Powder (900g)',
            fromStore: 'Central Warehouse',
            toStore: "People's Square Flagship",
            quantity: 50,
            urgency: 'high',
            reason: 'Weekend promotion, stock expected to be insufficient',
            requestedBy: 'Zhang Wei',
            requestedAt: '2026-04-16 09:30',
          }}
          onApprove={() => { setShowApprovalDialog(false); alert('Transfer approved!'); }}
          onReject={() => { setShowApprovalDialog(false); alert('Transfer rejected!'); }}
          onClose={() => setShowApprovalDialog(false)}
        />
      )}
    </WebLayout>
  );
}