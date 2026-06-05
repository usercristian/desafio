import { useState, useEffect, useCallback } from 'react';

/**
 * Hook para gerenciar o tema (light/dark).
 *
 * Prioridade:
 *  1. Valor salvo em localStorage('theme')
 *  2. Preferência do sistema operacional (prefers-color-scheme)
 *
 * Expõe:
 *  - theme: 'light' | 'dark'
 *  - isDark: boolean
 *  - toggleTheme: () => void
 */
const useTheme = () => {
  const getInitialTheme = () => {
    // 1. Preferência salva
    const stored = localStorage.getItem('theme');
    if (stored === 'dark' || stored === 'light') return stored;

    // 2. Preferência do sistema
    if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }

    return 'light';
  };

  const [theme, setTheme] = useState(getInitialTheme);

  // Aplica a classe .dark no <html> e persiste
  useEffect(() => {
    const root = document.documentElement;

    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    localStorage.setItem('theme', theme);
  }, [theme]);

  // Escuta mudanças no prefers-color-scheme (se o usuário não salvou preferência manual)
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (e) => {
      // Só reage se o usuário não salvou preferência explícita
      const stored = localStorage.getItem('theme');
      if (!stored) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  return {
    theme,
    isDark: theme === 'dark',
    toggleTheme,
  };
};

export default useTheme;
