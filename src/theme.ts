import { createTheme } from '@mui/material/styles';

export const getTheme = (isDarkMode: boolean) => createTheme({
  palette: {
    mode: isDarkMode ? 'dark' : 'light',
    primary: {
      main: '#0066CC',
      light: '#0077ED',
      dark: '#0055AA',
    },
    secondary: {
      main: '#86868B',
      light: '#98989D',
      dark: '#6E6E73',
    },
    background: {
      default: isDarkMode ? '#0A0A0C' : '#F5F5F7',
      paper: isDarkMode ? '#1D1D1F' : '#FFFFFF',
    },
    text: {
      primary: isDarkMode ? '#F5F5F7' : '#1D1D1F',
      secondary: isDarkMode ? '#98989D' : '#86868B',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"SF Pro Display"',
      '"SF Pro Text"',
      'system-ui',
      'Helvetica',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
      letterSpacing: '-0.025em',
      lineHeight: 1.1,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      letterSpacing: '-0.025em',
      lineHeight: 1.2,
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 600,
      letterSpacing: '-0.025em',
      lineHeight: 1.3,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
      letterSpacing: '-0.01em',
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
      letterSpacing: '-0.01em',
    },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '1rem',
          padding: '0.75rem 1.5rem',
          fontSize: '0.875rem',
          fontWeight: 500,
          textTransform: 'none',
          letterSpacing: '-0.01em',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: isDarkMode 
              ? '0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.1)'
              : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          },
        },
        contained: {
          backgroundColor: '#0066CC',
          color: '#FFFFFF',
          '&:hover': {
            backgroundColor: '#0055AA',
          },
        },
        outlined: {
          borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)',
          '&:hover': {
            backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.04)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '1rem',
            backgroundColor: isDarkMode ? 'rgba(29, 29, 31, 0.8)' : 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(8px)',
            '& fieldset': {
              borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)',
            },
            '&:hover fieldset': {
              borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.24)' : 'rgba(0, 0, 0, 0.24)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#0066CC',
            },
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '1.5rem',
          backgroundColor: isDarkMode ? 'rgba(29, 29, 31, 0.8)' : 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(8px)',
          border: isDarkMode ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid rgba(0, 0, 0, 0.12)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
        elevation1: {
          boxShadow: isDarkMode 
            ? '0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.1)'
            : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          letterSpacing: '-0.01em',
        },
      },
    },
  },
});