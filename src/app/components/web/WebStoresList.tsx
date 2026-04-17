import { useNavigate } from 'react-router';
import { AlertTriangle, ChevronRight } from 'lucide-react';
import { mockStores } from '../../data/mockData';
import { WebLayout } from './WebLayout';

export function WebStoresList() {
  const navigate = useNavigate();

  return (
    <WebLayout>
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold" style={{ color: '#2C3540' }}>Store Analysis</h2>
          <p className="text-sm mt-1" style={{ color: '#9AA0A8' }}>Manage all stores in the district</p>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="rounded-xl p-5 text-white" style={{ background: 'linear-gradient(135deg, #8B9EAD, #7A8EA0)' }}>
            <div className="text-3xl font-bold mb-1">{mockStores.length}</div>
            <div className="text-white/80 text-sm">Total Stores</div>
          </div>
          <div className="rounded-xl p-5" style={{ background: '#F7F6F4', border: '1px solid #E5E0D8', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <div className="text-3xl font-bold mb-1" style={{ color: '#2C3540' }}>¥154.5w</div>
            <div className="text-sm" style={{ color: '#9AA0A8' }}>Weekly Sales</div>
          </div>
          <div className="rounded-xl p-5" style={{ background: '#F7F6F4', border: '2px solid #D4AAAA' }}>
            <div className="text-3xl font-bold mb-1" style={{ color: '#BF8888' }}>
              {mockStores.reduce((sum, s) => sum + s.alerts, 0)}
            </div>
            <div className="text-sm" style={{ color: '#9AA0A8' }}>Total Alerts</div>
          </div>
        </div>

        {/* Store Cards */}
        <div className="grid grid-cols-2 gap-4">
          {mockStores.map((store) => (
            <div
              key={store.id}
              className="rounded-xl p-5 cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5"
              style={{ background: '#F7F6F4', border: '1px solid #E5E0D8', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
              onClick={() => navigate(`/web/store/${store.id}`)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm" style={{
                    background: store.rank === 1 ? '#C4A97A' : store.rank === 2 ? '#8AB5AF' : store.rank === 3 ? '#9AB3C4' : '#ECEAE5',
                    color: store.rank <= 3 ? 'white' : '#9AA0A8',
                  }}>
                    #{store.rank}
                  </div>
                  <div>
                    <h3 className="font-bold" style={{ color: '#2C3540' }}>{store.name}</h3>
                    <p className="text-xs" style={{ color: '#9AA0A8' }}>Manager: {store.manager}</p>
                  </div>
                </div>
                {store.alerts > 0 && (
                  <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold" style={{ background: '#EFE5E5', color: '#BF8888', border: '1px solid #D4AAAA' }}>
                    <AlertTriangle className="w-3 h-3" />
                    {store.alerts} Alerts
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="text-xs mb-1" style={{ color: '#9AA0A8' }}>Weekly Sales</div>
                  <div className="text-xl font-bold" style={{ color: '#2C3540' }}>¥{(store.sales / 10000).toFixed(0)}w</div>
                </div>
                <div>
                  <div className="text-xs mb-1" style={{ color: '#9AA0A8' }}>Stock Health</div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold" style={{ color: store.stockHealth < 80 ? '#A87A45' : '#6A9A7A' }}>
                      {store.stockHealth}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div>
                <div className="flex justify-between text-xs mb-1" style={{ color: '#9AA0A8' }}>
                  <span>Sales Target</span>
                  <span>{Math.round((store.sales / 500000) * 100)}%</span>
                </div>
                <div className="h-2 rounded-full" style={{ background: '#ECEAE5' }}>
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${Math.min((store.sales / 500000) * 100, 100)}%`, background: '#8B9EAD' }}
                  />
                </div>
              </div>

              <button
                className="mt-4 w-full flex items-center justify-center gap-1 text-sm py-2 rounded-lg transition-colors"
                style={{ border: '1px solid #E5E0D8', color: '#9AA0A8' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#F0EDE8')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                View Details <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </WebLayout>
  );
}