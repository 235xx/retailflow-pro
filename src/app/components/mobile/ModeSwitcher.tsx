import { useMode } from '../../context/ModeContext';
import { Zap, BarChart2 } from 'lucide-react';
import { F } from '../../colors';

interface ModeSwitcherProps {
  compact?: boolean;
}

export function ModeSwitcher({ compact = false }: ModeSwitcherProps) {
  const { toggleMode, isField } = useMode();

  if (compact) {
    return (
      <button
        onClick={toggleMode}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all"
        style={isField
          ? { background: F.accent, border: `1.5px solid ${F.accentBorder}`, color: F.accentText }
          : { background: 'white', border: '1.5px solid #E5E0D8', color: '#6A7580' }
        }
      >
        {isField ? <Zap className="w-3 h-3" /> : <BarChart2 className="w-3 h-3" />}
        <span className="text-xs font-medium">{isField ? 'Field' : 'Standard'}</span>
      </button>
    );
  }

  return (
    <div
      className="p-3 flex items-center justify-between"
      style={isField
        ? { background: F.accentBg, borderBottom: `1.5px solid ${F.accentBorder}` }
        : { background: '#F7F6F4', borderBottom: '1.5px solid #E5E0D8' }
      }
    >
      <div className="flex items-center gap-2">
        {isField
          ? <Zap className="w-4 h-4" style={{ color: F.accent }} />
          : <BarChart2 className="w-4 h-4" style={{ color: '#8B9EAD' }} />
        }
        <span className="text-sm" style={{ color: isField ? F.text : '#6A7580' }}>
          Current Mode: <span className="font-bold">
            {isField ? '⚡ Field Mode' : '📊 Standard Mode'}
          </span>
        </span>
      </div>
      <button
        onClick={toggleMode}
        className="text-sm px-3 py-1 rounded font-medium transition-all"
        style={isField
          ? { border: `1.5px solid ${F.accentBorder}`, background: F.accent, color: F.accentText }
          : { border: '1.5px solid #8B9EAD', background: '#8B9EAD', color: 'white' }
        }
      >
        Switch →
      </button>
    </div>
  );
}
