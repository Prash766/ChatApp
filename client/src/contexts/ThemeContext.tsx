import { createContext, useContext, useState, ReactNode } from "react";

interface ThemeContextType {
  isDarkTheme: boolean;
  setTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeContextProvider");
  }
  return context;
};

export const ThemeContextProvider = ({ children }: { children: ReactNode }) => {
  const [isDarkTheme, setDarkTheme] = useState<boolean>(true);

  return (
    <ThemeContext.Provider
      value={{
        isDarkTheme,
        setTheme: () => setDarkTheme((prev) => !prev),
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
