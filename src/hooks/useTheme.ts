import { useState, useEffect, useCallback } from 'react';

export function useTheme() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    document.documentElement.classList.toggle('light', !isDark);
    document.body.style.backgroundColor = isDark ? '#0B1120' : '#F5F5FA';
    document.body.style.color = isDark ? '#E0E6F0' : '#1A1A2E';
  }, [isDark]);

  const toggle = useCallback(() => setIsDark(d => !d), []);

  return { isDark, toggle };
}
