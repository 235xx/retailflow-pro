import { useNavigate } from 'react-router';
import { Monitor, Smartphone, TrendingUp, Package, BarChart3, AlertTriangle, ArrowRight, Zap, RefreshCw } from 'lucide-react';

export function WelcomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: '#F7F6F4' }}>
      <div className="max-w-5xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full mb-6" style={{ background: '#8B9EAD' }}>
            <Package className="w-5 h-5 text-white" />
            <span className="font-bold tracking-wide text-white">RetailFlow Pro</span>
            <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{ background: 'rgba(255,255,255,0.3)', color: 'white' }}>v1.0</span>
          </div>
          <h1 className="text-5xl font-bold mb-4 tracking-tight" style={{ color: '#2C3540' }}>Retail Flow Management</h1>
          <p className="text-xl mb-2" style={{ color: '#6A7580' }}>Smart Inventory · Real-time Alerts · Efficient Transfers</p>
          <p className="text-sm" style={{ color: '#9AA0A8' }}>2026-04-16 · Shanghai Region</p>
        </div>

        {/* Platform Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          {/* Web Platform */}
          <div
            onClick={() => navigate('/web')}
            className="group rounded-2xl p-8 cursor-pointer transition-all hover:-translate-y-1 hover:shadow-xl"
            style={{ background: '#ffffff', border: '1px solid #E5E0D8', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
          >
            <div className="flex items-center gap-4 mb-6">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform"
                style={{ background: '#8B9EAD' }}
              >
                <Monitor className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold" style={{ color: '#2C3540' }}>Web Dashboard</h2>
                <p className="text-sm" style={{ color: '#9AA0A8' }}>For regional managers / store managers</p>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              {[
                { icon: BarChart3, color: '#8B9EAD', bg: '#E8F0F5', title: 'Dashboard Overview', desc: 'Core KPIs, alerts focus, store ranking, sales trends' },
                { icon: Package, color: '#6A9A7A', bg: '#E5EEEC', title: 'Inventory & Store Details', desc: 'Real-time inventory, sales analysis, anomaly handling' },
                { icon: TrendingUp, color: '#8B9EAD', bg: '#E8F0F5', title: 'Transfer Center & Approval', desc: 'Pending approval, in progress, conflict resolution' },
              ].map(({ icon: Icon, color, bg, title, desc }) => (
                <div key={title} className="flex items-start gap-3 p-3 rounded-xl" style={{ background: bg }}>
                  <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color }} />
                  <div>
                    <div className="font-bold text-sm" style={{ color: '#2C3540' }}>{title}</div>
                    <div className="text-xs" style={{ color: '#9AA0A8' }}>{desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <button
              className="w-full text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors"
              style={{ background: '#8B9EAD' }}
            >
              Enter Web Dashboard
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Mobile Platform */}
          <div
            onClick={() => navigate('/mobile')}
            className="group rounded-2xl p-8 cursor-pointer transition-all hover:-translate-y-1 hover:shadow-xl"
            style={{ background: '#ffffff', border: '1px solid #E5E0D8', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
          >
            <div className="flex items-center gap-4 mb-6">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform"
                style={{ background: '#8AB5AF' }}
              >
                <Smartphone className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold" style={{ color: '#2C3540' }}>Mobile App</h2>
                <p className="text-sm" style={{ color: '#9AA0A8' }}>For store managers / warehouse staff</p>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              {[
                { icon: AlertTriangle, color: '#BF8888', bg: '#EFE5E5', title: 'Alert Cards', desc: 'Urgent alerts, pending tasks, handoff relay' },
                { icon: Package, color: '#8B9EAD', bg: '#E8F0F5', title: 'Inbound & Return Inspection', desc: 'Slide to confirm, anomaly reporting, photo capture' },
                { icon: Zap, color: '#C4A97A', bg: '#F5EDE0', title: 'Dual Mode Switch', desc: 'Standard/Field mode with global sync' },
              ].map(({ icon: Icon, color, bg, title, desc }) => (
                <div key={title} className="flex items-start gap-3 p-3 rounded-xl" style={{ background: bg }}>
                  <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color }} />
                  <div>
                    <div className="font-bold text-sm" style={{ color: '#2C3540' }}>{title}</div>
                    <div className="text-xs" style={{ color: '#9AA0A8' }}>{desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <button
              className="w-full text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors"
              style={{ background: '#8AB5AF' }}
            >
              Enter Mobile App
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Features */}
        <div className="rounded-2xl p-8" style={{ background: '#ffffff', border: '1px solid #E5E0D8', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <h3 className="text-xl font-bold mb-6 text-center" style={{ color: '#2C3540' }}>Core Features</h3>
          <div className="grid grid-cols-4 gap-6 text-center">
            {[
              { icon: BarChart3, bg: '#E8F0F5', color: '#8B9EAD', title: 'Real-time Dashboard', desc: 'Multi-dimensional KPI monitoring' },
              { icon: AlertTriangle, bg: '#EFE5E5', color: '#BF8888', title: 'Smart Alerts', desc: 'Auto-trigger for stock issues' },
              { icon: RefreshCw, bg: '#E5EEEC', color: '#6A9A7A', title: 'Handoff Relay', desc: 'Mobile to Web seamless switch' },
              { icon: Zap, bg: '#F5EDE0', color: '#C4A97A', title: 'Dual Mode Sync', desc: 'Full-page synchronized switching' },
            ].map(({ icon: Icon, bg, color, title, desc }) => (
              <div key={title} className="group">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform" style={{ background: bg }}>
                  <Icon className="w-6 h-6" style={{ color }} />
                </div>
                <div className="font-bold text-sm mb-1" style={{ color: '#2C3540' }}>{title}</div>
                <div className="text-xs" style={{ color: '#9AA0A8' }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-6 text-sm" style={{ color: '#9AA0A8' }}>
          RetailFlow Pro v1.0 · 2026-04-16 · Shanghai Region Management System
        </div>
      </div>
    </div>
  );
}