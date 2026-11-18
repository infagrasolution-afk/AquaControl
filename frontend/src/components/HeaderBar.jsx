import React from 'react'
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Button,
  Tooltip,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import WaterDropIcon from '@mui/icons-material/WaterDrop'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import LightModeIcon from '@mui/icons-material/LightMode'
import GetAppIcon from '@mui/icons-material/GetApp'

export default function HeaderBar({
  mode,
  onToggleTheme,
  canInstall,
  onInstallClick,
  onOpenInstallHelp,
}) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        background:
          mode === 'dark'
            ? 'linear-gradient(135deg, #0b1929 0%, #0f2942 100%)'
            : 'linear-gradient(135deg, #01579b 0%, #0288d1 100%)',
        borderBottom: '1px solid rgba(255,255,255,0.14)',
        backdropFilter: 'blur(10px)',
      }}
    >
      <Toolbar sx={{ maxWidth: 1120, width: '100%', mx: 'auto', px: { xs: 1.5, sm: 3 }, gap: 1 }}>
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: 2.5,
            bgcolor: 'rgba(255,255,255,0.18)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <WaterDropIcon sx={{ color: '#e1f5fe', fontSize: 26 }} />
        </Box>

        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
          <Typography variant="h6" noWrap sx={{ color: '#fff', lineHeight: 1.15, fontSize: { xs: '1.05rem', sm: '1.2rem' } }}>
            AquaControl
          </Typography>
          <Typography variant="caption" noWrap sx={{ color: 'rgba(225, 245, 254, 0.85)', display: 'block' }}>
            Escalera Raquel · Racionamiento Hídrico
          </Typography>
        </Box>

        {canInstall ? (
          <Button
            variant="contained"
            size="small"
            startIcon={<GetAppIcon />}
            onClick={onInstallClick}
            sx={{
              bgcolor: '#ffffff',
              color: '#01579b',
              '&:hover': { bgcolor: '#e1f5fe' },
              px: { xs: 1.25, sm: 2 },
              py: 0.6,
            }}
          >
            {isMobile ? 'Instalar' : 'Instalar App'}
          </Button>
        ) : (
          <Tooltip title="Cómo instalar en tu teléfono (PWA)">
            <IconButton color="inherit" onClick={onOpenInstallHelp} size="small">
              <GetAppIcon />
            </IconButton>
          </Tooltip>
        )}

        <Tooltip title={mode === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}>
          <IconButton color="inherit" onClick={onToggleTheme} size="small">
            {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
        </Tooltip>
      </Toolbar>
    </AppBar>
  )
}

