import { useNavigate, useLocation } from 'react-router';
import { Monitor, Smartphone } from 'lucide-react';

export function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();

  // Hide on welcome page - it has its own navigation
  if (location.pathname === '/') return null;

  const isMobile = location.pathname.startsWith('/mobile');
  const isWeb = location.pathname.startsWith('/web');

  // Show a floating switch button only on route pages
  // (Mobile has its own bottom nav, Web has its sidebar)
  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isWeb && (
        <button
          onClick={() => navigate('/mobile')}
          className="bg-black text-white px-4 py-3 rounded-full shadow-lg flex items-center gap-2 hover:bg-gray-800 transition-colors"
          title="Switch to Mobile"
        >
          <Smartphone className="w-4 h-4" />
          <span className="text-sm font-bold">Mobile</span>
        </button>
      )}
    </div>
  );
}
