import { useState, useRef } from 'react';
import { ChevronRight, Check } from 'lucide-react';
import { useMode } from '../../context/ModeContext';

interface SlideToConfirmProps {
  label?: string;
  onConfirm: () => void;
  color?: 'black' | 'red' | 'green' | 'blue';
}

// Morandi color scheme - using inline styles to avoid Tailwind purge issues
const colorStyles = {
  black: {
    trackBg: '#F4F3F0',
    trackBorder: '#C8C4BC',
    fill: '#5A5E68',
    handle: '#5A5E68',
    text: '#4A4E58',
    labelText: '#7A7E88',
  },
  red: {
    trackBg: '#EFE5E5',   // dusty rose light
    trackBorder: '#D4AAAA',
    fill: '#BF8888',   // morandi dusty rose
    handle: '#BF8888',
    text: '#A07070',
    labelText: '#C09090',
  },
  green: {
    trackBg: '#E5EEEC',   // misty green light
    trackBorder: '#C8DDD9',
    fill: '#8AB5AF',   // morandi misty green
    handle: '#8AB5AF',
    text: '#6A9A7A',
    labelText: '#88B0A0',
  },
  blue: {
    trackBg: '#E8F0F5',   // steel blue light
    trackBorder: '#CCDBE5',
    fill: '#8B9EAD',   // morandi steel blue
    handle: '#8B9EAD',
    text: '#6A8090',
    labelText: '#8A9EAD',
  },
};

export function SlideToConfirm({ label = 'Slide right to confirm', onConfirm, color = 'black' }: SlideToConfirmProps) {
  const { isField } = useMode();
  const [progress, setProgress] = useState(0);
  const [confirmed, setConfirmed] = useState(false);
  const isDragging = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const c = colorStyles[color];
  const height = isField ? 64 : 56;

  const getX = (e: React.MouseEvent | React.TouchEvent) => {
    if ('touches' in e) return e.touches[0].clientX;
    return e.clientX;
  };

  const handleStart = () => { isDragging.current = true; };

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = getX(e);
    const p = Math.min(Math.max((x - rect.left) / rect.width, 0), 1);
    setProgress(p);
  };

  const handleEnd = () => {
    isDragging.current = false;
    if (progress > 0.85) {
      setConfirmed(true);
      setTimeout(() => onConfirm(), 300);
    } else {
      setProgress(0);
    }
  };

  // ── Confirmed State ──────────────────────────────────────
  if (confirmed) {
    return (
      <div
        className="flex items-center justify-center gap-2 rounded-xl"
        style={{
          height,
          background: c.fill,
          border: `2px solid ${c.handle}`,
        }}
      >
        <Check className="w-6 h-6 text-white" />
        <span className="text-white font-bold">Confirmed</span>
      </div>
    );
  }

  return (
    <div className="select-none">
      <p
        className="text-center mb-2"
        style={{
          fontSize: isField ? '0.875rem' : '0.8125rem',
          color: isField ? '#8A8E9A' : c.labelText,
        }}
      >
        {label}
      </p>
      <div
        ref={containerRef}
        className="relative overflow-hidden cursor-pointer rounded-xl"
        style={{
          height,
          background: c.trackBg,
          border: `${isField ? '2.5px' : '1.5px'} solid ${c.trackBorder}`,
        }}
        onMouseDown={handleStart}
        onMouseMove={handleMove}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        onTouchStart={handleStart}
        onTouchMove={handleMove}
        onTouchEnd={handleEnd}
      >
        {/* Fill layer */}
        <div
          className="absolute inset-y-0 left-0 transition-all"
          style={{
            width: `${progress * 100}%`,
            background: c.fill,
            opacity: 0.18,
          }}
        />

        {/* Handle */}
        <div
          className="absolute inset-y-0 flex items-center transition-all"
          style={{
            left: `${progress * ((containerRef.current?.offsetWidth ?? 0) - 56)}px`,
          }}
        >
          <div
            className="w-12 mx-1 flex items-center justify-center rounded-lg shadow-sm"
            style={{
              height: height - 8,
              background: c.handle,
              color: 'white',
            }}
          >
            <ChevronRight className="w-6 h-6" />
          </div>
        </div>

        {/* Center label — fades as handle moves */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none font-bold"
          style={{
            fontSize: isField ? '0.9375rem' : '0.8125rem',
            color: c.text,
            opacity: Math.max(0, 1 - progress * 2.5),
          }}
        >
          → Slide to Confirm →
        </div>
      </div>
    </div>
  );
}
