import { createTheme } from '@mui/material/styles'

export const buildAppTheme = (mode = 'light') => {
  const isDark = mode === 'dark'

  return createTheme({
    palette: {
      mode,
      primary: {
        main: isDark ? '#38bdf8' : '#0277bd',
        light: '#4fc3f7',
        dark: '#01579b',
        contrastText: isDark ? '#082f49' : '#ffffff',
      },
      secondary: {
        main: isDark ? '#2dd4bf' : '#00897b',
      },
      success: {
        main: isDark ? '#4ade80' : '#16a34a',
      },
      warning: {
        main: isDark ? '#fbbf24' : '#d97706',
      },
      error: {
        main: isDark ? '#f87171' : '#dc2626',
      },
      background: {
        default: isDark ? '#0b1929' : '#f0f7ff',
        paper: isDark ? '#112236' : '#ffffff',
      },
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h4: {
        fontWeight: 800,
        letterSpacing: '-0.02em',
      },
      h5: {
        fontWeight: 700,
        letterSpacing: '-0.01em',
      },
      h6: {
        fontWeight: 700,
      },
      button: {
        textTransform: 'none',
        fontWeight: 700,
      },
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            backgroundImage: 'none',
            boxShadow: isDark
              ? '0 8px 24px rgba(0, 0, 0, 0.35)'
              : '0 8px 28px rgba(2, 119, 189, 0.08)',
            border: isDark
              ? '1px solid rgba(56, 189, 248, 0.14)'
              : '1px solid rgba(2, 119, 189, 0.10)',
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: 10,
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            paddingTop: 10,
            paddingBottom: 10,
          },
        },
      },
      MuiTextField: {
        defaultProps: {
          variant: 'outlined',
          size: 'small',
        },
      },
    },
  })
}

