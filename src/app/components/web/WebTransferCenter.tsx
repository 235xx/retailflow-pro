import { useState } from 'react';
import { useNavigate } from 'react-router';
import { CheckCircle, XCircle, Clock, ChevronRight, Package, AlertTriangle } from 'lucide-react';
import { mockTransfers, Transfer } from '../../data/mockData';
import { WebLayout } from './WebLayout';
import { DispatchApprovalDialog } from '../dialogs/DispatchApprovalDialog';
import { toast } from 'sonner';

const statusConfig: { [key: string]: { bg: string; text: string; border: string; icon: typeof Clock } } = {
  'Pending Approval': { bg: '#F5EDE0', text: '#A87A45', border: '#DECA9A', icon: Clock },
  'In Progress': { bg: '#E8F0F5', text: '#8B9EAD', border: '#CCDBE5', icon: Package },
  'Completed': { bg: '#E5EEEC', text: '#6A9A7A', border: '#C8DDD9', icon: CheckCircle },
  'Rejected': { bg: '#EFE5E5', text: '#BF8888', border: '#D4AAAA', icon: XCircle },
};

const urgencyConfig = {
  high: { label: 'Urgent', bg: '#EFE5E5', text: '#BF8888' },
  medium: { label: 'Medium', bg: '#F5EDE0', text: '#A87A45' },
  low: { label: 'Low', bg: '#F7F6F4', text: '#9AA0A8' },
};

