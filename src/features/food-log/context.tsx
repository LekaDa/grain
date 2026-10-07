import { createContext, useContext, type ReactNode } from 'react';

import { useFoodLog } from './hooks/useFoodLog';

type FoodLogContextValue = ReturnType<typeof useFoodLog>;

const FoodLogContext = createContext<FoodLogContextValue | null>(null);

export function FoodLogProvider({ children }: { children: ReactNode }) {
  const value = useFoodLog();
  return <FoodLogContext.Provider value={value}>{children}</FoodLogContext.Provider>;
}

export function useFoodLogContext(): FoodLogContextValue {
  const context = useContext(FoodLogContext);
  if (!context) {
    throw new Error('useFoodLogContext must be used inside FoodLogProvider');
  }
  return context;
}
