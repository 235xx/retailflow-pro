import { CheckCircle, XCircle, Clock, MapPin, Package } from 'lucide-react';
import { MobileDrawer } from './MobileDrawer';

interface DispatchApprovalDialogProps {
  request: {
    id: string;
    productName: string;
    fromStore: string;
    toStore: string;
    quantity: number;
    urgency: 'high' | 'medium' | 'low';
    reason: string;
    requestedBy: string;
    requestedAt: string;
  };
  onApprove: () => void;
  onReject: () => void;
  onClose: () => void;
  forceMobile?: boolean;
}

export function DispatchApprovalDialog({
  request,
  onApprove,
  onReject,
  onClose,
  forceMobile,
}: DispatchApprovalDialogProps) {
  const urgencyConfig = {
    high: { bg: '#EFE5E5', text: '#BF8888', border: '#D4AAAA', label: 'High' },
    medium: { bg: '#F5EDE0', text: '#A87A45', border: '#DECA9A', label: 'Medium' },
    low: { bg: '#E8F0F5', text: '#8B9EAD', border: '#CCDBE5', label: 'Low' },
  };
  const urgency = urgencyConfig[request.urgency];

  return (
    <MobileDrawer
      isOpen={true}
      onClose={onClose}
      title={`Transfer Approval #${request.id.slice(-4)}`}
      forceMobile={forceMobile}
      footer={
        <div className="space-y-2">
          <button
            onClick={onApprove}
            className="w-full text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors"
            style={{ background: '#8AB5AF' }}
          >
            <CheckCircle className="w-4 h-4" />
            Approve
          </button>
          <button
            onClick={onReject}
            className="w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors"
            style={{ background: '#F7F6F4', border: '1px solid #D4AAAA', color: '#BF8888' }}
          >
            <XCircle className="w-4 h-4" />
            Reject
          </button>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Urgency Badge */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider" style={{ color: '#9AA0A8' }}>Priority</span>
          <span
            className="px-3 py-1 rounded-full text-xs font-bold"
            style={{ background: urgency.bg, color: urgency.text, border: `1px solid ${urgency.border}` }}
          >
            {urgency.label}
          </span>
        </div>

        {/* Product Info */}
        <div className="rounded-xl p-3" style={{ background: '#E8F0F5', border: '1px solid #CCDBE5' }}>
          <div className="flex items-center gap-2 mb-2">
            <Package className="w-4 h-4" style={{ color: '#8B9EAD' }} />
            <span className="text-xs font-bold" style={{ color: '#8B9EAD' }}>Product Details</span>
          </div>
          <div className="flex justify-between items-end">
            <div className="font-bold" style={{ color: '#2C3540' }}>{request.productName}</div>
            <div className="font-black text-lg" style={{ color: '#8B9EAD' }}>
              {request.quantity} <span className="text-xs font-normal" style={{ color: '#9AA0A8' }}>units</span>
            </div>
          </div>
        </div>

        {/* Route Info */}
        <div className="rounded-xl p-3" style={{ background: '#F0EDE8', border: '1px solid #E5E0D8' }}>
          <div className="flex items-center gap-2 mb-2" style={{ color: '#8B9EAD' }}>
            <MapPin className="w-4 h-4" />
            <span className="text-xs font-bold">Transfer Route</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-sm font-bold" style={{ color: '#2C3540' }}>{request.fromStore}</div>
            <div className="px-2 font-bold" style={{ color: '#8B9EAD' }}>→</div>
            <div className="text-sm font-bold" style={{ color: '#2C3540' }}>{request.toStore}</div>
          </div>
        </div>

        {/* Request Details */}
        <div className="space-y-2 pt-2">
          <div className="flex justify-between text-xs">
            <span style={{ color: '#9AA0A8' }}>Reason</span>
            <span className="font-medium" style={{ color: '#2C3540' }}>{request.reason}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span style={{ color: '#9AA0A8' }}>Requested At</span>
            <span className="font-medium flex items-center gap-1" style={{ color: '#2C3540' }}>
              <Clock className="w-3 h-3" />
              {request.requestedAt}
            </span>
          </div>
        </div>

        {/* AI Recommendation */}
        <div className="rounded-xl p-3" style={{ background: '#E5EEEC', border: '1px solid #C8DDD9' }}>
          <div className="flex items-start gap-2">
            <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] text-white" style={{ background: '#6A9A7A' }}>
              ✓
            </div>
            <p className="text-[11px] leading-tight" style={{ color: '#4A7A5A' }}>
              <span className="font-bold">System Recommendation: Approve.</span>{' '}
              Target store has high turnover rate, source store has sufficient inventory to fulfill the transfer.
            </p>
          </div>
        </div>
      </div>
    </MobileDrawer>
  );
}
