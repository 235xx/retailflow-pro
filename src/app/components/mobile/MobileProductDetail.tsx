import { useParams, useNavigate } from 'react-router';
import {
  AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts';
import {
  ArrowLeft, Package, TrendingUp, TrendingDown,
  AlertTriangle, BarChart2, Tag, Zap, ShoppingCart,
} from 'lucide-react';
import { mockProducts } from '../../data/mockData';
import { MobileLayout } from './MobileLayout';
import { ModeSwitcher } from './ModeSwitcher';
import { useMode } from '../../context/ModeContext';
import { F } from '../../colors';

// ── Morandi status palette ────────────────────────────────
const STATUS = {
  normal: { label: 'Normal', badgeBg: '#E5EEEC', badgeText: '#6A9A7A', badgeBorder: '#C8DDD9', barColor: '#8AB5AF', lineColor: '#8AB5AF', heroBg: '#6A9A7A', heroAccent: '#8AB5AF', heroStart: '#38504A' },
  low: { label: 'Low Stock', badgeBg: '#F5EDE0', badgeText: '#A87A45', badgeBorder: '#DECA9A', barColor: '#C4A97A', lineColor: '#C4A97A', heroBg: '#9A7848', heroAccent: '#C4A97A', heroStart: '#4A3A28' },
  out: { label: 'Out of Stock', badgeBg: '#EFE5E5', badgeText: '#BF8888', badgeBorder: '#D4AAAA', barColor: '#BF8888', lineColor: '#BF8888', heroBg: '#8A5858', heroAccent: '#BF8888', heroStart: '#402A2A' },
  overstock: { label: 'Overstock', badgeBg: '#E8F0F5', badgeText: '#8B9EAD', badgeBorder: '#CCDBE5', barColor: '#8B9EAD', lineColor: '#8B9EAD', heroBg: '#5A7888', heroAccent: '#9AB3C4', heroStart: '#2C3E50' },
};

function ChartTooltip({ active, payload, label, prefix = '' }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="text-xs px-3 py-2 rounded-lg shadow-xl" style={{ background: '#2C3540', color: '#F7F6F4' }}>
        <div className="mb-0.5" style={{ color: '#9AA0A8' }}>{label}</div>
        <div className="font-bold">{prefix}{payload[0].value}</div>
      </div>
    );
  }
  return null;
}

