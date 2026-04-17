import { createContext, useContext, useState, ReactNode } from 'react';

export type AppMode = 'standard' | 'field';

interface ModeContextType {
  mode: AppMode;
  setMode: (mode: AppMode) => void;
  toggleMode: () => void;
  isField: boolean;
}

const ModeContext = createContext<ModeContextType>({
  mode: 'standard',
  setMode: () => {},
  toggleMode: () => {},
  isField: false,
});

export function ModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<AppMode>('standard');

  const toggleMode = () => setMode(m => m === 'standard' ? 'field' : 'standard');

  return (
    <ModeContext.Provider value={{ mode, setMode, toggleMode, isField: mode === 'field' }}>
      {children}
    </ModeContext.Provider>
  );
}

export function useMode() {
  return useContext(ModeContext);
}
