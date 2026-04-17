import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { MapPin, TrendingUp, TrendingDown, Package, AlertTriangle, CheckCircle, ArrowUpRight, Tag } from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, ReferenceLine, AreaChart, Area,
} from 'recharts';
import { salesTrendData, mockAlerts } from '../../data/mockData';
import { WebLayout } from './WebLayout';
import { DispatchApprovalDialog } from '../dialogs/DispatchApprovalDialog';
import { toast } from 'sonner';
import { useAppData } from '../../context/AppDataContext';

// ── Morandi palette ──────────────────────────────────────
const M = {
  primary: '#8B9EAD',
  success: '#8AB5AF',
  successDk: '#6A9A7A',
  warning: '#C4A97A',
  danger: '#BF8888',
  text: '#2C3540',
  textSub: '#6A7580',
  textMuted: '#9AA0A8',
  border: '#E5E0D8',
  borderMid: '#ECEAE5',
  bg: '#ffffff',
  bgLight: '#ECEAE5',
  card: '#F7F6F4',
};

function ChartTooltip({ active, payload, label, prefix = '' }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="text-xs px-3 py-2 rounded-lg shadow-lg" style={{ background: M.text, color: '#F7F6F4' }}>
        <div className="mb-0.5" style={{ color: M.textMuted }}>{label}</div>
        <div className="font-bold">{prefix}{payload[0].value}</div>
      </div>
    );
  }
  return null;
}