const cardStyle = { background: '#F7F6F4', border: '1px solid #E5E0D8', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' };

export function WebTransferCenter() {
  const navigate = useNavigate();
  const [transfers, setTransfers] = useState<Transfer[]>(mockTransfers);
  const [activeTab, setActiveTab] = useState<string>('All');
  const [selectedTransfer, setSelectedTransfer] = useState<Transfer | null>(null);
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);

  const tabs = ['All', 'Pending Approval', 'In Progress', 'Completed', 'Rejected'];
  const filteredTransfers = transfers.filter(t => activeTab === 'All' || t.status === activeTab);
  const pendingCount = transfers.filter(t => t.status === 'Pending Approval').length;

  const handleApprove = (id: string) => {
    setTransfers(prev => prev.map(t => t.id === id ? { ...t, status: 'In Progress' } : t));
    setShowApprovalDialog(false);
    toast.success('Transfer approved', { description: 'Execution process initiated' });
  };

  const handleReject = (id: string) => {
    setTransfers(prev => prev.map(t => t.id === id ? { ...t, status: 'Rejected' } : t));
    setShowApprovalDialog(false);
    toast.error('Transfer rejected');
  };

  const openApproval = (transfer: Transfer) => {
    setSelectedTransfer(transfer);
    setShowApprovalDialog(true);
  };

  const statCards = [
    { label: 'Pending', count: transfers.filter(t => t.status === 'Pending Approval').length, bg: '#F5EDE0', border: '#DECA9A', text: '#A87A45' },
    { label: 'In Progress', count: transfers.filter(t => t.status === 'In Progress').length, bg: '#E8F0F5', border: '#CCDBE5', text: '#8B9EAD' },
    { label: 'Completed', count: transfers.filter(t => t.status === 'Completed').length, bg: '#E5EEEC', border: '#C8DDD9', text: '#6A9A7A' },
    { label: 'Rejected', count: transfers.filter(t => t.status === 'Rejected').length, bg: '#EFE5E5', border: '#D4AAAA', text: '#BF8888' },
  ];

  return (
    <WebLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold" style={{ color: '#2C3540' }}>Transfer Center</h2>
            <p className="text-sm mt-1" style={{ color: '#9AA0A8' }}>Manage cross-store inventory transfer requests</p>
          </div>
          <div className="flex items-center gap-3">
            {pendingCount > 0 && (
              <div
                className="flex items-center gap-2 px-4 py-2 rounded-xl"
                style={{ background: '#EFE5E5', border: '1.5px solid #D4AAAA' }}
              >
                <AlertTriangle className="w-4 h-4" style={{ color: '#BF8888' }} />
                <span className="font-bold" style={{ color: '#BF8888' }}>{pendingCount} Pending</span>
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {statCards.map(stat => (
            <div key={stat.label} className="rounded-xl p-4" style={cardStyle}>
              <div className="text-3xl font-bold mb-1" style={{ color: stat.text }}>{stat.count}</div>
              <div className="text-sm" style={{ color: '#6A7580' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-4 p-1 rounded-xl w-fit" style={{ background: '#F7F6F4', border: '1px solid #E5E0D8' }}>
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
              style={{
                background: activeTab === tab ? '#ffffff' : 'transparent',
                color: activeTab === tab ? '#2C3540' : '#9AA0A8',
                boxShadow: activeTab === tab ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
              }}
            >
              {tab}
              {tab === 'Pending Approval' && pendingCount > 0 && (
                <span
                  className="ml-1.5 text-white text-xs w-4 h-4 rounded-full inline-flex items-center justify-center"
                  style={{ background: '#BF8888' }}
                >
                  {pendingCount}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Transfer List */}
        <div className="rounded-xl overflow-hidden" style={cardStyle}>
          {/* Table Header */}
          <div
            className="grid grid-cols-8 gap-4 px-5 py-3 text-xs font-bold uppercase tracking-wide"
            style={{ background: '#EDE9E3', color: '#9AA0A8', borderBottom: '1px solid #E5E0D8' }}
          >
            <div className="col-span-2">Product</div>
            <div className="col-span-2">Route</div>
            <div>Qty</div>
            <div>Urgency</div>
            <div>Status</div>
            <div>Action</div>
          </div>

          {/* Rows */}
          <div>
            {filteredTransfers.map((transfer) => {
              const status = statusConfig[transfer.status];
              const StatusIcon = status.icon;
              const urgency = urgencyConfig[transfer.urgency];
              return (
                <div
                  key={transfer.id}
                  className="grid grid-cols-8 gap-4 px-5 py-4 items-center transition-colors"
                  style={{
                    borderBottom: '1px solid #ECEAE5',
                    background: transfer.status === 'Pending Approval' ? '#FDFCFA' : 'transparent',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#F0EDE8')}
                  onMouseLeave={e => (e.currentTarget.style.background = transfer.status === 'Pending Approval' ? '#FDFCFA' : 'transparent')}
                >
                  {/* Product */}
                  <div className="col-span-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: '#E8F0F5' }}>
                        <Package className="w-4 h-4" style={{ color: '#8B9EAD' }} />
                      </div>
                      <div className="min-w-0">
                        <div className="font-medium text-sm truncate" style={{ color: '#2C3540' }}>{transfer.productName}</div>
                        <div className="text-xs" style={{ color: '#9AA0A8' }}>{transfer.sku}</div>
                      </div>
                    </div>
                  </div>

                  {/* Route */}
                  <div className="col-span-2">
                    <div className="flex items-center gap-2 text-sm">
                      <span style={{ color: '#9AA0A8' }} className="truncate">{transfer.fromStore}</span>
                      <span style={{ color: '#8B9EAD' }} className="flex-shrink-0">→</span>
                      <span className="font-medium truncate" style={{ color: '#2C3540' }}>{transfer.toStore}</span>
                    </div>
                    <div className="text-xs mt-0.5" style={{ color: '#9AA0A8' }}>{transfer.requestedAt}</div>
                  </div>

                  {/* Quantity */}
                  <div className="font-bold" style={{ color: '#2C3540' }}>
                    {transfer.quantity} <span className="text-xs font-normal" style={{ color: '#9AA0A8' }}>units</span>
                  </div>

                  {/* Urgency */}
                  <div>
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: urgency.bg, color: urgency.text }}>
                      {urgency.label}
                    </span>
                  </div>

                  {/* Status */}
                  <div>
                    <span
                      className="flex items-center gap-1 text-xs px-2 py-1 rounded-full font-medium w-fit"
                      style={{ background: status.bg, color: status.text, border: `1px solid ${status.border}` }}
                    >
                      <StatusIcon className="w-3 h-3" />
                      {transfer.status}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5">
                    {transfer.status === 'Pending Approval' ? (
                      <button
                        onClick={() => openApproval(transfer)}
                        className="text-xs text-white w-14 py-1.5 rounded-lg font-bold text-center transition-colors"
                        style={{ background: '#8B9EAD' }}
                      >
                        Approve
                      </button>
                    ) : (
                      <span className="inline-block w-14 py-1.5 text-xs" aria-hidden />
                    )}
                    <button
                      onClick={() => navigate(`/web/product/${transfer.id}`)}
                      className="text-xs w-14 py-1.5 rounded-lg font-medium text-center transition-colors"
                      style={{ border: '1.5px solid #E5E0D8', color: '#6A7580' }}
                      onMouseEnter={e => (e.currentTarget.style.background = '#F0EDE8')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      Details
                    </button>
                  </div>
                </div>
              );
            })}

            {filteredTransfers.length === 0 && (
              <div className="text-center py-12" style={{ color: '#9AA0A8' }}>
                <Package className="w-10 h-10 mx-auto mb-3" style={{ color: '#E5E0D8' }} />
                <p className="text-sm">No transfer records</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {showApprovalDialog && selectedTransfer && (
        <DispatchApprovalDialog
          request={{
            id: selectedTransfer.id,
            productName: selectedTransfer.productName,
            fromStore: selectedTransfer.fromStore,
            toStore: selectedTransfer.toStore,
            quantity: selectedTransfer.quantity,
            urgency: selectedTransfer.urgency,
            reason: selectedTransfer.reason,
            requestedBy: selectedTransfer.requestedBy,
            requestedAt: selectedTransfer.requestedAt,
          }}
          onApprove={() => handleApprove(selectedTransfer.id)}
          onReject={() => handleReject(selectedTransfer.id)}
          onClose={() => setShowApprovalDialog(false)}
        />
      )}
    </WebLayout>
  );
}