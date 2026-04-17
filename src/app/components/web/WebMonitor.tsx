import { useState } from 'react';
import { useNavigate } from 'react-router';
import { AlertTriangle, ChevronRight } from 'lucide-react';
import { mockTopAlerts, mockAlerts } from '../../data/mockData';
import { WebLayout } from './WebLayout';
import { StockConflictDialog } from '../dialogs/StockConflictDialog';

const cardStyle = { background: '#F7F6F4', border: '1px solid #E5E0D8', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' };

export function WebMonitor() {
  const navigate = useNavigate();
  const [severityFilter, setSeverityFilter] = useState('All');
  const [showConflictDialog, setShowConflictDialog] = useState(false);

  const allAlerts = [
    ...mockTopAlerts.map(a => ({ ...a, type: 'stock' as const })),
    ...mockAlerts.map(a => ({
      id: `alert-${a.id}`,
      severity: a.severity,
      description: `${a.productName} Stock Alert`,
      store: a.location,
      status: 'Pending',
      storeId: '1',
      productId: a.id,
      type: 'alert' as const,
    }))
  ];

  const filtered = allAlerts.filter(a =>
    severityFilter === 'All' ||
    (severityFilter === 'High' && a.severity === 'high') ||
    (severityFilter === 'Medium' && a.severity === 'medium') ||
    (severityFilter === 'Low' && a.severity === 'low')
  );

  const summaryCards = [
    { label: 'High Severity', count: allAlerts.filter(a => a.severity === 'high').length, bg: '#EFE5E5', border: '#D4AAAA', text: '#BF8888' },
    { label: 'Medium Severity', count: allAlerts.filter(a => a.severity === 'medium').length, bg: '#F5EDE0', border: '#DECA9A', text: '#A87A45' },
    { label: 'Low Severity', count: allAlerts.filter(a => a.severity === 'low').length, bg: '#E8F0F5', border: '#CCDBE5', text: '#8B9EAD' },
  ];

  const severityColor = {
    high: { dot: '#BF8888', text: '#BF8888' },
    medium: { dot: '#C4A97A', text: '#A87A45' },
    low: { dot: '#8B9EAD', text: '#8B9EAD' },
  };

  const statusStyle = (status: string) => {
    if (status === 'Pending') return { background: '#EFE5E5', color: '#BF8888' };
    if (status === 'In Progress') return { background: '#E8F0F5', color: '#8B9EAD' };
    return { background: '#E5EEEC', color: '#6A9A7A' };
  };

  const filterTabs = [
    { key: 'All', label: 'All Severity' },
    { key: 'High', label: 'High' },
    { key: 'Medium', label: 'Medium' },
    { key: 'Low', label: 'Low' },
  ];

  return (
    <WebLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold" style={{ color: '#2C3540' }}>Anomaly Monitor</h2>
            <p className="text-sm mt-1" style={{ color: '#9AA0A8' }}>Real-time monitoring of all store anomalies</p>
          </div>
          <button
            onClick={() => setShowConflictDialog(true)}
            className="flex items-center gap-2 px-4 py-2 text-white rounded-xl font-medium transition-colors"
            style={{ background: '#BF8888' }}
          >
            <AlertTriangle className="w-4 h-4" />
            Stock Conflict Demo
          </button>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {summaryCards.map(item => (
            <div key={item.label} className="rounded-xl p-5" style={cardStyle}>
              <div className="text-3xl font-bold mb-1" style={{ color: item.text }}>{item.count}</div>
              <div className="text-sm" style={{ color: '#6A7580' }}>{item.label}</div>
              <div className="h-1 mt-3 rounded-full" style={{ background: '#ECEAE5' }}>
                <div className="h-full rounded-full w-full" style={{ background: item.border }} />
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-4">
          {filterTabs.map(f => (
            <button
              key={f.key}
              onClick={() => setSeverityFilter(f.key)}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
              style={{
                border: '1.5px solid',
                borderColor: severityFilter === f.key ? '#8B9EAD' : '#E5E0D8',
                background: severityFilter === f.key ? '#8B9EAD' : '#F7F6F4',
                color: severityFilter === f.key ? 'white' : '#6A7580',
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Alert List */}
        <div className="rounded-xl overflow-hidden" style={cardStyle}>
          <div
            className="grid grid-cols-6 gap-4 px-5 py-3 text-xs font-bold uppercase tracking-wide"
            style={{ background: '#EDE9E3', color: '#9AA0A8', borderBottom: '1px solid #E5E0D8' }}
          >
            <div>Severity</div>
            <div className="col-span-2">Description</div>
            <div>Store</div>
            <div>Status</div>
            <div>Action</div>
          </div>

          <div>
            {filtered.map((alert, i) => {
              const sc = severityColor[alert.severity as keyof typeof severityColor] || severityColor.low;
              return (
                <div
                  key={i}
                  className="grid grid-cols-6 gap-4 px-5 py-4 items-center transition-colors"
                  style={{ borderBottom: '1px solid #ECEAE5' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#F0EDE8')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ background: sc.dot }} />
                    <span className="text-xs font-bold" style={{ color: sc.text }}>
                      {alert.severity === 'high' ? 'High' : alert.severity === 'medium' ? 'Medium' : 'Low'}
                    </span>
                  </div>
                  <div className="col-span-2 text-sm font-medium" style={{ color: '#2C3540' }}>{alert.description}</div>
                  <div
                    className="text-sm cursor-pointer hover:underline"
                    style={{ color: '#8B9EAD' }}
                    onClick={() => navigate(`/web/store/${alert.storeId}`)}
                  >
                    {alert.store}
                  </div>
                  <div>
                    <span className="text-xs px-2 py-0.5 rounded-full" style={statusStyle(alert.status)}>
                      {alert.status}
                    </span>
                  </div>
                  <div>
                    <button
                      onClick={() => navigate(`/web/product/${alert.productId}`)}
                      className="text-xs hover:underline flex items-center gap-1"
                      style={{ color: '#8B9EAD' }}
                    >
                      Process <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {showConflictDialog && (
        <StockConflictDialog
          product={{ name: 'Nestle Milk Powder (900g)', currentStock: 150, safetyStock: 200, pendingOrders: 5 }}
          onResolve={() => setShowConflictDialog(false)}
          onClose={() => setShowConflictDialog(false)}
        />
      )}
    </WebLayout>
  );
}