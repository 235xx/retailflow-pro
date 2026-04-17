import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { Search, Package, TrendingDown, AlertTriangle, ChevronRight, Zap, Filter } from 'lucide-react';
import { MobileLayout } from './MobileLayout';
import { ModeSwitcher } from './ModeSwitcher';
import { useMode } from '../../context/ModeContext';
import { useAppData } from '../../context/AppDataContext';
import { F } from '../../colors';

const statusConfig = {
  normal: { label: 'Normal', bg: '#E5EEEC', text: '#6A9A7A', border: '#C8DDD9' },
  low: { label: 'Low Stock', bg: '#F5EDE0', text: '#A87A45', border: '#DECA9A' },
  out: { label: 'Out of Stock', bg: '#EFE5E5', text: '#BF8888', border: '#D4AAAA' },
  overstock: { label: 'Overstock', bg: '#E8F0F5', text: '#8B9EAD', border: '#CCDBE5' },
};

const barColors: Record<string, string> = {
  normal: '#8AB5AF',
  low: '#C4A97A',
  out: '#BF8888',
  overstock: '#8B9EAD',
};

export function MobileInventory() {
  const navigate = useNavigate();
  const { isField } = useMode();
  const { products } = useAppData();
  const [searchText, setSearchText] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState<'all' | 'low' | 'out' | 'overstock' | 'normal' | 'anomalous'>('all');

  const categories = useMemo(() => ['All', ...Array.from(new Set(products.map(p => p.category)))], [products]);

  const filteredProducts = useMemo(() => products.filter(product => {
    if (categoryFilter !== 'All' && product.category !== categoryFilter) return false;
    if (statusFilter === 'anomalous' && product.status === 'normal') return false;
    if (statusFilter !== 'all' && statusFilter !== 'anomalous' && product.status !== statusFilter) return false;
    if (searchText && !product.name.includes(searchText) && !product.sku.includes(searchText)) return false;
    return true;
  }), [products, categoryFilter, statusFilter, searchText]);

  const alertCount = useMemo(() => products.filter(p => p.status !== 'normal').length, [products]);

  const summaryCards = useMemo(() => [
    { label: 'Total', count: products.length, key: 'all' as const, activeColor: '#8B9EAD', inactiveBg: '#E8F0F5', inactiveText: '#8B9EAD', inactiveBorder: '#CCDBE5' },
    { label: 'Low Stock', count: products.filter(p => p.status === 'low').length, key: 'low' as const, activeColor: '#C4A97A', inactiveBg: '#F5EDE0', inactiveText: '#A87A45', inactiveBorder: '#DECA9A' },
    { label: 'Out of Stock', count: products.filter(p => p.status === 'out').length, key: 'out' as const, activeColor: '#BF8888', inactiveBg: '#EFE5E5', inactiveText: '#BF8888', inactiveBorder: '#D4AAAA' },
    { label: 'Overstock', count: products.filter(p => p.status === 'overstock').length, key: 'overstock' as const, activeColor: '#8B9EAD', inactiveBg: '#E8F0F5', inactiveText: '#8B9EAD', inactiveBorder: '#CCDBE5' },
  ], [products]);

  // ── Field Mode ─────────────────────────────────────────────
  if (isField) {
    return (
      <MobileLayout>
        <div className="min-h-screen" style={{ background: F.bg }}>
          <div className="p-4 flex items-center justify-between" style={{ background: F.header, borderBottom: `1.5px solid ${F.border}` }}>
            <div>
              <div className="flex items-center gap-1 text-xs mb-0.5" style={{ color: F.accent }}>
                <Zap className="w-3 h-3" /> Field Mode
              </div>
              <h1 className="text-xl font-bold" style={{ color: F.text }}>Inventory</h1>
            </div>
            <ModeSwitcher compact />
          </div>

          <div className="p-4" style={{ background: F.surface, borderBottom: `1.5px solid ${F.border}` }}>
            <div className="grid grid-cols-3 gap-3">
              {([
                { label: 'All', key: 'all' as const },
                { label: 'Anomalous', key: 'anomalous' as const },
                { label: 'Out of Stock', key: 'out' as const },
              ] as { label: string; key: typeof statusFilter }[]).map(tab => (
                <button
                  key={tab.label}
                  onClick={() => setStatusFilter(statusFilter === tab.key ? 'all' : tab.key)}
                  className="py-3 rounded-lg font-bold text-sm"
                  style={{
                    background: statusFilter === tab.key ? F.accent : F.border,
                    color: statusFilter === tab.key ? F.accentText : F.textMid,
                  }}
                >
                  {tab.label}
                  {tab.key === 'anomalous' && <span className="ml-1" style={{ color: F.alertHighBorder }}>({alertCount})</span>}
                  {tab.key === 'out' && <span className="ml-1" style={{ color: F.alertHighBorder }}>({products.filter(p => p.status === 'out').length})</span>}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 space-y-4">
            {filteredProducts.map((product) => {
              const status = statusConfig[product.status];
              const pct = product.safetyStock > 0 ? (product.currentStock / product.safetyStock) * 100 : 100;
              return (
                <div
                  key={product.id}
                  onClick={() => navigate(`/mobile/inventory/product/${product.id}`)}
                  className="rounded-xl p-4 active:scale-95 transition-all cursor-pointer"
                  style={{
                    background: F.surface,
                    border: `2px solid ${barColors[product.status]}`,
                  }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="font-bold" style={{ color: F.text }}>{product.name}</div>
                      <div className="text-sm" style={{ color: F.textSoft }}>{product.sku}</div>
                    </div>
                    <span className="px-3 py-1 rounded-full text-sm font-bold" style={{ background: status.bg, color: status.text }}>
                      {status.label}
                    </span>
                  </div>

                  <div className="flex gap-6 mb-3">
                    <div>
                      <div className="text-xs" style={{ color: F.textSoft }}>Current Stock</div>
                      <div className="text-3xl font-bold" style={{ color: barColors[product.status] }}>{product.currentStock}</div>
                    </div>
                    <div>
                      <div className="text-xs" style={{ color: F.textSoft }}>Safety Level</div>
                      <div className="text-3xl font-bold" style={{ color: F.textMid }}>{product.safetyStock}</div>
                    </div>
                    <div>
                      <div className="text-xs" style={{ color: F.textSoft }}>Price</div>
                      <div className="text-2xl font-bold" style={{ color: F.accent }}>¥{product.price}</div>
                    </div>
                  </div>

                  <div className="h-3 rounded-full overflow-hidden" style={{ background: F.borderLight }}>
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${Math.min(pct, 100)}%`, background: barColors[product.status] }}
                    />
                  </div>
                </div>
              );
            })}

            {filteredProducts.length === 0 && (
              <div className="text-center py-12" style={{ color: F.textSoft }}>
                <Package className="w-12 h-12 mx-auto mb-4" style={{ color: F.border }} />
                <p>No products</p>
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
        {/* Header */}
        <div className="p-4" style={{ background: '#F7F6F4', borderBottom: '1.5px solid #E5E0D8' }}>
          <div className="flex items-center justify-between mb-3">
            <h1 className="font-bold" style={{ color: '#2C3540' }}>Inventory</h1>
            <button
              className="flex items-center gap-1 text-sm px-2 py-1 rounded"
              style={{ border: '1px solid #E5E0D8', color: '#9AA0A8' }}
            >
              <Filter className="w-4 h-4" />
              Filter
            </button>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#9AA0A8' }} />
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search product name or SKU..."
              className="w-full rounded-lg pl-9 pr-4 py-2 text-sm outline-none"
              style={{ border: '1.5px solid #E5E0D8', color: '#2C3540', background: '#ffffff' }}
            />
          </div>
        </div>

        <ModeSwitcher />

        <div className="p-4">
          {/* Summary Cards */}
          <div className="grid grid-cols-4 gap-2 mb-4">
            {summaryCards.map(card => {
              const isActive = statusFilter === card.key;
              return (
                <button
                  key={card.label}
                  onClick={() => setStatusFilter(isActive ? 'all' : card.key)}
                  className="rounded-xl p-2 text-center transition-all"
                  style={{
                    border: '1.5px solid',
                    borderColor: isActive ? card.activeColor : card.inactiveBorder,
                    background: isActive ? card.activeColor : card.inactiveBg,
                    color: isActive ? 'white' : card.inactiveText,
                    transform: isActive ? 'scale(1.05)' : 'scale(1)',
                  }}
                >
                  <div className="text-xl font-bold">{card.count}</div>
                  <div className="text-xs mt-0.5">{card.label}</div>
                </button>
              );
            })}
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className="flex-shrink-0 px-3 py-1.5 rounded-full text-sm transition-colors"
                style={{
                  border: '1.5px solid',
                  borderColor: categoryFilter === cat ? '#8B9EAD' : '#E5E0D8',
                  background: categoryFilter === cat ? '#8B9EAD' : '#ffffff',
                  color: categoryFilter === cat ? 'white' : '#6A7580',
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Product Cards */}
          <div className="space-y-3">
            {filteredProducts.map((product) => {
              const status = statusConfig[product.status];
              const pct = product.safetyStock > 0 ? (product.currentStock / product.safetyStock) * 100 : 100;
              return (
                <div
                  key={product.id}
                  onClick={() => navigate(`/mobile/inventory/product/${product.id}`)}
                  className="rounded-2xl p-4 cursor-pointer active:scale-[0.98] transition-transform"
                  style={{
                    background: '#ffffff',
                    border: `1.5px solid ${status.border}`,
                    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                  }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {(product.status === 'out' || product.status === 'low') && (
                          <AlertTriangle className="w-4 h-4 flex-shrink-0" style={{ color: '#BF8888' }} />
                        )}
                        <span className="font-bold text-sm truncate" style={{ color: '#2C3540' }}>{product.name}</span>
                      </div>
                      <div className="text-xs" style={{ color: '#9AA0A8' }}>{product.sku} · {product.category}</div>
                    </div>
                    <span
                      className="ml-2 text-xs px-2 py-0.5 rounded-full flex-shrink-0 font-medium"
                      style={{ background: status.bg, color: status.text, border: `1px solid ${status.border}` }}
                    >
                      {status.label}
                    </span>
                  </div>

                  <div className="mb-2">
                    <div className="flex justify-between text-xs mb-1" style={{ color: '#9AA0A8' }}>
                      <span>Stock: <span className="font-bold" style={{ color: status.text }}>{product.currentStock}</span></span>
                      <span>Safety Level: {product.safetyStock}</span>
                    </div>
                    <div className="h-2 rounded-full overflow-hidden" style={{ background: '#ECEAE5' }}>
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${Math.min(pct, 100)}%`, background: barColors[product.status] }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs" style={{ color: '#9AA0A8' }}>
                      <span>Price: <span className="font-bold" style={{ color: '#2C3540' }}>¥{product.price}</span></span>
                      {product.status !== 'normal' && (
                        <span className="flex items-center gap-0.5" style={{ color: '#BF8888' }}>
                          <TrendingDown className="w-3 h-3" />
                          Attention Needed
                        </span>
                      )}
                    </div>
                    <ChevronRight className="w-4 h-4" style={{ color: '#E5E0D8' }} />
                  </div>
                </div>
              );
            })}

            {filteredProducts.length === 0 && (
              <div className="text-center py-12" style={{ color: '#9AA0A8' }}>
                <Package className="w-10 h-10 mx-auto mb-3" style={{ color: '#E5E0D8' }} />
                <p className="text-sm">No matching products</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </MobileLayout>
  );
}