import { createContext, useContext, useState } from 'react';
const AppContext = createContext(null);
export function AppProvider({ children }) {
  const [theme, setTheme] = useState('edge');
  return <AppContext.Provider value={{ theme, setTheme }}>{children}</AppContext.Provider>;
}
export const useApp = () => useContext(AppContext);
