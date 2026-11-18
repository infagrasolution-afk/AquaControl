import React, { useState, useEffect, useMemo } from 'react'
import {
  ThemeProvider,
  CssBaseline,
  Container,
  Box,
  Typography,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  Snackbar,
  Alert,
} from '@mui/material'
import SmartphoneIcon from '@mui/icons-material/Smartphone'
import { buildAppTheme } from './theme'
import HeaderBar from './components/HeaderBar'
import HouseholdForm from './components/HouseholdForm'
import ResultsDashboard from './components/ResultsDashboard'
import HistoryPanel from './components/HistoryPanel'
import { SECTORES_DEFAULT, calcularRacionamientoLocal } from './utils/rationingFallback'

const INITIAL_FORM = {
  sector: 'Escalera Raquel - Parte Alta',
  familia: 'Familia Pérez',
  integrantes: 4,
  tanques: 1,
  capacidad_tanque_litros: 1000,
  potes: 2,
  capacidad_pote_litros: 200,
  dias_espera: 14,
}

export default function App() {
  const [mode, setMode] = useState(() => localStorage.getItem('aquacontrol_theme') || 'light')
  const [form, setForm] = useState(INITIAL_FORM)
  const [sectores, setSectores] = useState(SECTORES_DEFAULT)
  const [resultado, setResultado] = useState(() => calcularRacionamientoLocal(INITIAL_FORM))
  const [historial, setHistorial] = useState(() => {
    try {
      const saved = localStorage.getItem('aquacontrol_historial')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })
  const [loading, setLoading] = useState(false)
  const [backendOnline, setBackendOnline] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [installHelpOpen, setInstallHelpOpen] = useState(false)
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' })

  const theme = useMemo(() => buildAppTheme(mode), [mode])

  useEffect(() => {
    localStorage.setItem('aquacontrol_theme', mode)
  }, [mode])

  useEffect(() => {
    localStorage.setItem('aquacontrol_historial', JSON.stringify(historial))
  }, [historial])

  // Detectar si la API en Python está disponible
  useEffect(() => {
    let active = true
    const checkBackend = async () => {
      try {
        const res = await fetch('/api/sectores')
        if (res.ok) {
          const data = await res.json()
          if (active) {
            setBackendOnline(true)
            if (Array.isArray(data.sectores) && data.sectores.length > 0) {
              setSectores(data.sectores)
            }
          }
        }
      } catch {
        if (active) setBackendOnline(false)
      }
    }
    checkBackend()
    return () => {
      active = false
    }
  }, [])

  // Capturar evento de instalación PWA en navegadores móviles/escritorio
  useEffect(() => {
    const handler = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      setInstallHelpOpen(true)
      return
    }
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') {
      setSnackbar({ open: true, message: '¡Aplicación instalada en tu dispositivo!', severity: 'success' })
    }
    setDeferredPrompt(null)
  }

  const handleFieldChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleCalculate = async (e) => {
    if (e) e.preventDefault()
    setLoading(true)

    let data = null
    try {
      const response = await fetch('/api/calcular', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (response.ok) {
        data = await response.json()
        setBackendOnline(true)
      } else {
        throw new Error('Error de servidor')
      }
    } catch {
      setBackendOnline(false)
      data = calcularRacionamientoLocal(form)
    } finally {
      setLoading(false)
    }

    if (data) {
      setResultado(data)
      setHistorial((prev) => [{ ...data, timestamp: Date.now() }, ...prev].slice(0, 8))
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', pb: 5 }}>
        <HeaderBar
          mode={mode}
          onToggleTheme={() => setMode((m) => (m === 'light' ? 'dark' : 'light'))}
          canInstall={Boolean(deferredPrompt)}
          onInstallClick={handleInstallClick}
          onOpenInstallHelp={() => setInstallHelpOpen(true)}
        />

        <Container maxWidth="md" sx={{ mt: { xs: 2.5, sm: 4 }, px: { xs: 1.5, sm: 3 }, flexGrow: 1 }}>
          {/* Banner introductorio */}
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2, sm: 2.5 },
              mb: 3,
              borderRadius: 4,
              background:
                mode === 'dark'
                  ? 'linear-gradient(135deg, rgba(2,136,209,0.20) 0%, rgba(0,137,123,0.16) 100%)'
                  : 'linear-gradient(135deg, #e1f5fe 0%, #e0f2f1 100%)',
              border: '1px solid',
              borderColor: mode === 'dark' ? 'rgba(56,189,248,0.22)' : 'rgba(2,119,189,0.16)',
            }}
          >
            <Typography variant="subtitle1" fontWeight={700} color="primary.main" gutterBottom>
              Cerebro Logístico de Racionamiento · Escalera Raquel
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Ingresa la cantidad de recipientes en tu hogar y los días hasta el próximo bombeo. La aplicación
              calcula al instante tu ración diaria para que el agua alcance para toda la familia.
            </Typography>
          </Paper>

          <HouseholdForm
            form={form}
            sectores={sectores}
            onChange={handleFieldChange}
            onSubmit={handleCalculate}
            loading={loading}
          />

          <ResultsDashboard resultado={resultado} />

          <HistoryPanel
            historial={historial}
            onSelect={(item) => setResultado(item)}
            onClear={() => setHistorial([])}
          />
        </Container>
      </Box>

      {/* Diálogo de ayuda para instalar PWA en Android / iOS */}
      <Dialog open={installHelpOpen} onClose={() => setInstallHelpOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <SmartphoneIcon color="primary" /> Instalar en tu Teléfono
        </DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" paragraph>
            Esta aplicación es una <strong>PWA (Progressive Web App)</strong>, por lo que puedes instalarla
            como una app normal en tu celular sin ocupar casi espacio:
          </Typography>
          <List dense>
            <ListItem>
              <ListItemText
                primary="En Android (Google Chrome)"
                secondary="Toca el menú (⋮) arriba a la derecha y selecciona «Instalar aplicación» o «Agregar a la pantalla principal»."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="En iPhone (Safari)"
                secondary="Toca el botón Compartir (cuadrado con flecha hacia arriba) y selecciona «Agregar a inicio»."
              />
            </ListItem>
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setInstallHelpOpen(false)} variant="contained">
            Entendido
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
      >
        <Alert severity={snackbar.severity} variant="filled" sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  )
}

