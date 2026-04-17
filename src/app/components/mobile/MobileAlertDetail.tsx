import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ArrowLeft, TrendingUp, Share2, Zap, Clock, Package } from 'lucide-react';
import { mockAlerts, salesTrendData } from '../../data/mockData';
import { HandoffDialog } from '../dialogs/HandoffDialog';
import { MobileLayout } from './MobileLayout';
import { ModeSwitcher } from './ModeSwitcher';
import { useMode } from '../../context/ModeContext';
import { F } from '../../colors';

export function MobileAlertDetail() {
  const navigate = useNavigate();
  const { alertId } = useParams();
  const { isField } = useMode();
  const [showHandoffDialog, setShowHandoffDialog] = useState(false);

  const alert = mockAlerts.find(a => a.id === alertId);

  if (!alert) {
    return (
      <MobileLayout showNav={false}>
        <div className="flex items-center justify-center h-screen" style={{ background: isField ? F.bg : '#ffffff' }}>
          <div className="text-center">
            <div className="text-5xl mb-4" style={{ color: isField ? F.textSoft : '#9AA0A8' }}>⊗</div>
            <p style={{ color: isField ? F.textMid : '#9AA0A8' }}>Alert not found</p>
            <button
              onClick={() => navigate('/mobile')}
              className="mt-4 px-4 py-2 rounded-lg"
              style={{ background: isField ? F.accent : '#8B9EAD', color: isField ? F.accentText : 'white' }}
            >
              Back to Home
            </button>
          </div>
        </div>
      </MobileLayout>
    );
  }

  const stockPercentage = Math.min((alert.currentStock / alert.safetyStock) * 100, 100);
  const daysLeft = alert.dailySales > 0 ? Math.floor(alert.currentStock / alert.dailySales) : 99;
  const suggestQty = alert.safetyStock - alert.currentStock + alert.dailySales * 7;

  // ── Field Mode ──────────────────────────────────────────────
  if (isField) {
    const bannerBg = alert.status === 'OUT_OF_STOCK' ? F.alertHighBg :
      alert.status === 'URGENT' ? F.alertHighBg : F.alertMedBg;
    const bannerBorder = alert.status === 'OUT_OF_STOCK' ? F.alertHighBorder :
      alert.status === 'URGENT' ? F.alertHighBorder : F.alertMedBorder;

    return (
      <MobileLayout showNav={false}>
        <div className="min-h-screen" style={{ background: F.bg }}>

          {/* Header */}
          <div className="p-4 flex items-center justify-between" style={{ background: F.header, borderBottom: `1.5px solid ${F.border}` }}>
            <button onClick={() => navigate('/mobile')} className="flex items-center gap-2" style={{ color: F.accent }}>
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </button>
            <div className="flex items-center gap-1 text-sm font-bold" style={{ color: F.accent }}>
              <Zap className="w-4 h-4" /> Field Mode
            </div>
            <ModeSwitcher compact />
          </div>

          {/* Status Banner */}
          <div className="p-4" style={{ background: bannerBg, borderBottom: `2px solid ${bannerBorder}` }}>
            <div className="text-sm mb-1 font-bold" style={{ color: bannerBorder }}>
              {alert.status === 'OUT_OF_STOCK' ? '❌ Out of Stock' :
                alert.status === 'URGENT' ? '🚨 Urgent Alert' : '⚠️ Low Stock'}
            </div>
            <div className="text-3xl font-bold mb-1" style={{ color: F.text }}>{alert.productName}</div>
            <div style={{ color: F.textMid }}>{alert.location}</div>
          </div>

          <div className="p-4 space-y-4">
            {/* Big Numbers */}
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl p-4 text-center" style={{ background: F.surface, border: `2px solid ${F.alertHighBorder}` }}>
                <div className="text-sm mb-1" style={{ color: F.textSoft }}>Current Stock</div>
                <div className="text-5xl font-bold" style={{ color: alert.currentStock === 0 ? F.alertHighBorder : F.accent }}>
                  {alert.currentStock}
                </div>
                <div className="text-sm mt-1" style={{ color: F.textSoft }}>units</div>
              </div>
              <div className="rounded-xl p-4 text-center" style={{ background: F.surface, border: `2px solid ${F.border}` }}>
                <div className="text-sm mb-1" style={{ color: F.textSoft }}>Daily Sales</div>
                <div className="text-5xl font-bold" style={{ color: F.text }}>{alert.dailySales}</div>
                <div className="text-sm mt-1" style={{ color: F.textSoft }}>units/day</div>
              </div>
            </div>

            {/* Days Left */}
            <div
              className="rounded-xl p-4"
              style={{
                background: daysLeft <= 1 ? F.alertHighBg : daysLeft <= 3 ? F.alertMedBg : F.surface,
                border: `2px solid ${daysLeft <= 1 ? F.alertHighBorder : daysLeft <= 3 ? F.alertMedBorder : F.border}`,
              }}
            >
              <div className="flex items-center gap-3">
                <Clock className="w-8 h-8" style={{ color: daysLeft <= 1 ? F.alertHighBorder : daysLeft <= 3 ? F.alertMedBorder : F.textMid }} />
                <div>
                  <div className="text-sm" style={{ color: F.textMid }}>Est. Days Left</div>
                  <div
                    className="text-3xl font-bold"
                    style={{ color: daysLeft <= 1 ? F.alertHighBorder : daysLeft <= 3 ? F.alertMedBorder : F.text }}
                  >
                    {daysLeft <= 0 ? 'Out of Stock' : `${daysLeft} days`}
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="rounded-xl p-4" style={{ background: F.surface }}>
              <div className="flex justify-between text-sm mb-2" style={{ color: F.textMid }}>
                <span>Stock Status</span>
                <span>{alert.currentStock} / {alert.safetyStock} safety level</span>
              </div>
              <div className="h-4 rounded-full overflow-hidden" style={{ background: F.borderLight }}>
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${stockPercentage}%`,
                    background: stockPercentage === 0 ? F.alertHighBorder :
                      stockPercentage < 30 ? F.alertMedBorder : F.successBorder,
                  }}
                />
              </div>
              <div className="text-xs mt-1" style={{ color: F.textSoft }}>{stockPercentage.toFixed(0)}%</div>
            </div>

            {/* Recommendation */}
            <div className="rounded-xl p-4" style={{ background: F.accentBg, border: `2px solid ${F.accentBorder}` }}>
              <div className="font-bold mb-2" style={{ color: F.accent }}>💡 Urgent Recommendation</div>
              <div style={{ color: F.text }}>
                Restock <span className="text-2xl font-bold" style={{ color: F.accent }}>{suggestQty}</span> units immediately
              </div>
              <div className="text-sm mt-2" style={{ color: F.textMid }}>= Safety Stock + 7 days sales</div>
            </div>

            {/* CTA Buttons */}
            <button
              onClick={() => setShowHandoffDialog(true)}
              className="w-full py-5 font-bold rounded-xl flex items-center justify-center gap-2"
              style={{ background: F.accent, color: F.accentText }}
            >
              <TrendingUp className="w-5 h-5" />
              🖥 Handoff to Web
            </button>

            <button
              onClick={() => navigate('/mobile/inbound')}
              className="w-full py-4 font-bold rounded-xl flex items-center justify-center gap-2"
              style={{ background: F.surfaceLight, border: `2px solid ${F.border}`, color: F.text }}
            >
              📦 Create Restock Request
            </button>
          </div>
        </div>

        {showHandoffDialog && (
          <HandoffDialog
            alert={alert}
            onOpenDecisionPanel={() => { navigate(`/web/product/${alert.id}`); setShowHandoffDialog(false); }}
            onDismiss={() => setShowHandoffDialog(false)}
            forceMobile
          />
        )}
      </MobileLayout>
    );
  }

  // ── Standard Mode ───────────────────────────────────────────
  return (
    <MobileLayout showNav={false}>
      <div className="min-h-screen" style={{ background: '#F7F6F4' }}>
        {/* Header */}
        <div className="p-4 flex items-center justify-between sticky top-0 z-10" style={{ background: '#F7F6F4', borderBottom: '1.5px solid #E5E0D8' }}>
          <button onClick={() => navigate('/mobile')} className="flex items-center gap-1" style={{ color: '#9AA0A8' }}>
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm">Back</span>
          </button>
          <span className="font-bold text-sm" style={{ color: '#2C3540' }}>Stock Alert Detail</span>
          <button style={{ color: '#9AA0A8' }}>
            <Share2 className="w-5 h-5" />
          </button>
        </div>

        <ModeSwitcher />

        <div className="p-4">
          {/* Status Badge */}
          <div className="flex items-center gap-2 mb-4">
            <span className="px-3 py-1.5 rounded-full text-sm font-bold text-white" style={{
              background: alert.status === 'OUT_OF_STOCK' ? '#BF8888' : alert.status === 'URGENT' ? '#BF8888' : '#C4A97A'
            }}>
              {alert.status === 'OUT_OF_STOCK' ? '❌ Out of Stock' : alert.status === 'URGENT' ? '🚨 Urgent' : '⚠️ Low Stock'}
            </span>
            <span className="text-sm" style={{ color: '#8B9EAD' }}>{alert.category}</span>
          </div>

          {/* Product Info */}
          <div className="flex gap-4 mb-4 rounded-xl p-4" style={{ background: '#F7F6F4', border: '1px solid #E5E0D8' }}>
            <div className="w-20 h-20 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: '#E8F0F5' }}>
              <Package className="w-10 h-10" style={{ color: '#8B9EAD' }} />
            </div>
            <div className="flex-1">
              <h2 className="font-bold mb-1" style={{ color: '#2C3540' }}>{alert.productName}</h2>
              <div className="text-sm mb-1" style={{ color: '#8B9EAD' }}>📍 {alert.location}</div>
              <div className="text-sm" style={{ color: '#9AA0A8' }}>SKU: {alert.sku}</div>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-white rounded-xl p-4" style={{ border: `1.5px solid ${alert.currentStock === 0 ? '#D4AAAA' : '#DECA9A'}` }}>
              <div className="text-sm mb-1" style={{ color: '#9AA0A8' }}>Current Stock</div>
              <div className="text-4xl font-bold mb-1" style={{ color: alert.currentStock === 0 ? '#BF8888' : '#A87A45' }}>
                {alert.currentStock}<span style={{ fontSize: '1.1rem', marginLeft: '4px' }}>units</span>
              </div>
              <div className="text-xs" style={{ color: '#BF8888' }}>Below safety level</div>
            </div>
            <div className="bg-white rounded-xl p-4" style={{ border: '1.5px solid #CCDBE5' }}>
              <div className="text-sm mb-1" style={{ color: '#9AA0A8' }}>24H Sales</div>
              <div className="text-4xl font-bold mb-1" style={{ color: '#8B9EAD' }}>
                {alert.dailySales}<span style={{ fontSize: '1.1rem', marginLeft: '4px' }}>units</span>
              </div>
              <div className="text-xs flex items-center gap-1" style={{ color: alert.trend > 0 ? '#6A9A7A' : '#BF8888' }}>
                <TrendingUp className="w-3 h-3" />
                {alert.trend > 0 ? '+' : ''}{alert.trend}% vs last period
              </div>
            </div>
          </div>

          {/* Stock Progress Bar */}
          <div className="rounded-xl p-4 mb-4" style={{ background: '#F7F6F4', border: '1px solid #E5E0D8' }}>
            <div className="flex justify-between text-sm mb-2">
              <span className="font-bold" style={{ color: '#2C3540' }}>Stock Health</span>
              <span style={{ color: '#9AA0A8' }}>{alert.currentStock}/{alert.safetyStock}</span>
            </div>
            <div className="h-3 rounded-full overflow-hidden mb-1" style={{ background: '#ECEAE5' }}>
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${stockPercentage}%`,
                  background: stockPercentage === 0 ? '#BF8888' : stockPercentage < 30 ? '#C4A97A' : '#8AB5AF',
                }}
              />
            </div>
            <div className="flex justify-between text-xs" style={{ color: '#9AA0A8' }}>
              <span>0</span>
              <span>Safety Level: {alert.safetyStock} units</span>
            </div>
          </div>

          {/* Sales Trend Chart */}
          <div className="rounded-xl p-4 mb-4" style={{ border: '1.5px solid #E5E0D8' }}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" style={{ color: '#8B9EAD' }} />
                <span className="font-bold" style={{ color: '#2C3540' }}>7-Day Sales Trend</span>
              </div>
              <span className="text-xs" style={{ color: '#9AA0A8' }}>Unit: units</span>
            </div>
            <div className="h-40 relative">
              <svg className="w-full h-full" viewBox="0 0 350 120" preserveAspectRatio="none">
                {[0, 1, 2, 3].map(i => (
                  <line key={i} x1="0" y1={i * 30 + 5} x2="350" y2={i * 30 + 5} stroke="#ECEAE5" strokeWidth="1" />
                ))}
                <defs>
                  <linearGradient id="trend-gradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8B9EAD" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#8B9EAD" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <polygon
                  points={[
                    ...salesTrendData.map((d, i) =>
                      `${(i / (salesTrendData.length - 1)) * 340 + 5},${105 - (d.value / 100) * 90}`
                    ),
                    `${340 + 5},115`,
                    `5,115`
                  ].join(' ')}
                  fill="url(#trend-gradient)"
                />
                <polyline
                  points={salesTrendData.map((d, i) =>
                    `${(i / (salesTrendData.length - 1)) * 340 + 5},${105 - (d.value / 100) * 90}`
                  ).join(' ')}
                  fill="none" stroke="#8B9EAD" strokeWidth="2"
                />
                {salesTrendData.map((d, i) => (
                  <circle key={i}
                    cx={(i / (salesTrendData.length - 1)) * 340 + 5}
                    cy={105 - (d.value / 100) * 90}
                    r="4" fill="white" stroke="#8B9EAD" strokeWidth="2"
                  />
                ))}
                {salesTrendData.map((d, i) => (
                  <text key={i}
                    x={(i / (salesTrendData.length - 1)) * 340 + 5}
                    y="118" textAnchor="middle" fontSize="9" fill="#9AA0A8"
                  >
                    {d.day}
                  </text>
                ))}
              </svg>
            </div>
          </div>

          {/* System Recommendation */}
          <div className="rounded-xl p-4 mb-4" style={{ background: '#E8F0F5', border: '1.5px solid #CCDBE5' }}>
            <div className="flex items-start gap-3">
              <div className="text-2xl">💡</div>
              <div>
                <div className="font-bold mb-1" style={{ color: '#2C3540' }}>System Recommendation</div>
                <p className="text-sm" style={{ color: '#6A7580' }}>
                  Recommend restocking <span className="font-bold" style={{ color: '#8B9EAD' }}>{Math.max(alert.safetyStock * 2 - alert.currentStock, alert.dailySales * 14)}</span> units immediately.
                  Based on current sales rate, stock will be depleted in <span className="font-bold" style={{ color: '#BF8888' }}>{daysLeft}</span> days.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => setShowHandoffDialog(true)}
              className="w-full text-white py-4 font-bold rounded-xl flex items-center justify-center gap-2"
              style={{ background: '#8B9EAD' }}
            >
              <TrendingUp className="w-5 h-5" />
              Handoff → Web Dashboard
            </button>
            <button
              onClick={() => navigate('/mobile/inbound')}
              className="w-full py-3 flex items-center justify-center gap-2 font-bold rounded-xl"
              style={{ border: '1.5px solid #8B9EAD', color: '#8B9EAD', background: 'white' }}
            >
              Quick Restock
            </button>
            <button
              className="w-full py-3 flex items-center justify-center gap-2 font-bold rounded-xl"
              style={{ border: '1.5px solid #E5E0D8', color: '#9AA0A8', background: 'white' }}
            >
              <Share2 className="w-4 h-4" />
              Share Alert
            </button>
          </div>
        </div>
      </div>

      {showHandoffDialog && (
        <HandoffDialog
          alert={alert}
          onOpenDecisionPanel={() => { navigate(`/web/product/${alert.id}`); setShowHandoffDialog(false); }}
          onDismiss={() => setShowHandoffDialog(false)}
          forceMobile
        />
      )}
    </MobileLayout>
  );
}