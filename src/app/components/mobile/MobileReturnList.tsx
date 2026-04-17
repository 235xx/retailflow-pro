import { useNavigate } from 'react-router';
import { Package, ChevronRight, Clock } from 'lucide-react';
import { MobileLayout } from './MobileLayout';
import { useAppData } from '../../context/AppDataContext';
import { useMode } from '../../context/ModeContext';
import { F } from '../../colors';

const statusColors: Record<string, { bg: string; text: string; border: string }> = {
  'Pending': { bg: '#F5EDE0', text: '#A87A45', border: '#DECA9A' },
  'Counting': { bg: '#E8F0F5', text: '#8B9EAD', border: '#CCDBE5' },
  'Completed': { bg: '#E5EEEC', text: '#6A9A7A', border: '#C8DDD9' },
};

const statusMap: Record<string, string> = {
  'Pending': 'Pending',
  'Completed': 'Completed',
};

export function MobileReturnList() {
  const navigate = useNavigate();
  const { returnOrders } = useAppData();
  const { isField } = useMode();

  return (
    <MobileLayout>
      <div className="min-h-screen" style={{ background: isField ? F.bg : '#F7F6F4' }}>
        <div
          className="p-4"
          style={{
            background: isField ? F.header : '#F7F6F4',
            borderBottom: `1.5px solid ${isField ? F.border : '#E5E0D8'}`,
          }}
        >
          <h1 className="font-bold text-center" style={{ color: isField ? F.text : '#2C3540' }}>Return Inspection</h1>
        </div>

        <div className="p-4">
          {returnOrders.length === 0 ? (
            <div className="text-center py-12" style={{ color: isField ? F.textSoft : '#9AA0A8' }}>
              <Package className="w-12 h-12 mx-auto mb-4" style={{ color: isField ? F.border : '#E5E0D8' }} />
              <p>No return orders</p>
            </div>
          ) : (
            <div className="space-y-4">
              {returnOrders.map((order) => {
                const totalQty = order.items.reduce((sum, i) => sum + i.quantity, 0);
                const statusText = statusMap[order.status] || order.status;
                return (
                  <div
                    key={order.id}
                    className="rounded-xl p-4 cursor-pointer active:scale-95 transition-all"
                    style={{
                      background: isField ? F.surface : '#ffffff',
                      border: `1.5px solid ${isField ? F.border : '#E5E0D8'}`,
                    }}
                    onClick={() => navigate(`/mobile/return/${order.id}`)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="text-xl font-bold" style={{ color: isField ? F.text : '#2C3540' }}>
                          {order.orderId}
                        </div>
                        <div className="mt-1" style={{ color: isField ? F.textMid : '#9AA0A8' }}>
                          {order.storeName}
                        </div>
                      </div>
                      <span
                        className="text-xs px-3 py-1 rounded-full font-bold"
                        style={{
                          background: statusColors[statusText]?.bg || '#F3F4F6',
                          color: statusColors[statusText]?.text || '#6B7280',
                          border: `1px solid ${statusColors[statusText]?.border || '#D1D5DB'}`,
                        }}
                      >
                        {statusText}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <div className="text-xs" style={{ color: isField ? F.textSoft : '#9AA0A8' }}>Total Qty</div>
                          <div className="text-xl font-bold" style={{ color: isField ? F.accent : '#C4A97A' }}>
                            {totalQty}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1" style={{ color: isField ? F.textMid : '#9AA0A8' }}>
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">{order.date}</span>
                        <ChevronRight className="w-5 h-5" style={{ color: isField ? F.border : '#E5E0D8' }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </MobileLayout>
  );
}
