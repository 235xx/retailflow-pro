import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import {
  ArrowLeft, Package, TrendingUp, AlertTriangle, ChevronRight,
  Search, Filter, ArrowUpRight,
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';
import { mockStores, mockProducts, salesTrendData } from '../../data/mockData';
import { useAppData } from '../../context/AppDataContext';
import { WebLayout } from './WebLayout';

const statusConfig = {
  normal: { label: 'Normal', bg: '#E5EEEC', text: '#6A9A7A', border: '#C8DDD9', bar: '#8AB5AF' },
  low: { label: 'Low Stock', bg: '#F5EDE0', text: '#A87A45', border: '#DECA9A', bar: '#C4A97A' },
  out: { label: 'Out of Stock', bg: '#EFE5E5', text: '#BF8888', border: '#D4AAAA', bar: '#BF8888' },
  overstock: { label: 'Overstock', bg: '#E8F0F5', text: '#8B9EAD', border: '#CCDBE5', bar: '#8B9EAD' },
};

const M = {
  text: '#2C3540',
  textSub: '#6A7580',
  textMuted: '#9AA0A8',
  border: '#E5E0D8',
  borderMid: '#ECEAE5',
  bg: '#ffffff',
  bgLight: '#ECEAE5',
  card: '#F7F6F4',
  primary: '#8B9EAD',
  success: '#6A9A7A',
  warning: '#C4A97A',
  danger: '#BF8888',
};

function ChartTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="text-xs px-3 py-2 rounded-lg shadow-lg" style={{ background: M.text, color: '#F7F6F4' }}>
        <div className="mb-0.5" style={{ color: M.textMuted }}>{label}</div>
        <div className="font-bold">{payload[0].value}</div>
      </div>
    );
  }
  return null;
}