export function WebProductDetail() {
  const navigate = useNavigate();
  const { productId } = useParams();
  const { products } = useAppData();
  const [quantity, setQuantity] = useState(50);
  const [turnoverDays, setTurnoverDays] = useState(7);
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const alert = mockAlerts.find(a => a.id === productId);
  const product = products.find(p => p.id === productId);

  const displayName = alert?.productName || product?.name || 'Nestle Milk Powder (900g)';
  const displayLocation = alert?.location || "People's Square Flagship Store";
  const displayStock = alert?.currentStock ?? product?.currentStock ?? 15;
  const displaySafety = alert?.safetyStock ?? product?.safetyStock ?? 50;
  const displaySku = alert?.sku || product?.sku || 'NESTLE-MK-900';
  const isLow = displayStock < displaySafety;

  const priceHistory = product?.priceHistory ?? mockProducts[0]?.priceHistory ?? [];
  const minPrice = priceHistory.length ? Math.min(...priceHistory.map(h => h.price)) : 0;
  const maxPrice = priceHistory.length ? Math.max(...priceHistory.map(h => h.price)) : 0;
  const currentPrice = product?.price ?? 298;
  const firstPrice = priceHistory.length ? priceHistory[0].price : currentPrice;
  const priceChange = currentPrice - firstPrice;
  const priceChangePct = firstPrice > 0 ? ((priceChange / firstPrice) * 100).toFixed(1) : '0.0';
  const priceUp = priceChange >= 0;
  const pYMin = Math.floor(minPrice * 0.97);
  const pYMax = Math.ceil(maxPrice * 1.03);
  const avgPrice = priceHistory.length
    ? (priceHistory.reduce((s, h) => s + h.price, 0) / priceHistory.length).toFixed(1)
    : currentPrice;

  const estimatedStockout = alert?.dailySales && alert.dailySales > 0
    ? Math.ceil(displayStock / alert.dailySales)
    : 3;

  const totalCost = quantity * 298;

  const stockPct = Math.min((displayStock / displaySafety) * 100, 100);
  const stockColor = displayStock === 0 ? M.danger
    : displayStock < displaySafety ? M.warning : M.successDk;

  const handleSubmit = () => {
    setSubmitted(true);
    toast.success('Transfer Request Submitted', {
      description: `${displayName} × ${quantity} units · Approx. 2 hours approval`,
    });
  };

  return (
    <WebLayout>
      <div className="p-6" style={{ background: M.bg, minHeight: '100vh' }}>

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm mb-6" style={{ color: M.textMuted }}>
          <button onClick={() => navigate('/web')} className="hover:underline" style={{ color: M.textSub }}>Dashboard</button>
          <span>/</span>
          <button onClick={() => navigate('/web/store/1')} className="hover:underline" style={{ color: M.textSub }}>{displayLocation}</button>
          <span>/</span>
          <span style={{ color: M.text, fontWeight: 600 }}>{displayName}</span>
        </div>

        {/* Handoff Banner */}
        <div className="rounded-xl p-4 mb-6 flex items-center justify-between"
          style={{ background: '#E8F0F5', border: `1.5px solid #CCDBE5` }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ background: '#CCDBE5' }}>
              <span style={{ color: M.primary, fontSize: '1.2rem' }}>⇄</span>
            </div>
            <div>
              <div className="font-bold" style={{ color: M.text }}>Handoff Task</div>
              <div className="text-sm" style={{ color: M.textSub }}>From mobile store manager · 2026-04-16 09:35</div>
            </div>
          </div>
          <span className="text-sm px-3 py-1 rounded-full font-medium text-white" style={{ background: M.primary }}>Decision Panel</span>
        </div>

        {/* Product Header */}
        <div className="rounded-xl p-6 mb-6" style={{ background: M.card, border: `1.5px solid ${M.border}` }}>
          <div className="flex items-start gap-6">
            <div className="w-20 h-20 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: M.bg, border: `1.5px solid ${M.border}` }}>
              <Package className="w-10 h-10" style={{ color: M.textMuted }} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold" style={{ color: M.text }}>{displayName}</h1>
                {isLow && (
                  <span className="text-sm px-3 py-1 rounded-full font-bold flex items-center gap-1 text-white"
                    style={{ background: M.danger }}>
                    <AlertTriangle className="w-4 h-4" />
                    {displayStock === 0 ? 'Out of Stock' : 'Low Stock'}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 mb-3" style={{ color: M.textMuted }}>
                <MapPin className="w-4 h-4" />
                <span>{displayLocation}</span>
                <span style={{ color: M.borderMid }}>|</span>
                <span className="text-sm">SKU: {displaySku}</span>
              </div>
              <div className="flex gap-8">
                {[
                  { label: 'Current Stock', value: displayStock, unit: 'units', color: stockColor },
                  { label: 'Safety Level', value: displaySafety, unit: 'units', color: M.text },
                  { label: 'Daily Sales', value: alert?.dailySales || 12, unit: 'units', color: M.text },
                  {
                    label: 'Est. Stockout', value: estimatedStockout, unit: 'days',
                    color: estimatedStockout <= 2 ? M.danger : M.warning
                  },
                ].map(({ label, value, unit, color }) => (
                  <div key={label}>
                    <div className="text-sm" style={{ color: M.textMuted }}>{label}</div>
                    <div className="text-3xl font-bold" style={{ color }}>
                      {value}<span className="text-base ml-1" style={{ color: M.textMuted }}>{unit}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Stock Health Circle */}
            <div className="flex-shrink-0 w-32">
              <div className="text-sm mb-2 text-center" style={{ color: M.textMuted }}>Stock Health</div>
              <div className="relative w-24 h-24 mx-auto">
                <svg viewBox="0 0 36 36" className="w-24 h-24 -rotate-90">
                  <circle cx="18" cy="18" r="15.9" fill="none" stroke={M.borderMid} strokeWidth="3" />
                  <circle cx="18" cy="18" r="15.9" fill="none"
                    stroke={stockColor} strokeWidth="3"
                    strokeDasharray={`${stockPct} 100`} strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-bold" style={{ color: M.text }}>{Math.round(stockPct)}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-2 gap-6">

          {/* LEFT: Charts */}
          <div className="space-y-5">

            {/* Sales Trend */}
            <div className="rounded-xl p-5" style={{ background: M.card, border: `1.5px solid ${M.border}` }}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" style={{ color: M.primary }} />
                  <h3 className="font-bold" style={{ color: M.text }}>Sales Trend</h3>
                </div>
                <div className="flex items-center gap-1 text-sm" style={{ color: M.successDk }}>
                  <ArrowUpRight className="w-4 h-4" />
                  +{alert?.trend || 150}% vs last period
                </div>
              </div>
              <p className="text-xs mb-3" style={{ color: M.textMuted }}>Daily sales past 7 days</p>

              <ResponsiveContainer width="100%" height={180}>
                <AreaChart data={salesTrendData} margin={{ top: 4, right: 8, bottom: 0, left: -8 }}>
                  <defs>
                    <linearGradient id="salesAreaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={M.primary} stopOpacity={0.18} />
                      <stop offset="95%" stopColor={M.primary} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={M.bgLight} />
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: M.textMuted }} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: M.textMuted }} tickLine={false} axisLine={false} />
                  <Tooltip content={<ChartTooltip />} />
                  <ReferenceLine y={displaySafety} stroke={M.danger} strokeDasharray="4 4"
                    label={{ value: 'Safety Level', position: 'right', fontSize: 10, fill: M.danger }} />
                  <Area type="monotone" dataKey="value" stroke={M.primary} strokeWidth={2.5}
                    fill="url(#salesAreaGrad)" dot={{ r: 4, fill: M.primary }} name="Daily Sales" />
                  <Line type="monotone" dataKey="lastWeek" stroke={M.borderMid} strokeWidth={1.5}
                    strokeDasharray="3 3" dot={false} name="Last Week" />
                </AreaChart>
              </ResponsiveContainer>

              <div className="mt-2 flex items-center justify-between text-xs" style={{ color: M.textMuted }}>
                <span>Based on past 30 days sales data</span>
                <button className="hover:underline" style={{ color: M.primary }}>View full data →</button>
              </div>
            </div>

            {/* Price Trend */}
            <div className="rounded-xl p-5" style={{ background: M.card, border: `1.5px solid ${M.border}` }}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Tag className="w-5 h-5" style={{ color: M.textMuted }} />
                  <h3 className="font-bold" style={{ color: M.text }}>Price Trend</h3>
                </div>
                <div className="flex items-center gap-1 text-sm font-bold"
                  style={{ color: priceUp ? M.danger : M.successDk }}>
                  {priceUp ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  {priceUp ? '+' : ''}{priceChangePct}% past 30 days
                </div>
              </div>

              <div className="flex gap-5 mb-3 text-xs">
                <div><span style={{ color: M.textMuted }}>Current </span><span className="font-bold" style={{ color: M.text }}>¥{currentPrice}</span></div>
                <div><span style={{ color: M.textMuted }}>30D Low </span><span className="font-bold" style={{ color: M.successDk }}>¥{minPrice}</span></div>
                <div><span style={{ color: M.textMuted }}>30D High </span><span className="font-bold" style={{ color: M.danger }}>¥{maxPrice}</span></div>
                <div><span style={{ color: M.textMuted }}>Avg </span><span className="font-bold" style={{ color: M.textSub }}>¥{avgPrice}</span></div>
              </div>

              <ResponsiveContainer width="100%" height={160}>
                <LineChart data={priceHistory} margin={{ top: 4, right: 12, bottom: 0, left: -4 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={M.bgLight} />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: M.textMuted }} tickLine={false} axisLine={{ stroke: M.border }} />
                  <YAxis domain={[pYMin, pYMax]} tick={{ fontSize: 10, fill: M.textMuted }} tickLine={false} axisLine={false}
                    tickFormatter={v => `¥${v}`} width={44} />
                  <Tooltip content={<ChartTooltip prefix="¥" />} />
                  <ReferenceLine y={currentPrice} stroke={M.warning} strokeDasharray="4 2" strokeWidth={1.5}
                    label={{ value: 'Current', fill: M.warning, fontSize: 10, position: 'right' }} />
                  <Line type="monotone" dataKey="price" stroke={M.warning} strokeWidth={2.5}
                    dot={{ r: 3.5, fill: M.warning, strokeWidth: 2, stroke: '#fff' }}
                    activeDot={{ r: 6, stroke: M.warning, strokeWidth: 2, fill: '#fff' }}
                    name="Price" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* RIGHT: Dispatch Panel */}
          <div className="rounded-xl p-6" style={{ background: M.card, border: `1.5px solid ${M.border}` }}>
            <h3 className="font-bold mb-6" style={{ color: M.text }}>Transfer Parameters</h3>

            {/* Quantity Slider */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <div>
                  <div className="text-sm" style={{ color: M.textMuted }}>Restock Quantity</div>
                  <div className="text-xs" style={{ color: M.textMuted }}>Recommended: {displaySafety * 2 - displayStock} units</div>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold" style={{ color: M.text }}>{quantity}</span>
                  <span className="ml-1" style={{ color: M.textMuted }}>units</span>
                </div>
              </div>
              <input
                type="range" min="0" max="200" value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                style={{ background: `linear-gradient(to right, ${M.primary} ${quantity / 2}%, ${M.borderMid} ${quantity / 2}%)` }}
              />
              <div className="flex justify-between text-xs mt-1" style={{ color: M.textMuted }}>
                <span>0</span><span>100</span><span>200</span>
              </div>
            </div>

            {/* Turnover Days Slider */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <div>
                  <div className="text-sm" style={{ color: M.textMuted }}>Turnover Days</div>
                  <div className="text-xs" style={{ color: M.textMuted }}>Current stockout in: {estimatedStockout} days</div>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold" style={{ color: M.text }}>{turnoverDays}</span>
                  <span className="ml-1" style={{ color: M.textMuted }}>days</span>
                </div>
              </div>
              <input
                type="range" min="1" max="30" value={turnoverDays}
                onChange={(e) => setTurnoverDays(parseInt(e.target.value))}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                style={{ background: `linear-gradient(to right, ${M.primary} ${(turnoverDays / 30) * 100}%, ${M.borderMid} ${(turnoverDays / 30) * 100}%)` }}
              />
              <div className="flex justify-between text-xs mt-1" style={{ color: M.textMuted }}>
                <span>1d</span><span>15d</span><span>30d</span>
              </div>
            </div>

            {/* Cost Estimate */}
            <div className="rounded-xl p-4 mb-6" style={{ background: M.bg, border: `1.5px solid ${M.border}` }}>
              <div className="font-bold mb-2 text-sm" style={{ color: M.textSub }}>Estimated Cost</div>
              <div className="flex justify-between items-center">
                <div className="text-sm" style={{ color: M.textMuted }}>{quantity} units × ¥298/unit</div>
                <div className="text-xl font-bold" style={{ color: M.text }}>¥{totalCost.toLocaleString()}</div>
              </div>
              <div className="mt-2 text-xs" style={{ color: M.textMuted }}>Est. arrival: within {turnoverDays} days</div>
            </div>

            {/* System Recommendation */}
            <div className="rounded-xl p-4 mb-6" style={{ background: '#E5EEEC', border: `1.5px solid #C8DDD9` }}>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold text-white"
                  style={{ background: M.successDk }}>AI</div>
                <div>
                  <div className="font-bold mb-1 text-sm" style={{ color: '#2C4030' }}>System Recommendation</div>
                  <p className="text-sm" style={{ color: '#3A5040' }}>
                    Based on current sales rate, recommend restocking <strong>{displaySafety * 2 - displayStock}</strong> units,
                    which can maintain stock for approximately <strong>14 days</strong>.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {!submitted ? (
              <div className="space-y-3">
                <button
                  onClick={() => setShowApprovalDialog(true)}
                  className="w-full py-4 font-bold rounded-xl flex items-center justify-center gap-2 text-white transition-opacity hover:opacity-90"
                  style={{ background: M.text }}
                >
                  <CheckCircle className="w-5 h-5" />
                  Submit Transfer Request
                </button>
                <button
                  onClick={handleSubmit}
                  className="w-full py-3 font-bold rounded-xl text-sm transition-colors hover:opacity-80"
                  style={{ border: `1.5px solid ${M.border}`, color: M.textSub, background: M.card }}
                >
                  Quick Submit (Skip Approval)
                </button>
              </div>
            ) : (
              <div className="rounded-xl p-4 text-center" style={{ background: '#E5EEEC', border: `1.5px solid #C8DDD9` }}>
                <CheckCircle className="w-8 h-8 mx-auto mb-2" style={{ color: M.successDk }} />
                <div className="font-bold" style={{ color: '#2C4030' }}>Transfer Request Submitted</div>
                <div className="text-sm mt-1" style={{ color: '#6A9A7A' }}>Pending approval...</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {showApprovalDialog && (
        <DispatchApprovalDialog
          request={{
            id: `DISP-${Date.now()}`,
            productName: displayName,
            fromStore: 'Central Warehouse',
            toStore: displayLocation,
            quantity,
            urgency: isLow ? 'high' : 'medium',
            reason: `Low stock: current ${displayStock} units below safety level of ${displaySafety} units`,
            requestedBy: 'Wang Jianguo (Regional Manager)',
            requestedAt: '2026-04-16 ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          }}
          onApprove={() => {
            setShowApprovalDialog(false);
            setSubmitted(true);
            toast.success('Transfer approved and submitted!');
          }}
          onReject={() => setShowApprovalDialog(false)}
          onClose={() => setShowApprovalDialog(false)}
        />
      )}
    </WebLayout>
  );
}