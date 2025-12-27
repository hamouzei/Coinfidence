// Dark mode utility functions

export const darkMode = {
  // Get current theme
  getTheme: (): 'light' | 'dark' => {
    if (typeof window === 'undefined') return 'light';
    
    // Check localStorage first
    const stored = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (stored) {
      return stored;
    }
    
    // Check system preference
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    
    return 'light';
  },

  // Set theme
  setTheme: (theme: 'light' | 'dark'): void => {
    if (typeof window === 'undefined') return;
    
    localStorage.setItem('theme', theme);
    const html = document.documentElement;
    
    if (theme === 'dark') {
      html.classList.add('dark');
      html.classList.remove('light');
    } else {
      html.classList.add('light');
      html.classList.remove('dark');
    }
  },

  // Toggle theme
  toggle: (): 'light' | 'dark' => {
    const current = darkMode.getTheme();
    const newTheme = current === 'dark' ? 'light' : 'dark';
    darkMode.setTheme(newTheme);
    return newTheme;
  },

  // Initialize theme on page load
  init: (): void => {
    if (typeof window === 'undefined') return;
    
    const theme = darkMode.getTheme();
    darkMode.setTheme(theme);
    
    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      // Only auto-update if user hasn't set a preference
      if (!localStorage.getItem('theme')) {
        darkMode.setTheme(e.matches ? 'dark' : 'light');
      }
    });
  },
};