export function WebStoreDetail() {
  const navigate = useNavigate();
  const { storeId } = useParams();
  const { alerts } = useAppData();
  const [activeTab, setActiveTab] = useState<'inventory' | 'alerts' | 'trends'>('inventory');
  const [searchText, setSearchText] = useState('');

  const store = mockStores.find(s => s.id === storeId) || mockStores[0];
  const currentStoreId = store.id;
  const storeProducts = mockProducts.filter(p => p.storeId === currentStoreId);
  const storeAlerts = alerts.filter(a => a.storeId === currentStoreId);

  const filteredProducts = storeProducts.filter(p =>
    !searchText || p.name.includes(searchText) || p.sku.includes(searchText)
  );

  const alertCount = storeAlerts.length;
  const healthColor = store.stockHealth > 85 ? M.success : M.warning;

  return (
    <WebLayout>
      <div className="p-6" style={{ background: M.bg, minHeight: '100vh' }}>

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm mb-6" style={{ color: M.textMuted }}>
          <button onClick={() => navigate('/web')} className="hover:underline" style={{ color: M.primary }}>Dashboard</button>
          <span>/</span>
          <button onClick={() => navigate('/web/stores')} className="hover:underline" style={{ color: M.primary }}>Stores</button>
          <span>/</span>
          <span className="font-medium" style={{ color: M.text }}>{store.name}</span>
        </div>

        {/* Store Header */}
        <div className="rounded-xl p-6 mb-6" style={{ background: M.card, border: `1.5px solid ${M.border}` }}>
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: M.text }}>
                <Package className="w-8 h-8 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h2 className="text-2xl font-bold" style={{ color: M.text }}>{store.name}</h2>
                  <span className="text-sm px-3 py-0.5 rounded-full font-medium"
                    style={{ background: '#E5EEEC', color: '#6A9A7A', border: '1px solid #C8DDD9' }}>
                    Open
                  </span>
                  <span className="text-sm px-2 py-0.5 rounded"
                    style={{ background: M.bg, color: M.textSub, border: `1px solid ${M.border}` }}>
                    Rank #{store.rank}
                  </span>
                </div>
                <div className="text-sm mb-2" style={{ color: M.textMuted }}>📍 {store.address}</div>
                <div className="text-sm" style={{ color: M.textSub }}>
                  Manager: <span className="font-medium" style={{ color: M.text }}>{store.manager}</span>
                </div>
              </div>
            </div>

            {/* KPIs */}
            <div className="flex gap-8">
              <div className="text-center">
                <div className="text-sm mb-1" style={{ color: M.textMuted }}>Weekly Sales</div>
                <div className="text-2xl font-bold" style={{ color: M.text }}>¥{(store.sales / 10000).toFixed(0)}w</div>
                <div className="text-sm flex items-center gap-1 justify-center" style={{ color: M.success }}>
                  <ArrowUpRight className="w-4 h-4" />+12.5%
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm mb-1" style={{ color: M.textMuted }}>Stock Health</div>
                <div className="text-2xl font-bold" style={{ color: M.text }}>{store.stockHealth}%</div>
                <div className="w-16 h-2 rounded-full mx-auto mt-1" style={{ background: M.borderMid }}>
                  <div className="h-full rounded-full" style={{ width: `${store.stockHealth}%`, background: healthColor }} />
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm mb-1" style={{ color: M.textMuted }}>Alerts</div>
                <div className="text-2xl font-bold" style={{ color: alertCount > 0 ? M.danger : M.success }}>
                  {alertCount}
                </div>
                <div className="text-xs" style={{ color: M.textMuted }}>exceptions</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 p-1 rounded-xl w-fit" style={{ background: 'rgba(255,255,255,0.7)' }}>
          {[
            { key: 'inventory', label: 'Inventory' },
            { key: 'alerts', label: `Alerts (${alertCount})` },
            { key: 'trends', label: 'Sales Trends' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
              style={{
                background: activeTab === tab.key ? 'white' : 'transparent',
                color: activeTab === tab.key ? M.text : M.textMuted,
                boxShadow: activeTab === tab.key ? '0 1px 4px rgba(44,53,64,0.10)' : 'none',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Inventory Tab ── */}
        {activeTab === 'inventory' && (
          <div className="rounded-xl overflow-hidden" style={{ background: M.card, border: `1.5px solid ${M.border}` }}>
            {/* Toolbar */}
            <div className="p-4 flex items-center justify-between" style={{ borderBottom: `1px solid ${M.borderMid}` }}>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: M.textMuted }} />
                  <input
                    type="text"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    placeholder="Search products..."
                    className="pl-9 pr-4 py-2 rounded-lg text-sm outline-none"
                    style={{ border: `1.5px solid ${M.border}`, color: M.text }}
                  />
                </div>
                <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors hover:opacity-80"
                  style={{ border: `1.5px solid ${M.border}`, color: M.textSub, background: M.card }}>
                  <Filter className="w-4 h-4" />
                  Filter
                </button>
              </div>
              <div className="flex gap-2 text-sm" style={{ color: M.textMuted }}>
                <span>{filteredProducts.length} products</span>
                <span>|</span>
                <span style={{ color: M.danger }}>{storeProducts.filter(p => p.status !== 'normal').length} exceptions</span>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: `1px solid ${M.borderMid}`, background: M.bg }}>
                    {['Product', 'Category', 'Stock', 'Status', 'Action'].map((h, i) => (
                      <th key={h}
                        className={`px-5 py-3 text-xs font-bold uppercase tracking-wide ${i >= 2 ? (i === 4 ? 'text-right' : 'text-center') : 'text-left'}`}
                        style={{ color: M.textMuted }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => {
                    const status = statusConfig[product.status];
                    const pct = product.safetyStock > 0 ? (product.currentStock / product.safetyStock) * 100 : 100;
                    const stockTextColor = product.status === 'out' ? M.danger
                      : product.status === 'low' ? M.warning : M.text;
                    return (
                      <tr
                        key={product.id}
                        className="cursor-pointer transition-colors"
                        style={{ borderBottom: `1px solid ${M.borderMid}` }}
                        onMouseEnter={e => (e.currentTarget.style.background = M.bg)}
                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                        onClick={() => navigate(`/web/product/${product.id}`)}
                      >
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2">
                            {product.status !== 'normal' && (
                              <AlertTriangle className="w-4 h-4 flex-shrink-0" style={{ color: M.danger }} />
                            )}
                            <span className="font-medium text-sm" style={{ color: M.text }}>{product.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3.5 text-sm" style={{ color: M.textMuted }}>{product.category}</td>
                        <td className="px-4 py-3.5 text-right">
                          <div className="flex items-center gap-2 justify-end">
                            <div className="w-16 h-1.5 rounded-full overflow-hidden" style={{ background: M.borderMid }}>
                              <div className="h-full rounded-full"
                                style={{ width: `${Math.min(pct, 100)}%`, background: status.bar }} />
                            </div>
                            <span className="font-bold text-sm" style={{ color: stockTextColor }}>
                              {product.currentStock}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3.5 text-center">
                          <span className="text-xs px-2 py-1 rounded-full font-medium"
                            style={{ background: status.bg, color: status.text, border: `1px solid ${status.border}` }}>
                            {status.label}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-right">
                          <button
                            onClick={(e) => { e.stopPropagation(); navigate(`/web/product/${product.id}`); }}
                            className="text-sm flex items-center gap-1 ml-auto hover:underline"
                            style={{ color: M.primary }}
                          >
                            Details <ChevronRight className="w-3 h-3" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Alerts Tab ── */}
        {activeTab === 'alerts' && (
          <div className="rounded-xl overflow-hidden" style={{ background: M.card, border: `1.5px solid ${M.border}` }}>
            <div className="p-5" style={{ borderBottom: `1px solid ${M.borderMid}` }}>
              <h3 className="font-bold" style={{ color: M.text }}>Alert List</h3>
            </div>
            {storeAlerts.length === 0 ? (
              <div className="text-center py-12" style={{ color: M.textMuted }}>
                <AlertTriangle className="w-10 h-10 mx-auto mb-3" style={{ color: M.borderMid }} />
                <p>No alerts for this store</p>
              </div>
            ) : (
              <div>
                {storeAlerts.map((alert, i) => {
                  const dotColor = alert.severity === 'high' ? M.danger
                    : alert.severity === 'medium' ? M.warning : M.primary;

                  const statusBg = alert.status === 'Pending' ? '#EFE5E5' : '#E8F0F5';
                  const statusColor = alert.status === 'Pending' ? M.danger : M.primary;

                  return (
                    <div key={i} className="p-5 flex items-center justify-between transition-colors"
                      style={{ borderBottom: i < storeAlerts.length - 1 ? `1px solid ${M.borderMid}` : 'none' }}
                      onMouseEnter={e => (e.currentTarget.style.background = M.bg)}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: dotColor }} />
                        <div>
                          <div className="font-medium text-sm" style={{ color: M.text }}>{alert.description}</div>
                          <div className="text-xs mt-0.5" style={{ color: M.textMuted }}>{alert.store}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs px-2 py-0.5 rounded-full"
                          style={{ background: statusBg, color: statusColor }}>{alert.status}</span>
                        <button
                          onClick={() => navigate(`/web/product/${alert.productId}`)}
                          className="text-sm hover:underline"
                          style={{ color: M.primary }}
                        >
                          Process →
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── Trends Tab ── */}
        {activeTab === 'trends' && (
          <div className="rounded-xl p-6" style={{ background: M.card, border: `1.5px solid ${M.border}` }}>
            <h3 className="font-bold mb-4" style={{ color: M.text }}>7-Day Sales Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke={M.bgLight} />
                <XAxis dataKey="day" tick={{ fill: M.textMuted, fontSize: 12 }} tickLine={false} />
                <YAxis tick={{ fill: M.textMuted, fontSize: 12 }} tickLine={false} axisLine={false} />
                <Tooltip content={<ChartTooltip />} />
                <Line type="monotone" dataKey="value" stroke={M.text} strokeWidth={2.5}
                  dot={{ r: 5, fill: M.text }} name="Daily Sales (K)" />
                <Line type="monotone" dataKey="lastWeek" stroke={M.borderMid} strokeWidth={2}
                  strokeDasharray="4 4" dot={false} name="Last Week" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </WebLayout>
  );
}