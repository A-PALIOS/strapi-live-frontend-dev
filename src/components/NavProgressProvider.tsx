// app/_components/NavProgressProvider.tsx
'use client';

import { createContext, useContext, useMemo, useState } from 'react';

type Ctx = { isNavigating: boolean; start: () => void; stop: () => void };
const NavProgressContext = createContext<Ctx | null>(null);

export function NavProgressProvider({ children }: { children: React.ReactNode }) {
  const [isNavigating, setIsNavigating] = useState(false);
  const value = useMemo<Ctx>(
    () => ({
      isNavigating,
      start: () => setIsNavigating(true),
      stop: () => setIsNavigating(false),
    }),
    [isNavigating]
  );
  return <NavProgressContext.Provider value={value}>{children}</NavProgressContext.Provider>;
}
export function useNavProgress() {
  const ctx = useContext(NavProgressContext);
  if (!ctx) throw new Error('useNavProgress must be used within NavProgressProvider');
  return ctx;
}