export function MobileProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isField } = useMode();

  const product = mockProducts.find(p => p.id === id);

  if (!product) {
    return (
      <MobileLayout>
        <div className="flex flex-col items-center justify-center min-h-screen gap-4"
          style={{ background: isField ? F.bg : '#F7F6F4' }}>
          <Package className="w-12 h-12" style={{ color: isField ? F.textSoft : '#9AA0A8' }} />
          <p style={{ color: isField ? F.textMid : '#9AA0A8' }}>Product not found</p>
          <button onClick={() => navigate(-1)} className="text-sm underline" style={{ color: isField ? F.accent : '#8B9EAD' }}>Back</button>
        </div>
      </MobileLayout>
    );
  }

  const sc = STATUS[product.status];
  const pct = product.safetyStock > 0 ? (product.currentStock / product.safetyStock) * 100 : 100;
  const priceHistory = product.priceHistory ?? [];
  const minPrice = priceHistory.length ? Math.min(...priceHistory.map(h => h.price)) : product.price;
  const maxPrice = priceHistory.length ? Math.max(...priceHistory.map(h => h.price)) : product.price;
  const firstPrice = priceHistory.length ? priceHistory[0].price : product.price;
  const priceChange = product.price - firstPrice;
  const priceChangePct = firstPrice > 0 ? ((priceChange / firstPrice) * 100).toFixed(1) : '0.0';
  const priceUp = priceChange >= 0;
  const pYMin = Math.floor(minPrice * 0.97);
  const pYMax = Math.ceil(maxPrice * 1.03);
  const salesHistory = product.salesHistory ?? [];
  const salesMax = salesHistory.length ? Math.max(...salesHistory.map(s => s.sales)) : 0;
  const salesAvg = salesHistory.length ? (salesHistory.reduce((a, s) => a + s.sales, 0) / salesHistory.length).toFixed(1) : '0';
  const daily24h = product.dailySales24h ?? 0;

  // ── Field Mode ──────────────────────────────────────────────────
  if (isField) {
    const stockBorderColor = product.status === 'out' ? F.alertHighBorder
      : product.status === 'low' ? F.alertMedBorder : F.border;
    const stockTextColor = product.status === 'out' ? F.alertHighBorder
      : product.status === 'low' ? F.alertMedBorder : F.text;

    return (
      <MobileLayout>
        <div className="min-h-screen" style={{ background: F.bg }}>
          {/* Header */}
          <div className="p-4 flex items-center gap-3" style={{ background: F.header, borderBottom: `1.5px solid ${F.border}` }}>
            <button onClick={() => navigate(-1)} style={{ color: F.accent }}>
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div className="flex-1 min-w-0">
              <div className="text-xs flex items-center gap-1 mb-0.5" style={{ color: F.accent }}>
                <Zap className="w-3 h-3" /> Field Mode
              </div>
              <h1 className="font-bold truncate" style={{ color: F.text }}>{product.name}</h1>
            </div>
            <span
              className="text-xs px-2 py-1 rounded-full font-bold"
              style={{ background: sc.badgeBg, color: sc.badgeText, border: `1px solid ${sc.badgeBorder}` }}
            >{sc.label}</span>
          </div>

          {/* KPI Row */}
          <div className="grid grid-cols-3 gap-3 p-4">
            <div className="rounded-xl p-3" style={{ background: F.surface, border: `2px solid ${stockBorderColor}` }}>
              <div className="text-xs mb-1" style={{ color: F.textSoft }}>Current Stock</div>
              <div className="text-2xl font-black" style={{ color: stockTextColor }}>{product.currentStock}</div>
              <div className="text-xs" style={{ color: F.textSoft }}>/ {product.safetyStock} units</div>
            </div>
            <div className="rounded-xl p-3" style={{ background: F.surface, border: `2px solid ${F.primaryLight ?? '#9AB3C4'}` }}>
              <div className="text-xs mb-1" style={{ color: F.textSoft }}>24h Sales</div>
              <div className="text-2xl font-black" style={{ color: '#9AB3C4' }}>{daily24h}</div>
              <div className="text-xs" style={{ color: F.textSoft }}>units / day</div>
            </div>
            <div className="rounded-xl p-3" style={{ background: F.surface, border: `2px solid ${F.accentBorder}` }}>
              <div className="text-xs mb-1" style={{ color: F.textSoft }}>Current Price</div>
              <div className="text-2xl font-black" style={{ color: F.accent }}>¥{product.price}</div>
              <div className="text-xs font-bold" style={{ color: priceUp ? F.alertHighBorder : F.successBorder }}>
                {priceUp ? '+' : ''}{priceChangePct}%
              </div>
            </div>
          </div>

          <div className="px-4 pb-4 space-y-4">
            {/* Sales Trend */}
            <div className="rounded-xl p-4" style={{ background: F.surface }}>
              <div className="flex items-center gap-2 mb-3">
                <ShoppingCart className="w-4 h-4" style={{ color: '#9AB3C4' }} />
                <span className="font-bold text-sm" style={{ color: F.text }}>Sales Trend (Last 7 days)</span>
              </div>
              <ResponsiveContainer width="100%" height={140}>
                <AreaChart data={salesHistory} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                  <defs>
                    <linearGradient id="salesGradField" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#9AB3C4" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#9AB3C4" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={F.borderLight} />
                  <XAxis dataKey="date" tick={{ fill: F.textSoft, fontSize: 10 }} tickLine={false} />
                  <YAxis tick={{ fill: F.textSoft, fontSize: 10 }} tickLine={false} axisLine={false} />
                  <Tooltip content={<ChartTooltip />} />
                  <Area type="monotone" dataKey="sales" stroke="#9AB3C4" strokeWidth={2.5} fill="url(#salesGradField)" dot={{ r: 3, fill: '#9AB3C4' }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Price Trend */}
            <div className="rounded-xl p-4" style={{ background: F.surface }}>
              <div className="flex items-center gap-2 mb-3">
                <BarChart2 className="w-4 h-4" style={{ color: F.accent }} />
                <span className="font-bold text-sm" style={{ color: F.text }}>Price Trend (Last 30 days)</span>
              </div>
              <ResponsiveContainer width="100%" height={140}>
                <LineChart data={priceHistory} margin={{ top: 4, right: 4, bottom: 0, left: -16 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={F.borderLight} />
                  <XAxis dataKey="date" tick={{ fill: F.textSoft, fontSize: 10 }} tickLine={false} />
                  <YAxis domain={[pYMin, pYMax]} tick={{ fill: F.textSoft, fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={v => `¥${v}`} />
                  <Tooltip content={<ChartTooltip prefix="¥" />} />
                  <ReferenceLine y={product.price} stroke={F.accent} strokeDasharray="4 2" strokeWidth={1.5} />
                  <Line type="monotone" dataKey="price" stroke={sc.lineColor} strokeWidth={2.5} dot={{ r: 3, fill: sc.lineColor }} activeDot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
              <div className="flex justify-between text-xs mt-2">
                <span style={{ color: F.textSoft }}>Low <span className="font-bold" style={{ color: F.successBorder }}>¥{minPrice}</span></span>
                <span style={{ color: F.accent }}>— Current</span>
                <span style={{ color: F.textSoft }}>High <span className="font-bold" style={{ color: F.alertHighBorder }}>¥{maxPrice}</span></span>
              </div>
            </div>

            {/* Info */}
            <div className="rounded-xl p-4" style={{ background: F.surface }}>
              <div className="text-xs mb-3" style={{ color: F.textSoft }}>Product Info</div>
              {[
                { label: 'SKU', value: product.sku },
                { label: 'Category', value: product.category },
                { label: 'Safety Level', value: `${product.safetyStock} units` },
              ].map(row => (
                <div key={row.label} className="flex justify-between py-2" style={{ borderBottom: `1px solid ${F.border}` }}>
                  <span className="text-xs" style={{ color: F.textSoft }}>{row.label}</span>
                  <span className="text-xs font-bold" style={{ color: F.text }}>{row.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </MobileLayout>
    );
  }

  // ── Standard Mode ──────────────────────────────────────────────
  const stockColor = product.status === 'out' ? '#BF8888'
    : product.status === 'low' ? '#C4A97A' : '#2C3540';

  return (
    <MobileLayout>
      <div className="min-h-screen" style={{ background: '#F7F6F4' }}>

        {/* Hero Header */}
        <div style={{ background: `linear-gradient(155deg, ${sc.heroStart} 0%, ${sc.heroBg} 100%)`, paddingBottom: '24px', paddingTop: '16px', paddingLeft: '16px', paddingRight: '16px' }}>
          {/* Nav */}
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => navigate(-1)}
              className="w-8 h-8 flex items-center justify-center rounded-full"
              style={{ background: 'rgba(255,255,255,0.2)' }}
            >
              <ArrowLeft className="w-4 h-4 text-white" />
            </button>
            <h1 className="flex-1 text-white font-bold truncate">Product Detail</h1>
            <span
              className="text-xs px-2.5 py-1 rounded-full font-bold"
              style={{ background: 'rgba(255,255,255,0.22)', color: 'white', border: '1px solid rgba(255,255,255,0.35)' }}
            >{sc.label}</span>
          </div>

          {/* Product name */}
          <div className="mb-4">
            <p className="text-xs mb-1" style={{ color: 'rgba(255,255,255,0.65)' }}>{product.sku} · {product.category}</p>
            <p className="text-white font-black" style={{ fontSize: '1.15rem' }}>{product.name}</p>
          </div>

          {/* 3 KPI cards */}
          <div className="grid grid-cols-3 gap-2.5">
            <div className="rounded-2xl p-3" style={{ background: 'rgba(255,255,255,0.18)' }}>
              <div className="flex items-center gap-1 mb-1">
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: sc.barColor }} />
                <span className="text-xs" style={{ color: 'rgba(255,255,255,0.7)' }}>Current Stock</span>
              </div>
              <div className="text-white text-2xl font-black leading-none">{product.currentStock}</div>
              <div className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.6)' }}>/ {product.safetyStock} safety level</div>
              <div className="mt-2 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.2)' }}>
                <div className="h-full rounded-full" style={{ width: `${Math.min(pct, 100)}%`, background: 'rgba(255,255,255,0.85)' }} />
              </div>
            </div>
            <div className="rounded-2xl p-3" style={{ background: 'rgba(255,255,255,0.18)' }}>
              <div className="flex items-center gap-1 mb-1">
                <ShoppingCart className="w-3 h-3" style={{ color: 'rgba(255,255,255,0.7)' }} />
                <span className="text-xs" style={{ color: 'rgba(255,255,255,0.7)' }}>24h Sales</span>
              </div>
              <div className="text-white text-2xl font-black leading-none">{daily24h}</div>
              <div className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.6)' }}>units</div>
              <div className="text-xs mt-1.5" style={{ color: 'rgba(255,255,255,0.7)' }}>Avg {salesAvg} units/day</div>
            </div>
            <div className="rounded-2xl p-3" style={{ background: 'rgba(255,255,255,0.18)' }}>
              <div className="flex items-center gap-1 mb-1">
                <Tag className="w-3 h-3" style={{ color: 'rgba(255,255,255,0.7)' }} />
                <span className="text-xs" style={{ color: 'rgba(255,255,255,0.7)' }}>Current Price</span>
              </div>
              <div className="text-white text-2xl font-black leading-none">¥{product.price}</div>
              <div className="text-xs mt-1 font-bold flex items-center gap-0.5" style={{ color: priceUp ? '#FFBBBB' : '#BBFFEE' }}>
                {priceUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {priceUp ? '+' : ''}{priceChangePct}%
              </div>
              <div className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.6)' }}>vs 30 days ago</div>
            </div>
          </div>
        </div>

        <ModeSwitcher />

        {/* Scrollable content */}
        <div className="px-4 pt-4 pb-6 space-y-4">

          {/* Alert banner */}
          {product.status !== 'normal' && (
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl"
              style={{ background: sc.badgeBg, border: `1.5px solid ${sc.badgeBorder}`, color: sc.badgeText }}>
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span className="text-xs font-bold">
                {product.status === 'out' && 'This item is out of stock, please restock immediately'}
                {product.status === 'low' && `Only ${product.currentStock} units left, below safety level of ${product.safetyStock}`}
                {product.status === 'overstock' && `Overstocked, exceeds safety level by ${((product.currentStock / product.safetyStock - 1) * 100).toFixed(0)}%`}
              </span>
            </div>
          )}

          {/* Sales Trend Card */}
          <div className="rounded-2xl p-4" style={{ background: '#ffffff', border: '1.5px solid #E5E0D8' }}>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1.5">
                <ShoppingCart className="w-4 h-4" style={{ color: '#8B9EAD' }} />
                <span className="font-bold" style={{ color: '#2C3540' }}>Sales Trend</span>
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: '#F7F6F4', color: '#9AA0A8' }}>Last 7 days</span>
            </div>
            <div className="flex gap-4 mb-3 mt-2">
              <div>
                <div className="text-xs" style={{ color: '#9AA0A8' }}>7-day High</div>
                <div className="font-bold" style={{ color: '#2C3540' }}>{salesMax} units</div>
              </div>
              <div className="w-px" style={{ background: '#ECEAE5' }} />
              <div>
                <div className="text-xs" style={{ color: '#9AA0A8' }}>7-day Avg</div>
                <div className="font-bold" style={{ color: '#2C3540' }}>{salesAvg} units</div>
              </div>
              <div className="w-px" style={{ background: '#ECEAE5' }} />
              <div>
                <div className="text-xs" style={{ color: '#9AA0A8' }}>Yesterday</div>
                <div className="font-bold" style={{ color: '#2C3540' }}>
                  {salesHistory.length >= 2 ? salesHistory[salesHistory.length - 2].sales : '--'} units
                </div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={160}>
              <AreaChart data={salesHistory} margin={{ top: 4, right: 8, bottom: 0, left: -8 }}>
                <defs>
                  <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B9EAD" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#8B9EAD" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0EDE8" />
                <XAxis dataKey="date" tick={{ fill: '#9AA0A8', fontSize: 10 }} tickLine={false} axisLine={{ stroke: '#E5E0D8' }} />
                <YAxis tick={{ fill: '#9AA0A8', fontSize: 10 }} tickLine={false} axisLine={false} width={28} />
                <Tooltip content={<ChartTooltip />} />
                <Area type="monotone" dataKey="sales" stroke="#8B9EAD" strokeWidth={2.5} fill="url(#salesGrad)"
                  dot={{ r: 4, fill: '#8B9EAD', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 6, stroke: '#8B9EAD', strokeWidth: 2, fill: '#fff' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Price Trend Card */}
          <div className="rounded-2xl p-4" style={{ background: '#ffffff', border: '1.5px solid #E5E0D8' }}>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1.5">
                <BarChart2 className="w-4 h-4" style={{ color: '#9AA0A8' }} />
                <span className="font-bold" style={{ color: '#2C3540' }}>Price Trend</span>
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: '#F7F6F4', color: '#9AA0A8' }}>Last 30 days</span>
            </div>
            <div className="flex gap-4 mb-3 mt-2 text-xs">
              <div><span style={{ color: '#9AA0A8' }}>Current </span><span className="font-bold" style={{ color: '#2C3540' }}>¥{product.price}</span></div>
              <div><span style={{ color: '#9AA0A8' }}>Low </span><span className="font-bold" style={{ color: '#6A9A7A' }}>¥{minPrice}</span></div>
              <div><span style={{ color: '#9AA0A8' }}>High </span><span className="font-bold" style={{ color: '#BF8888' }}>¥{maxPrice}</span></div>
            </div>
            <ResponsiveContainer width="100%" height={160}>
              <LineChart data={priceHistory} margin={{ top: 4, right: 12, bottom: 0, left: -8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0EDE8" />
                <XAxis dataKey="date" tick={{ fill: '#9AA0A8', fontSize: 10 }} tickLine={false} axisLine={{ stroke: '#E5E0D8' }} />
                <YAxis domain={[pYMin, pYMax]} tick={{ fill: '#9AA0A8', fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={v => `¥${v}`} width={40} />
                <Tooltip content={<ChartTooltip prefix="¥" />} />
                <ReferenceLine y={product.price} stroke={sc.lineColor} strokeDasharray="4 2" strokeWidth={1.5}
                  label={{ value: 'Current', fill: sc.lineColor, fontSize: 10, position: 'right' }} />
                <Line type="monotone" dataKey="price" stroke={sc.lineColor} strokeWidth={2.5}
                  dot={{ r: 3.5, fill: sc.lineColor, strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 6, stroke: sc.lineColor, strokeWidth: 2, fill: '#fff' }} />
              </LineChart>
            </ResponsiveContainer>
            <div className="flex items-center gap-4 mt-3 pt-3" style={{ borderTop: '1px solid #ECEAE5' }}>
              <div className="flex items-center gap-1.5 text-xs" style={{ color: '#9AA0A8' }}>
                <div className="w-5 h-0.5 rounded" style={{ background: sc.lineColor }} />
                Price Curve
              </div>
              <div className="flex items-center gap-1.5 text-xs" style={{ color: '#9AA0A8' }}>
                <div className="w-4 border-t-2 border-dashed" style={{ borderColor: sc.lineColor }} />
                Current Price
              </div>
              <div className="ml-auto text-xs font-bold flex items-center gap-0.5" style={{ color: priceUp ? '#BF8888' : '#6A9A7A' }}>
                {priceUp ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                {priceUp ? '+' : ''}{priceChange.toFixed(2)} ({priceUp ? '+' : ''}{priceChangePct}%)
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="rounded-2xl p-4" style={{ background: '#ffffff', border: '1.5px solid #E5E0D8' }}>
            <div className="font-bold mb-3" style={{ color: '#2C3540' }}>Product Info</div>
            {[
              { label: 'SKU', value: product.sku },
              { label: 'Category', value: product.category },
              { label: 'Store', value: `Store #${product.storeId}` },
              { label: 'Safety Level', value: `${product.safetyStock} units` },
              { label: 'Stock Rate', value: `${pct.toFixed(0)}%` },
            ].map((row, i, arr) => (
              <div key={row.label} className="flex justify-between py-2.5"
                style={{ borderBottom: i < arr.length - 1 ? '1px solid #F0EDE8' : 'none' }}>
                <span className="text-xs" style={{ color: '#9AA0A8' }}>{row.label}</span>
                <span className="text-xs font-bold" style={{ color: '#2C3540' }}>{row.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}