export const theme = {
  name: 'Ocean Professional',
  colors: {
    primary: '#2563EB',
    primary600: '#1D4ED8',
    secondary: '#F59E0B',
    success: '#10B981',
    error: '#EF4444',
    bg: '#f9fafb',
    surface: '#ffffff',
    text: '#111827',
    muted: '#6B7280',
    border: '#E5E7EB',
  },
  radii: {
    sm: '6px',
    md: '10px',
    lg: '14px',
  },
  shadows: {
    sm: '0 1px 2px rgba(0,0,0,0.04)',
    md: '0 6px 16px rgba(17,24,39,0.08)',
    lg: '0 12px 30px rgba(17,24,39,0.12)',
  },
  spacing: (n) => `${n * 4}px`,
};

// PUBLIC_INTERFACE
export function applyLightTheme() {
  /** Applies light theme via CSS variables on documentElement */
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('data-theme', 'light');
  }
}
