import { F } from '../../colors';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import {
  ArrowLeft, Camera, CheckCircle2, FileText, Zap, Package,
  AlertTriangle, CheckCheck,
} from 'lucide-react';
import { MobileLayout } from './MobileLayout';
import { ModeSwitcher } from './ModeSwitcher';
import { SlideToConfirm } from './SlideToConfirm';
import { AnomalyReportDialog } from '../dialogs/AnomalyReportDialog';
import { useMode } from '../../context/ModeContext';
import { useAppData } from '../../context/AppDataContext';
import { toast } from 'sonner';

interface StyleSet { bg: string; text: string; border: string; label?: string }

const conditionMap: Record<string, string> = {
  'good': 'Good',
  'slightly_damaged': 'Slightly Damaged',
  'severely_damaged': 'Severely Damaged',
  'expired': 'Expired',
};

const conditionStyles: Record<string, StyleSet> = {
  'Good': { bg: '#E5EEEC', text: '#6A9A7A', border: '#C8DDD9' },
  'Slightly Damaged': { bg: '#F5EDE0', text: '#A87A45', border: '#DECA9A' },
  'Severely Damaged': { bg: '#EFE5E5', text: '#BF8888', border: '#D4AAAA' },
  'Expired': { bg: '#E8F0F5', text: '#8B9EAD', border: '#CCDBE5' },
};

const statusMap: Record<string, string> = {
  'Pending': 'Pending',
  'Completed': 'Completed',
};

const statusStyles: Record<string, StyleSet> = {
  'Pending': { label: 'Pending', bg: '#F5EDE0', text: '#A87A45', border: '#DECA9A' },
  'Counting': { label: 'Counting', bg: '#E8F0F5', text: '#8B9EAD', border: '#CCDBE5' },
  'Completed': { label: 'Completed', bg: '#E5EEEC', text: '#6A9A7A', border: '#C8DDD9' },
};

const reasonMap: Record<string, string> = {
  'packaging_damaged': 'Packaging Damaged',
  'quality_issue': 'Quality Issue',
  'expired': 'Expired',
  'customer_return': 'Customer Return',
  'shipping_damage': 'Shipping Damage',
  'other': 'Other',
};

function ConditionBadge({ condition, className = '' }: { condition: string; className?: string }) {
  const conditionText = conditionMap[condition] || condition;
  const s = conditionStyles[conditionText] ?? { bg: '#F3F4F6', text: '#6B7280', border: '#D1D5DB' };
  return (
    <span
      className={`text-xs px-2 py-0.5 rounded font-medium ${className}`}
      style={{ background: s.bg, color: s.text, border: `1px solid ${s.border}` }}
    >
      {conditionText}
    </span>
  );
}

function StatusBadge({ status, className = '' }: { status: string; className?: string }) {
  const statusText = statusMap[status] || status;
  const s = statusStyles[statusText] ?? { label: statusText, bg: '#F3F4F6', text: '#6B7280', border: '#D1D5DB' };
  return (
    <span
      className={`text-xs px-2 py-1 rounded-full font-bold ${className}`}
      style={{ background: s.bg, color: s.text, border: `1px solid ${s.border}` }}
    >
      {s.label ?? statusText}
    </span>
  );
}

