import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { Search, Package, AlertTriangle, ChevronRight, ArrowUpRight, BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { mockStores, inventoryDistribution } from '../../data/mockData';
import { WebLayout } from './WebLayout';
import { useAppData } from '../../context/AppDataContext';

const statusConfig = {
  normal: { label: 'Normal', bg: '#E5EEEC', text: '#6A9A7A', border: '#C8DDD9' },
  low: { label: 'Low', bg: '#F5EDE0', text: '#A87A45', border: '#DECA9A' },
  out: { label: 'Out', bg: '#EFE5E5', text: '#BF8888', border: '#D4AAAA' },
};

const barColors: Record<string, string> = {
  normal: '#8AB5AF',
  low: '#C4A97A',
  out: '#BF8888',
};

export function WebInventory() {
  const navigate = useNavigate();
  const { products } = useAppData();
  const [searchText, setSearchText] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedStore, setSelectedStore] = useState('All');

  const categories = useMemo(() => ['All', ...Array.from(new Set(products.map(p => p.category)))], [products]);

  const filteredProducts = useMemo(() => products.filter(p => {
    if (categoryFilter !== 'All' && p.category !== categoryFilter) return false;
    if (statusFilter !== 'All') {
      if (statusFilter === 'Low' && p.status !== 'low') return false;
      if (statusFilter === 'Out' && p.status !== 'out') return false;
      if (statusFilter === 'Normal' && p.status !== 'normal') return false;
    }
    if (searchText && !p.name.includes(searchText) && !p.sku.includes(searchText)) return false;
    return true;
  }), [products, categoryFilter, statusFilter, searchText]);

  const alertProducts = useMemo(() => products.filter(p => p.status !== 'normal'), [products]);

  const summaryCards = useMemo(() => [
    { label: 'Total Products', value: products.length, sub: 'SKUs', bgFrom: '#E8F0F5', bgTo: '#CCDBE5', border: '#CCDBE5', iconColor: '#8B9EAD' },
    { label: 'Normal Stock', value: products.filter(p => p.status === 'normal').length, sub: 'products', bgFrom: '#E5EEEC', bgTo: '#C8DDD9', border: '#C8DDD9', iconColor: '#6A9A7A' },
    { label: 'Low Stock Alert', value: products.filter(p => p.status === 'low').length, sub: 'need restock', bgFrom: '#F5EDE0', bgTo: '#E8D8C0', border: '#DECA9A', iconColor: '#A87A45' },
    { label: 'Out of Stock', value: products.filter(p => p.status === 'out').length, sub: 'urgent', bgFrom: '#EFE5E5', bgTo: '#E0D0D0', border: '#D4AAAA', iconColor: '#BF8888' },
  ], [products]);

  const cardStyle = { background: '#F7F6F4', border: '1px solid #E5E0D8', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' };

  return (
    <WebLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold" style={{ color: '#2C3540' }}>Inventory Management</h2>
            <p className="text-sm mt-1" style={{ color: '#9AA0A8' }}>Real-time stock monitoring · {products.length} SKUs</p>
          </div>
          <button
            className="flex items-center gap-2 px-4 py-2 text-white rounded-xl font-medium transition-colors"
            style={{ background: '#7B8CF8' }}
          >
            <Package className="w-4 h-4" />
            Export Report
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {summaryCards.map((card, i) => (
            <div key={i} className="rounded-xl p-5" style={cardStyle}>
              <div className="flex items-center justify-between mb-3">
                <Package className="w-5 h-5" style={{ color: card.iconColor }} />
                <ArrowUpRight className="w-4 h-4" style={{ color: '#9AA0A8' }} />
              </div>
              <div className="text-3xl font-bold mb-1" style={{ color: '#2C3540' }}>{card.value}</div>
              <div className="text-sm" style={{ color: '#6A7580' }}>{card.label}</div>
              <div className="text-xs" style={{ color: '#9AA0A8' }}>{card.sub}</div>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* Category Distribution */}
          <div className="rounded-xl p-5" style={cardStyle}>
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-5 h-5" style={{ color: '#8B9EAD' }} />
              <h3 className="font-bold" style={{ color: '#2C3540' }}>Category Distribution</h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={inventoryDistribution} layout="vertical">
                <XAxis type="number" tick={{ fontSize: 11, fill: '#9AA0A8' }} />
                <YAxis dataKey="category" type="category" tick={{ fontSize: 11, fill: '#9AA0A8' }} width={80} />
                <Tooltip
                  formatter={(val) => [`${val} units`, 'Total Stock']}
                  contentStyle={{ borderRadius: '12px', border: '1px solid #E5E0D8', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                />
                <Bar dataKey="value" fill="#8B9EAD" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Alert Summary */}
          <div className="rounded-xl p-5" style={cardStyle}>
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5" style={{ color: '#BF8888' }} />
              <h3 className="font-bold" style={{ color: '#2C3540' }}>Stock Alerts</h3>
            </div>
            <div className="space-y-2">
              {alertProducts.slice(0, 5).map(product => {
                const status = statusConfig[product.status];
                return (
                  <div
                    key={product.id}
                    className="flex items-center justify-between p-2.5 rounded-lg cursor-pointer transition-colors"
                    onClick={() => navigate(`/web/product/${product.id}`)}
                    onMouseEnter={e => (e.currentTarget.style.background = '#F0EDE8')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className="text-xs px-2 py-0.5 rounded-full flex-shrink-0 font-medium"
                        style={{ background: status.bg, color: status.text }}
                      >
                        {status.label}
                      </span>
                      <span className="text-sm font-medium truncate" style={{ color: '#2C3540' }}>{product.name}</span>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className="text-sm font-bold" style={{ color: barColors[product.status] }}>
                        {product.currentStock}
                      </span>
                      <ChevronRight className="w-4 h-4" style={{ color: '#E5E0D8' }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Product Table */}
        <div className="rounded-xl overflow-hidden" style={cardStyle}>
          {/* Toolbar */}
          <div className="p-4 flex items-center justify-between flex-wrap gap-3" style={{ borderBottom: '1px solid #ECEAE5' }}>
            <div className="flex items-center gap-3 flex-wrap">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#9AA0A8' }} />
                <input
                  type="text"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  placeholder="Search product name or SKU..."
                  className="pl-9 pr-4 py-2 rounded-lg text-sm outline-none transition-colors"
                  style={{ border: '1.5px solid #E5E0D8', color: '#2C3540' }}
                  onFocus={e => (e.target.style.borderColor = '#8B9EAD')}
                  onBlur={e => (e.target.style.borderColor = '#E5E0D8')}
                />
              </div>
              {[
                { value: categoryFilter, onChange: setCategoryFilter, options: categories },
                { value: statusFilter, onChange: setStatusFilter, options: ['All', 'Normal', 'Low', 'Out'] },
              ].map((sel, i) => (
                <select
                  key={i}
                  value={sel.value}
                  onChange={(e) => sel.onChange(e.target.value)}
                  className="rounded-lg px-3 py-2 text-sm outline-none"
                  style={{ border: '1.5px solid #E5E0D8', color: '#2C3540', background: '#F7F6F4' }}
                >
                  {sel.options.map(o => <option key={o}>{o}</option>)}
                </select>
              ))}
              <select
                value={selectedStore}
                onChange={(e) => setSelectedStore(e.target.value)}
                className="rounded-lg px-3 py-2 text-sm outline-none"
                style={{ border: '1.5px solid #E5E0D8', color: '#2C3540', background: '#F7F6F4' }}
              >
                <option value="All">All Stores</option>
                {mockStores.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <span className="text-sm" style={{ color: '#6A7580' }}>{filteredProducts.length} products</span>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: '1px solid #ECEAE5', background: '#EDE9E3' }}>
                  {['Product', 'Store', 'Category', 'Current Stock', 'Safety Level', 'Max Stock', 'Status', 'Price', 'Action'].map((h, i) => (
                    <th
                      key={h}
                      className={`px-${i === 0 ? '5' : '4'} py-3 text-xs font-bold uppercase ${i >= 3 && i <= 6 ? 'text-center' : i >= 7 ? 'text-right' : 'text-left'}`}
                      style={{ color: '#9AA0A8' }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => {
                  const status = statusConfig[product.status];
                  const pct = product.maxStock > 0 ? (product.currentStock / product.maxStock) * 100 : 100;
                  return (
                    <tr
                      key={product.id}
                      className="cursor-pointer transition-colors"
                      style={{ borderBottom: '1px solid #ECEAE5' }}
                      onClick={() => navigate(`/web/product/${product.id}`)}
                      onMouseEnter={e => (e.currentTarget.style.background = '#F0EDE8')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          {product.status !== 'normal' && <AlertTriangle className="w-4 h-4 flex-shrink-0" style={{ color: '#BF8888' }} />}
                          <div>
                            <div className="font-medium text-sm" style={{ color: '#2C3540' }}>{product.name}</div>
                            <div className="text-xs" style={{ color: '#9AA0A8' }}>{product.sku}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-sm" style={{ color: '#6A7580' }}>{product.storeName || 'N/A'}</td>
                      <td className="px-4 py-3.5 text-sm" style={{ color: '#6A7580' }}>{product.category}</td>
                      <td className="px-4 py-3.5 text-right">
                        <div className="flex items-center gap-2 justify-end">
                          <div className="w-24 h-1.5 rounded-full" style={{ background: '#ECEAE5' }}>
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${Math.min(pct, 100)}%`,
                                background: barColors[product.status],
                              }}
                            />
                          </div>
                          <span className="font-bold text-sm w-8 text-right" style={{ color: status.text }}>
                            {product.currentStock}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-center text-sm" style={{ color: '#9AA0A8' }}>{product.safetyStock}</td>
                      <td className="px-4 py-3.5 text-center text-sm font-medium" style={{ color: '#6A7580' }}>{product.maxStock}</td>
                      <td className="px-4 py-3.5 text-center">
                        <span
                          className="text-xs px-2 py-1 rounded-full font-medium"
                          style={{ background: status.bg, color: status.text, border: `1px solid ${status.border}` }}
                        >
                          {status.label}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-right text-sm font-medium" style={{ color: '#2C3540' }}>¥{product.price}</td>
                      <td className="px-4 py-3.5 text-right">
                        <button
                          onClick={(e) => { e.stopPropagation(); navigate(`/web/product/${product.id}`); }}
                          className="text-sm hover:underline flex items-center gap-1 ml-auto"
                          style={{ color: '#8B9EAD' }}
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
      </div>
    </WebLayout>
  );
}