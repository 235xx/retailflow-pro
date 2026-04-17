import { Smartphone, Monitor, ArrowRight, AlertTriangle } from 'lucide-react';
import { MobileDrawer } from './MobileDrawer';

interface HandoffDialogProps {
  alert: {
    productName: string;
    location: string;
    currentStock: number;
    safetyStock: number;
    status: string;
    severity?: string;
  };
  onOpenDecisionPanel: () => void;
  onDismiss: () => void;
  forceMobile?: boolean;
}

export function HandoffDialog({
  alert,
  onOpenDecisionPanel,
  onDismiss,
  forceMobile,
}: HandoffDialogProps) {
  const stockPercent = Math.min((alert.currentStock / alert.safetyStock) * 100, 100);

  const severityStyle = {
    high:   { bg: '#EFE5E5', border: '#D4AAAA', dotColor: '#BF8888', stockColor: '#BF8888' },
    medium: { bg: '#F5EDE0', border: '#DECA9A', dotColor: '#C4A97A', stockColor: '#A87A45' },
    low:    { bg: '#E8F0F5', border: '#CCDBE5', dotColor: '#9AB3C4', stockColor: '#8B9EAD' },
  };
  const sev = severityStyle[alert.severity as keyof typeof severityStyle] ?? severityStyle.low;

  const barColor = stockPercent === 0 ? '#BF8888' : stockPercent < 30 ? '#C4A97A' : '#8AB5AF';

  return (
    <MobileDrawer
      isOpen={true}
      onClose={onDismiss}
      title="Handoff Details"
      forceMobile={forceMobile}
      footer={
        <div className="space-y-2">
          <button
            onClick={onOpenDecisionPanel}
            className="w-full text-white py-3.5 rounded-xl font-bold text-sm active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            style={{ background: '#8B9EAD' }}
          >
            <Monitor className="w-4 h-4" />
            Open Web Decision Panel
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onDismiss}
            className="w-full py-3 rounded-xl font-bold text-sm transition-colors"
            style={{ background: '#F7F6F4', border: '1px solid #E5E0D8', color: '#9AA0A8' }}
          >
            Handle Later
          </button>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Handoff Header */}
        <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: '#E8F0F5', border: '1px solid #CCDBE5' }}>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#8B9EAD' }}>
              <Smartphone className="w-4 h-4 text-white" />
            </div>
            <ArrowRight className="w-3 h-3" style={{ color: '#9AA0A8' }} />
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#F7F6F4', border: '1px solid #E5E0D8' }}>
              <Monitor className="w-4 h-4" style={{ color: '#8B9EAD' }} />
            </div>
          </div>
          <div>
            <h2 className="text-sm font-bold leading-tight" style={{ color: '#2C3540' }}>Handoff Request</h2>
            <p className="text-[10px] font-medium tracking-tight uppercase" style={{ color: '#9AA0A8' }}>Initiated from Mobile · Requires Desktop Decision</p>
          </div>
        </div>

        {/* Alert Details */}
        <div className="rounded-xl p-3" style={{ background: sev.bg, border: `1px solid ${sev.border}` }}>
          <div className="flex items-center gap-1.5 mb-2">
            <AlertTriangle className="w-3.5 h-3.5" style={{ color: sev.dotColor }} />
            <span className="text-[10px] font-black uppercase tracking-wider" style={{ color: '#9AA0A8' }}>Alert Details</span>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <div className="text-[10px] mb-0.5" style={{ color: '#9AA0A8' }}>Product Name</div>
              <div className="font-bold text-xs truncate" style={{ color: '#2C3540' }}>{alert.productName}</div>
            </div>
            <div>
              <div className="text-[10px] mb-0.5" style={{ color: '#9AA0A8' }}>Current Stock</div>
              <div className="font-bold text-xs" style={{ color: sev.stockColor }}>
                {alert.currentStock} units
              </div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-[10px] mb-1 font-medium" style={{ color: '#9AA0A8' }}>
              <span>Safety Level {alert.safetyStock}</span>
              <span>{Math.round(stockPercent)}%</span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: '#ECEAE5' }}>
              <div
                className="h-full rounded-full transition-all duration-1000"
                style={{ width: `${stockPercent}%`, background: barColor }}
              />
            </div>
          </div>
        </div>
      </div>
    </MobileDrawer>
  );
}