export function MobileReturnInspection() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { isField } = useMode();
  const { returnOrders, updateReturnOrderStatus, addAlert } = useAppData();

  const order = returnOrders.find(o => o.id === id) || returnOrders[0];
  const returnItems = order?.items ?? [];

  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [photos, setPhotos] = useState<string[]>([]);
  const [showAnomalyDialog, setShowAnomalyDialog] = useState(false);
  const [anomalyReported, setAnomalyReported] = useState(false);

  const allSelected = selectedItems.size === returnItems.length;

  const toggleItem = (itemId: string) => {
    const next = new Set(selectedItems);
    if (next.has(itemId)) next.delete(itemId); else next.add(itemId);
    setSelectedItems(next);
  };

  const toggleAll = () => {
    setSelectedItems(allSelected ? new Set() : new Set(returnItems.map(i => i.id)));
  };

  const handlePhotoCapture = () => {
    setPhotos(prev => [...prev, `photo-${Date.now()}.jpg`]);
    toast.success('Photo added', { description: `${photos.length + 1} photos taken` });
  };

  const handleConfirm = () => {
    updateReturnOrderStatus(order.id, 'Completed');
    toast.success('Return inspection completed!', { description: `${order.orderId} archived, ${returnItems.length} items`, duration: 3000 });
    setTimeout(() => navigate('/mobile'), 1200);
  };

  const handleAnomalySubmit = (data: { type: string; description: string; photos: File[] }) => {
    addAlert({
      severity: 'medium',
      description: `[Return Anomaly·${data.type}] ${order.storeName}: ${data.description.slice(0, 28) || 'Return item anomaly'}`,
      store: order.storeName,
      status: 'Pending',
      storeId: order.storeId,
      productId: returnItems[0]?.id ?? '1',
    });
    setAnomalyReported(true);
    setShowAnomalyDialog(false);
    toast.success('Anomaly reported!', { description: 'Synced to web alert list', duration: 4000 });
  };

  const conditionQtySummary = returnItems.reduce<Record<string, number>>((acc, item) => {
    const conditionText = conditionMap[item.condition] || item.condition;
    acc[conditionText] = (acc[conditionText] || 0) + item.quantity;
    return acc;
  }, {});
  const totalQuantity = returnItems.reduce((sum, i) => sum + i.quantity, 0);

  if (!order) {
    return (
      <MobileLayout>
        <div className="flex items-center justify-center min-h-screen">
          <p style={{ color: '#9AA0A8' }}>No return orders</p>
        </div>
      </MobileLayout>
    );
  }

  // ── Field Mode ──────────────────────────────────────────────────
  if (isField) {
    return (
      <MobileLayout showNav={false}>
        <div className="min-h-screen" style={{ background: F.bg }}>
          <div className="p-4 flex items-center justify-between" style={{ background: F.header, borderBottom: `1.5px solid ${F.border}` }}>
            <button onClick={() => navigate('/mobile')} className="flex items-center gap-2" style={{ color: F.accent }}>
              <ArrowLeft className="w-5 h-5" /><span>Back</span>
            </button>
            <div className="flex items-center gap-1" style={{ color: F.accent }}>
              <Zap className="w-4 h-4" /><span className="text-sm font-bold">Return Inspection</span>
            </div>
            <ModeSwitcher compact />
          </div>

          <div className="p-4" style={{ background: F.accentBg, borderBottom: `2px solid ${F.accentBorder}` }}>
            <div className="flex items-center justify-between mb-1">
              <div className="text-2xl font-bold" style={{ color: F.text }}>{order.orderId}</div>
              <StatusBadge status={order.status} />
            </div>
            <div style={{ color: F.textMid }}>{order.storeName} · {returnItems.length} SKUs · {totalQuantity} items</div>
            <div className="text-sm mt-1" style={{ color: F.textSoft }}>Return Order · {order.date}</div>
            {anomalyReported && (
              <div className="mt-2 flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ background: F.success }}>
                <CheckCheck className="w-4 h-4" style={{ color: F.text }} />
                <span className="text-sm font-bold" style={{ color: F.text }}>Anomaly reported to web</span>
              </div>
            )}
          </div>

          <div
            className="p-4 flex items-center gap-4 cursor-pointer"
            style={{ background: F.surface, borderBottom: `1.5px solid ${F.border}` }}
            onClick={toggleAll}
          >
            <div
              className="w-10 h-10 rounded flex items-center justify-center"
              style={{
                background: allSelected ? F.accent : 'transparent',
                border: `3px solid ${allSelected ? F.accent : F.border}`,
              }}
            >
              {allSelected && <CheckCircle2 className="w-6 h-6" style={{ color: F.accentText }} />}
            </div>
            <span className="text-xl font-bold" style={{ color: F.text }}>Select All ({selectedItems.size}/{returnItems.length})</span>
          </div>

          <div className="p-4 space-y-4">
            {returnItems.map((item) => (
              <div
                key={item.id}
                className="rounded-xl p-4 cursor-pointer"
                style={{
                  background: F.surface,
                  border: `2px solid ${selectedItems.has(item.id) ? F.accent : F.border}`,
                }}
                onClick={() => toggleItem(item.id)}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="w-10 h-10 rounded flex-shrink-0 mt-1 flex items-center justify-center"
                    style={{
                      background: selectedItems.has(item.id) ? F.accent : 'transparent',
                      border: `3px solid ${selectedItems.has(item.id) ? F.accent : F.border}`,
                    }}
                  >
                    {selectedItems.has(item.id) && <CheckCircle2 className="w-6 h-6" style={{ color: F.accentText }} />}
                  </div>
                  <div className="flex-1">
                    <div className="text-xl font-bold mb-1" style={{ color: F.text }}>{item.name}</div>
                    <div className="text-sm mb-3" style={{ color: F.textMid }}>{item.sku}</div>
                    <div className="flex gap-4 mb-3">
                      <div>
                        <div className="text-sm" style={{ color: F.textSoft }}>Return Qty</div>
                        <div className="text-3xl font-bold" style={{ color: F.text }}>{item.quantity}</div>
                      </div>
                      <div>
                        <div className="text-sm" style={{ color: F.textSoft }}>Reason</div>
                        <div className="text-xl font-bold" style={{ color: F.alertMedBorder }}>{reasonMap[item.reason] || item.reason}</div>
                      </div>
                    </div>
                    <ConditionBadge condition={item.condition} className="px-3 py-1 rounded-full text-sm font-bold" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 space-y-3 pb-8">
            <button
              onClick={handlePhotoCapture}
              className="w-full py-5 flex items-center justify-center gap-3 font-bold rounded-xl"
              style={{ background: F.surfaceLight, border: `2px solid ${F.border}`, color: F.text }}
            >
              <Camera className="w-8 h-8" />Take Photo ({photos.length})
            </button>
            <button
              onClick={() => setShowAnomalyDialog(true)}
              className="w-full py-4 flex items-center justify-center gap-3 font-bold rounded-xl"
              style={{ background: F.accentBg, border: `2px solid ${F.accentBorder}`, color: F.accent }}
            >
              <FileText className="w-6 h-6" />{anomalyReported ? 'Add Anomaly Report' : 'Report Anomaly'}
            </button>
            <SlideToConfirm label="Slide right to confirm return" onConfirm={handleConfirm} color="red" />
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
          <button onClick={() => navigate('/mobile')} className="flex items-center gap-1" style={{ color: '#9AA0A8' }}>
            <ArrowLeft className="w-5 h-5" /><span className="text-sm">Back</span>
          </button>
          <span className="font-bold" style={{ color: '#2C3540' }}>Return Inspection</span>
          <StatusBadge status={order.status} />
        </div>

        <ModeSwitcher />

        <div className="p-4">
          {/* Order Info */}
          <div className="rounded-xl p-4 mb-4" style={{ background: '#ffffff', border: '1px solid #E5E0D8', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: '#F5EDE0' }}>
                <Package className="w-5 h-5" style={{ color: '#C4A97A' }} />
              </div>
              <div className="flex-1">
                <div className="text-xl font-bold" style={{ color: '#2C3540' }}>{order.orderId}</div>
                <div className="text-sm" style={{ color: '#9AA0A8' }}>{order.storeName} · {order.date}</div>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-1 text-center p-3 rounded-lg" style={{ background: '#F7F6F4' }}>
                <div className="text-2xl font-bold" style={{ color: '#2C3540' }}>{returnItems.length}</div>
                <div className="text-xs" style={{ color: '#9AA0A8' }}>SKUs</div>
              </div>
              <div className="flex-1 text-center p-3 rounded-lg" style={{ background: '#F7F6F4' }}>
                <div className="text-2xl font-bold" style={{ color: '#C4A97A' }}>{totalQuantity}</div>
                <div className="text-xs" style={{ color: '#9AA0A8' }}>Total Qty</div>
              </div>
            </div>
          </div>

          {/* Items List */}
          <div className="space-y-3">
            {returnItems.map((item) => (
              <div
                key={item.id}
                className="rounded-xl p-4"
                style={{ background: '#ffffff', border: '1px solid #E5E0D8' }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="font-bold" style={{ color: '#2C3540' }}>{item.name}</div>
                  <ConditionBadge condition={item.condition} />
                </div>
                <div className="text-sm" style={{ color: '#9AA0A8' }}>{item.sku}</div>
                <div className="flex items-center justify-between mt-3">
                  <div>
                    <div className="text-xs" style={{ color: '#9AA0A8' }}>Return Qty</div>
                    <div className="text-xl font-bold" style={{ color: '#2C3540' }}>{item.quantity}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs" style={{ color: '#9AA0A8' }}>Reason</div>
                    <div className="font-bold" style={{ color: '#C4A97A' }}>{reasonMap[item.reason] || item.reason}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="mt-6 space-y-3">
            <button
              onClick={handlePhotoCapture}
              className="w-full py-4 flex items-center justify-center gap-2 font-bold rounded-xl"
              style={{ background: '#ffffff', border: '1.5px solid #E5E0D8', color: '#2C3540' }}
            >
              <Camera className="w-5 h-5" />Take Photo ({photos.length})
            </button>
            <button
              onClick={() => setShowAnomalyDialog(true)}
              className="w-full py-4 flex items-center justify-center gap-2 font-bold rounded-xl"
              style={{ background: '#F5EDE0', border: '1.5px solid #DECA9A', color: '#A87A45' }}
            >
              <AlertTriangle className="w-5 h-5" />{anomalyReported ? 'Add Anomaly Report' : 'Report Anomaly'}
            </button>
            <SlideToConfirm label="Slide right to confirm return" onConfirm={handleConfirm} color="red" />
          </div>
        </div>
        {showAnomalyDialog && <AnomalyReportDialog onClose={() => setShowAnomalyDialog(false)} onSubmit={handleAnomalySubmit} forceMobile />}
      </div>
    </MobileLayout>
  );
}
