import { useState, useEffect, ReactNode } from 'react';
import { X } from 'lucide-react';
import { useIsMobile } from '../ui/use-mobile';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  forceMobile?: boolean;
  className?: string;
  headerClassName?: string;
  footerClassName?: string;
}

export function MobileDrawer({
  isOpen,
  onClose,
  title,
  children,
  footer,
  forceMobile,
  className = '',
  headerClassName = '',
  footerClassName = '',
}: MobileDrawerProps) {
  const [visible, setVisible] = useState(false);
  const isMobile = useIsMobile();
  const useMobileLayout = forceMobile || isMobile;

  useEffect(() => {
    if (isOpen) {
      const timer = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(timer);
    } else {
      setVisible(false);
    }
  }, [isOpen]);

  if (!isOpen && !visible) return null;

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 250);
  };

  // Mobile layout: Centered modal
  if (useMobileLayout) {
    return (
      <div
        className="absolute inset-0 z-50 flex items-center justify-center p-6 overflow-hidden"
        onClick={handleClose}
      >
        {/* Morandi dark overlay */}
        <div
          className={`absolute inset-0 transition-opacity duration-250 ease-out ${visible ? 'opacity-100' : 'opacity-0'}`}
          style={{ background: 'rgba(44, 53, 64, 0.48)' }}
        />
        <div
          className={`relative w-full max-w-[320px] rounded-2xl shadow-2xl flex flex-col transition-all duration-250 ease-out ${visible ? 'scale-100 opacity-100 translate-y-0' : 'scale-90 opacity-0 translate-y-4'
            }`}
          style={{ background: '#F7F6F4', border: '1.5px solid #E5E0D8' }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div
            className={`flex items-center justify-between px-4 py-3 ${headerClassName}`}
            style={{ borderBottom: '1px solid #ECEAE5' }}
          >
            <div className="font-bold truncate pr-4" style={{ color: '#2C3540' }}>{title}</div>
            <button
              onClick={handleClose}
              className="w-8 h-8 flex-shrink-0 rounded-full flex items-center justify-center transition-colors"
              style={{ background: '#EDE9E3' }}
              onMouseEnter={e => (e.currentTarget.style.background = '#F0EDE8')}
              onMouseLeave={e => (e.currentTarget.style.background = '#EDE9E3')}
            >
              <X className="w-4 h-4" style={{ color: '#8B9EAD' }} />
            </button>
          </div>

          {/* Content */}
          <div className={`p-4 overflow-y-auto max-h-[60vh] scrollbar-hide ${className}`}>
            {children}
          </div>

          {/* Footer */}
          {footer && (
            <div className={`p-4 space-y-2 ${footerClassName}`} style={{ borderTop: '1px solid #ECEAE5' }}>
              {footer}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Desktop layout: Standard dialog
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={handleClose}
    >
      {/* Morandi dark overlay */}
      <div
        className={`absolute inset-0 transition-opacity duration-250 ${visible ? 'opacity-100' : 'opacity-0'}`}
        style={{ background: 'rgba(44, 53, 64, 0.45)' }}
      />
      <div
        className={`relative rounded-xl shadow-2xl max-w-lg w-full flex flex-col transition-all duration-250 ${visible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
          }`}
        style={{ background: '#F7F6F4', border: '1.5px solid #E5E0D8' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={`flex items-center justify-between p-4 ${headerClassName}`}
          style={{ borderBottom: '1.5px solid #ECEAE5' }}
        >
          <div className="text-xl font-bold" style={{ color: '#2C3540' }}>{title}</div>
          <button
            onClick={handleClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors"
            style={{ background: 'transparent' }}
            onMouseEnter={e => (e.currentTarget.style.background = '#F0EDE8')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            <X className="w-5 h-5" style={{ color: '#8B9EAD' }} />
          </button>
        </div>
        <div className={`p-6 overflow-y-auto max-h-[65vh] ${className}`}>
          {children}
        </div>
        {footer && (
          <div className={`p-4 ${footerClassName}`} style={{ borderTop: '1.5px solid #ECEAE5' }}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
