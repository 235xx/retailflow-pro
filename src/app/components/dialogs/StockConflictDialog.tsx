import { AlertTriangle, TrendingUp, Package } from 'lucide-react';
import { MobileDrawer } from './MobileDrawer';

interface StockConflictDialogProps {
  product: {
    name: string;
    currentStock: number;
    safetyStock: number;
    pendingOrders: number;
  };
  onResolve: (action: 'priority' | 'split' | 'cancel') => void;
  onClose: () => void;
  forceMobile?: boolean;
}

export function StockConflictDialog({
  product,
  onResolve,
  onClose,
  forceMobile,
}: StockConflictDialogProps) {
  return (
    <MobileDrawer
      isOpen={true}
      onClose={onClose}
      title="Stock Conflict Alert"
      forceMobile={forceMobile}
      headerClassName=""
    >
      <div className="space-y-4">
        {/* Product Info */}
        <div
          className="rounded-xl p-3 flex items-center justify-between"
          style={{ background: '#ffffff', border: '1px solid #E5E0D8' }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center shadow-sm" style={{ background: '#EDE9E3', border: '1px solid #E5E0D8' }}>
              <Package className="w-5 h-5" style={{ color: '#8B9EAD' }} />
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider" style={{ color: '#9AA0A8' }}>Conflicting Item</div>
              <div className="font-bold text-sm truncate" style={{ color: '#2C3540' }}>{product.name}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] font-bold uppercase tracking-wider" style={{ color: '#9AA0A8' }}>Current Stock</div>
            <div className="font-bold text-sm" style={{ color: '#8B9EAD' }}>
              {product.currentStock} <span className="text-[10px] font-normal" style={{ color: '#9AA0A8' }}>units</span>
            </div>
          </div>
        </div>

        {/* Conflict Details */}
        <div className="rounded-xl p-3" style={{ background: '#EFE5E5', border: '1px solid #D4AAAA' }}>
          <div className="flex items-center gap-1.5 mb-2">
            <AlertTriangle className="w-3.5 h-3.5" style={{ color: '#BF8888' }} />
            <span className="text-[10px] font-black uppercase tracking-wider" style={{ color: '#BF8888' }}>Stock Shortage Alert</span>
          </div>
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span style={{ color: '#9AA0A8' }}>Pending Transfer Requests</span>
              <span className="font-bold" style={{ color: '#BF8888' }}>{product.pendingOrders}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span style={{ color: '#9AA0A8' }}>Total Demand / Available Stock</span>
              <span className="font-bold" style={{ color: '#2C3540' }}>{product.pendingOrders * 50} / {product.currentStock}</span>
            </div>
            <div className="h-0.5 my-1" style={{ background: '#D4AAAA' }} />
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold" style={{ color: '#2C3540' }}>Estimated Shortage</span>
              <span className="font-black text-lg" style={{ color: '#BF8888' }}>
                {product.pendingOrders * 50 - product.currentStock} <span className="text-xs font-normal">units</span>
              </span>
            </div>
          </div>
        </div>

        {/* Resolution Options */}
        <div className="space-y-2">
          <button
            onClick={() => onResolve('priority')}
            className="w-full p-3 rounded-xl text-left transition-all active:scale-[0.98]"
            style={{ background: '#8B9EAD', color: 'white' }}
          >
            <div className="flex items-center justify-between mb-0.5">
              <span className="font-bold text-xs">Priority Allocation</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded uppercase font-black" style={{ background: 'rgba(255,255,255,0.25)' }}>AI Recommended</span>
            </div>
            <p className="text-[10px] leading-tight text-white/80">
              Auto-sort by store performance, prioritize high-performing stores
            </p>
          </button>

          <button
            onClick={() => onResolve('split')}
            className="w-full p-3 rounded-xl text-left transition-colors"
            style={{ background: '#ffffff', border: '1px solid #E5E0D8' }}
          >
            <div className="font-bold text-xs mb-0.5" style={{ color: '#2C3540' }}>Proportional Allocation</div>
            <p className="text-[10px] leading-tight" style={{ color: '#9AA0A8' }}>
              Fairly distribute available stock proportionally based on request amounts
            </p>
          </button>
        </div>

        {/* AI Suggestion */}
        <div className="p-2.5 rounded-lg" style={{ background: '#E8F0F5', border: '1px dashed #CCDBE5' }}>
          <div className="flex items-center gap-2 text-[10px] font-medium" style={{ color: '#8B9EAD' }}>
            <TrendingUp className="w-3 h-3" style={{ color: '#8B9EAD' }} />
            <span>AI Analysis: Priority allocation maximizes sales</span>
          </div>
        </div>
      </div>
    </MobileDrawer>
  );
}
