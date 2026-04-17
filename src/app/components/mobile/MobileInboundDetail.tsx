import { F } from '../../colors';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ArrowLeft, FileText, CheckCircle2, Zap, CheckCheck, Store, Clock } from 'lucide-react';
import { mockInboundOrders } from '../../data/mockData';
import { AnomalyReportDialog } from '../dialogs/AnomalyReportDialog';
import { MobileLayout } from './MobileLayout';
import { ModeSwitcher } from './ModeSwitcher';
import { SlideToConfirm } from './SlideToConfirm';
import { useMode } from '../../context/ModeContext';
import { useAppData } from '../../context/AppDataContext';
import { toast } from 'sonner';

const statusMap: Record<string, string> = {
  'Pending': 'Pending',
  'Completed': 'Completed',
};

export function MobileInboundDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { isField } = useMode();
  const { addAlert, reportedInboundItems, addReportedInboundItems } = useAppData();

  const order = mockInboundOrders.find(o => o.id === id);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [showAnomalyDialog, setShowAnomalyDialog] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  if (!order) {
    return (
      <MobileLayout showNav={false}>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <p className="text-gray-500">Inbound order not found</p>
            <button onClick={() => navigate('/mobile/inbound')} className="mt-4 px-4 py-2 bg-black text-white rounded-lg">
              Back to list
            </button>
          </div>
        </div>
      </MobileLayout>
    );
  }

  const reportedSet = reportedInboundItems[order.id] ?? new Set<string>();
  const allSelected = selectedItems.size === order.items.length;
  const totalQty = order.items.reduce((sum, i) => sum + i.expected, 0);
  const statusText = statusMap[order.status] || order.status;

  const toggleItem = (itemId: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(itemId)) newSelected.delete(itemId);
    else newSelected.add(itemId);
    setSelectedItems(newSelected);
  };

  const toggleAll = () => {
    if (allSelected) setSelectedItems(new Set());
    else setSelectedItems(new Set(order.items.map(item => item.id)));
  };

  const handleConfirm = () => {
    setConfirmed(true);
    toast.success('Inbound confirmed!', {
      description: `${order.orderId} has been inspected, ${order.items.length} items`,
      duration: 3000,
    });
    setTimeout(() => navigate('/mobile/inbound'), 1200);
  };

  const handleAnomalySubmit = (data: { type: string; description: string; photos: File[] }) => {
    const itemIds: string[] = selectedItems.size > 0
      ? Array.from(selectedItems)
      : order.items.map(i => i.id);

    addReportedInboundItems(order.id, itemIds);

    addAlert({
      severity: 'high',
      description: `[${data.type}] ${order.supplier} · ${data.description.slice(0, 30) || `${itemIds.length} item anomalies`}`,
      store: order.supplier,
      status: 'Pending',
      storeId: '1',
      productId: itemIds.join(','),
    });

    setShowAnomalyDialog(false);
    toast.success('Anomaly reported!', {
      description: `${itemIds.length} items marked, synced to Web alerts`,
      duration: 4000,
    });
  };

  // ── Field Mode ─────────────────────────────────────────────
  if (isField) {
    return (
      <MobileLayout showNav={false}>
        <div className="min-h-screen" style={{ background: F.bg }}>
          {/* Header */}
          <div className="p-4 flex items-center justify-between" style={{ background: F.header, borderBottom: `1.5px solid ${F.border}` }}>
            <button onClick={() => navigate('/mobile/inbound')} className="flex items-center gap-2" style={{ color: F.accent }}>
              <ArrowLeft className="w-5 h-5" /><span>Back</span>
            </button>
            <div className="flex items-center gap-1" style={{ color: F.accent }}>
              <Zap className="w-4 h-4" /><span className="text-sm font-bold">Inbound Inspection</span>
            </div>
            <ModeSwitcher compact />
          </div>

          {/* Order Banner */}
          <div className="p-4" style={{ background: F.accentBg, borderBottom: `2px solid ${F.accentBorder}` }}>
            <div className="flex items-center justify-between mb-1">
              <div className="text-2xl font-bold" style={{ color: F.text }}>{order.orderId}</div>
              <span
                className="text-xs px-3 py-1 rounded-full font-bold"
                style={{ background: statusText === 'Completed' ? '#E5EEEC' : '#E8F0F5', color: statusText === 'Completed' ? '#6A9A7A' : '#8B9EAD' }}
              >
                {statusText}
              </span>
            </div>
            <div className="flex items-center gap-2" style={{ color: F.textMid }}>
              <Store className="w-4 h-4" />
              <span>{order.supplier}</span>
            </div>
            <div className="flex gap-6 mt-2">
              <div>
                <span style={{ color: F.textSoft }}>Total Qty</span>
                <span className="text-xl font-bold ml-2" style={{ color: F.accent }}>{totalQty}</span>
              </div>
              {order.estimatedArrival && (
                <div className="flex items-center gap-1" style={{ color: F.accent }}>
                  <Clock className="w-4 h-4" />
                  <span>{order.estimatedArrival}</span>
                </div>
              )}
            </div>
            {reportedSet.size > 0 && (
              <div className="mt-3 flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ background: F.success }}>
                <CheckCheck className="w-4 h-4" style={{ color: F.text }} />
                <span className="text-sm font-bold" style={{ color: F.text }}>{reportedSet.size} anomalies reported</span>
              </div>
            )}
          </div>

          {/* Select All */}
          <div className="p-4 flex items-center gap-4 cursor-pointer" style={{ background: F.surface, borderBottom: `1.5px solid ${F.border}` }} onClick={toggleAll}>
            <div className="w-10 h-10 rounded flex items-center justify-center" style={{ background: allSelected ? F.accent : 'transparent', border: `3px solid ${allSelected ? F.accent : F.border}` }}>
              {allSelected && <CheckCircle2 className="w-6 h-6" style={{ color: F.accentText }} />}
            </div>
            <span className="text-xl font-bold" style={{ color: F.text }}>Select All ({selectedItems.size}/{order.items.length})</span>
          </div>

          {/* Items List */}
          <div className="p-4 space-y-4">
            {order.items.map((item) => {
              const isReported = reportedSet.has(item.id);
              const borderColor = isReported ? F.successBorder : selectedItems.has(item.id) ? F.accent : F.border;
              return (
                <div key={item.id} className="rounded-xl p-4 cursor-pointer" style={{ background: F.surface, border: `2px solid ${borderColor}` }} onClick={() => toggleItem(item.id)}>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded flex-shrink-0 mt-1 flex items-center justify-center" style={{ background: selectedItems.has(item.id) ? F.accent : 'transparent', border: `3px solid ${selectedItems.has(item.id) ? F.accent : F.border}` }}>
                      {selectedItems.has(item.id) && <CheckCircle2 className="w-6 h-6" style={{ color: F.accentText }} />}
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap gap-2 mb-2">
                        {isReported && (
                          <div className="flex items-center gap-1 px-2 py-1 rounded inline-flex" style={{ background: F.success }}>
                            <CheckCheck className="w-4 h-4" style={{ color: F.text }} />
                            <span className="text-sm font-bold" style={{ color: F.text }}>Reported</span>
                          </div>
                        )}
                      </div>
                      <div className="text-xl font-bold mb-2" style={{ color: F.text }}>{item.name}</div>
                      <div className="text-sm mb-3" style={{ color: F.textMid }}>{item.sku}</div>
                      <div className="flex gap-6">
                        <div>
                          <div className="text-sm" style={{ color: F.textSoft }}>Expected Qty</div>
                          <div className="text-3xl font-bold" style={{ color: F.text }}>{item.expected}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Actions */}
          <div className="p-4 space-y-4 pb-8">
            <button onClick={() => setShowAnomalyDialog(true)} className="w-full py-4 flex items-center justify-center gap-3 font-bold rounded-xl" style={{ background: F.accentBg, border: `2px solid ${F.accentBorder}`, color: F.accent }}>
              <FileText className="w-6 h-6" />Report Anomaly {reportedSet.size > 0 && `(Reported ${reportedSet.size})`}
            </button>
            <SlideToConfirm label="Slide right to confirm" onConfirm={handleConfirm} color="green" />
          </div>
        </div>

        {showAnomalyDialog && <AnomalyReportDialog onClose={() => setShowAnomalyDialog(false)} onSubmit={handleAnomalySubmit} forceMobile />}
      </MobileLayout>
    );
  }

  // ── Standard Mode ──────────────────────────────────────────────
  return (
    <MobileLayout showNav={false}>
      <div className="min-h-screen" style={{ background: '#F7F6F4' }}>
        {/* Header */}
        <div className="p-4 flex items-center justify-between sticky top-0 z-10" style={{ background: '#F7F6F4', borderBottom: '1.5px solid #E5E0D8' }}>
          <button onClick={() => navigate('/mobile/inbound')} className="flex items-center gap-1" style={{ color: '#9AA0A8' }}>
            <ArrowLeft className="w-5 h-5" /><span className="text-sm">Back</span>
          </button>
          <span className="font-bold" style={{ color: '#2C3540' }}>Inbound Inspection Details</span>
          <div className="w-10" />
        </div>

        <ModeSwitcher />

        <div className="p-4">
          {/* Order Info */}
          <div className="rounded-xl p-4 mb-4" style={{ background: '#ffffff', border: '1.5px solid #E5E0D8' }}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <h2 className="font-bold text-xl" style={{ color: '#2C3540' }}>{order.orderId}</h2>
                <div className="flex items-center gap-2 mt-1" style={{ color: '#9AA0A8' }}>
                  <Store className="w-4 h-4" />
                  <span>{order.supplier}</span>
                </div>
              </div>
              <span className="text-xs px-3 py-1 rounded-full font-bold" style={{ background: statusText === 'Completed' ? '#E5EEEC' : '#E8F0F5', color: statusText === 'Completed' ? '#6A9A7A' : '#8B9EAD' }}>
                {statusText}
              </span>
            </div>
            <div className="flex gap-6">
              <div className="flex-1 text-center p-3 rounded-lg" style={{ background: '#F7F6F4' }}>
                <div className="text-2xl font-bold" style={{ color: '#C4A97A' }}>{totalQty}</div>
                <div className="text-xs" style={{ color: '#9AA0A8' }}>Total Qty</div>
              </div>
              <div className="flex-1 text-center p-3 rounded-lg" style={{ background: '#F7F6F4' }}>
                <div className="text-2xl font-bold" style={{ color: '#8B9EAD' }}>{order.date}</div>
                <div className="text-xs" style={{ color: '#9AA0A8' }}>Date</div>
              </div>
            </div>
          </div>

          {/* Items List */}
          <div className="space-y-3">
            {order.items.map((item) => {
              const isReported = reportedSet.has(item.id);
              return (
                <div key={item.id} className="rounded-xl p-4" style={{ background: '#ffffff', border: `1.5px solid ${isReported ? '#C8DDD9' : '#E5E0D8'}` }}>
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded mt-0.5 flex-shrink-0 flex items-center justify-center" style={{ border: `2px solid ${selectedItems.has(item.id) ? '#8B9EAD' : '#E5E0D8'}`, background: selectedItems.has(item.id) ? '#8B9EAD' : 'white' }}>
                      {selectedItems.has(item.id) && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap gap-1.5 mb-1.5">
                        {isReported && (
                          <div className="flex items-center gap-1 px-2 py-0.5 rounded inline-flex" style={{ background: '#E5EEEC', border: '1px solid #C8DDD9' }}>
                            <CheckCheck className="w-3 h-3" style={{ color: '#6A9A7A' }} />
                            <span className="text-xs font-bold" style={{ color: '#6A9A7A' }}>Reported</span>
                          </div>
                        )}
                      </div>
                      <div className="font-bold text-sm" style={{ color: '#2C3540' }}>{item.name}</div>
                      <div className="text-xs mb-2" style={{ color: '#9AA0A8' }}>{item.sku}</div>
                      <div className="flex gap-6 text-sm">
                        <div>
                          <span style={{ color: '#9AA0A8' }}>Expected Qty:</span>
                          <span className="font-bold" style={{ color: '#2C3540' }}>{item.expected}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Actions */}
          <div className="mt-6 space-y-3">
            <button onClick={() => setShowAnomalyDialog(true)} className="w-full py-4 flex items-center justify-center gap-2 font-bold rounded-xl" style={{ background: '#F5EDE0', border: '1.5px solid #DECA9A', color: '#A87A45' }}>
              <FileText className="w-5 h-5" />Report Anomaly {reportedSet.size > 0 && `(Reported ${reportedSet.size})`}
            </button>
            <SlideToConfirm label="Slide right to confirm" onConfirm={handleConfirm} color="green" />
          </div>
        </div>

        {showAnomalyDialog && <AnomalyReportDialog onClose={() => setShowAnomalyDialog(false)} onSubmit={handleAnomalySubmit} forceMobile />}
      </div>
    </MobileLayout>
  );
}
