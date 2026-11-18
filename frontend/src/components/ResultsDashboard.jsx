import React from 'react'
import {
  Card,
  CardContent,
  Typography,
  Box,
  Alert,
  AlertTitle,
  Chip,
} from '@mui/material'
import WaterDropIcon from '@mui/icons-material/WaterDrop'
import EventAvailableIcon from '@mui/icons-material/EventAvailable'
import BathtubIcon from '@mui/icons-material/Bathtub'
import RestaurantIcon from '@mui/icons-material/Restaurant'
import CleaningServicesIcon from '@mui/icons-material/CleaningServices'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ErrorIcon from '@mui/icons-material/Error'
import UsageDistribution from './UsageDistribution'

const ALERTA_STYLES = {
  rojo: {
    severity: 'error',
    colorKey: 'error',
    hex: '#dc2626',
    bgGradient: 'linear-gradient(135deg, rgba(220,38,38,0.14) 0%, rgba(239,68,68,0.04) 100%)',
    badgeLabel: 'En rojo',
    icon: <ErrorIcon />,
  },
  amarillo: {
    severity: 'warning',
    colorKey: 'warning',
    hex: '#d97706',
    bgGradient: 'linear-gradient(135deg, rgba(217,119,6,0.14) 0%, rgba(245,158,11,0.04) 100%)',
    badgeLabel: 'Precaución',
    icon: <WarningAmberIcon />,
  },
  verde: {
    severity: 'success',
    colorKey: 'success',
    hex: '#16a34a',
    bgGradient: 'linear-gradient(135deg, rgba(22,163,74,0.14) 0%, rgba(34,197,94,0.04) 100%)',
    badgeLabel: 'Óptimo',
    icon: <CheckCircleIcon />,
  },
}

function SemicircleGauge({ percentage, color }) {
  const clamped = Math.max(0, Math.min(100, percentage))
  const radius = 52
  const circumference = Math.PI * radius
  const strokeDashoffset = circumference - (clamped / 100) * circumference

  return (
    <Box sx={{ position: 'relative', width: 136, height: 78, mx: 'auto', my: 0.5 }}>
      <svg width="136" height="78" viewBox="0 0 136 78">
        <path
          d="M 16 68 A 52 52 0 0 1 120 68"
          fill="none"
          stroke="rgba(148, 163, 184, 0.25)"
          strokeWidth="12"
          strokeLinecap="round"
        />
        <path
          d="M 16 68 A 52 52 0 0 1 120 68"
          fill="none"
          stroke={color}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{ transition: 'stroke-dashoffset 0.6s ease' }}
        />
      </svg>
      <Box
        sx={{
          position: 'absolute',
          bottom: 2,
          left: 0,
          right: 0,
          textAlign: 'center',
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 800, color, lineHeight: 1 }}>
          {clamped}%
        </Typography>
      </Box>
    </Box>
  )
}

const cardHoverSx = {
  height: '100%',
  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  '&:hover': {
    transform: 'translateY(-3px)',
  },
}

export default function ResultsDashboard({ resultado }) {
  if (!resultado) return null

  const alerta = ALERTA_STYLES[resultado.nivel_alerta] || ALERTA_STYLES.amarillo

  return (
    <Box sx={{ mt: 3.5 }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 1.5,
          mb: 2,
        }}
      >
        <Box>
          <Typography variant="h5">Resultados del Hogar</Typography>
          <Typography variant="body2" color="text.secondary">
            {resultado.familia} · {resultado.sector} ({resultado.integrantes}{' '}
            {resultado.integrantes === 1 ? 'integrante' : 'integrantes'})
          </Typography>
        </Box>
        <Chip
          icon={<WaterDropIcon />}
          label={`Reserva total: ${resultado.total_litros.toLocaleString('es-VE')} L`}
          color="primary"
          sx={{ fontWeight: 700, px: 0.5 }}
        />
      </Box>

      <Alert severity={alerta.severity} icon={alerta.icon} sx={{ mb: 2.5, borderRadius: 3 }}>
        <AlertTitle sx={{ fontWeight: 700 }}>{resultado.estado_alerta}</AlertTitle>
        {resultado.mensaje_alerta}
      </Alert>

      {/* 4 Tarjetas principales llamativas e impactantes */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
          gap: 2.2,
        }}
      >
        {/* 1. Ración diaria disponible */}
        <Card
          sx={{
            ...cardHoverSx,
            background: 'linear-gradient(135deg, #0277bd 0%, #039be5 100%)',
            color: '#ffffff',
            border: 'none',
            boxShadow: '0 10px 28px rgba(2, 119, 189, 0.28)',
          }}
        >
          <CardContent sx={{ p: 2.8, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'rgba(255,255,255,0.9)' }}>
                Ración diaria disponible
              </Typography>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  bgcolor: 'rgba(255,255,255,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <WaterDropIcon sx={{ color: '#e1f5fe' }} />
              </Box>
            </Box>

            <Typography variant="h3" sx={{ fontWeight: 800, letterSpacing: '-0.02em', my: 0.5 }}>
              {resultado.racion_diaria_litros} <Box component="span" sx={{ fontSize: '1.25rem', fontWeight: 600 }}>L/día</Box>
            </Typography>

            <Box sx={{ mt: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
              <Chip
                size="small"
                label={`${resultado.racion_por_persona_litros} L / persona`}
                sx={{ bgcolor: 'rgba(255,255,255,0.22)', color: '#fff', fontWeight: 700 }}
              />
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.85)' }}>
                Por {resultado.dias_espera} días
              </Typography>
            </Box>
          </CardContent>
        </Card>

        {/* 2. Días de reserva */}
        <Card
          sx={{
            ...cardHoverSx,
            background: 'linear-gradient(135deg, #00695c 0%, #00897b 100%)',
            color: '#ffffff',
            border: 'none',
            boxShadow: '0 10px 28px rgba(0, 137, 123, 0.25)',
          }}
        >
          <CardContent sx={{ p: 2.8, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'rgba(255,255,255,0.9)' }}>
                Días de reserva
              </Typography>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  bgcolor: 'rgba(255,255,255,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <EventAvailableIcon sx={{ color: '#e0f2f1' }} />
              </Box>
            </Box>

            <Typography variant="h3" sx={{ fontWeight: 800, letterSpacing: '-0.02em', my: 0.5 }}>
              {resultado.dias_reserva} <Box component="span" sx={{ fontSize: '1.25rem', fontWeight: 600 }}>días</Box>
            </Typography>

            <Box sx={{ mt: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
              <Chip
                size="small"
                label={`Espera: ${resultado.dias_espera} días`}
                sx={{ bgcolor: 'rgba(255,255,255,0.22)', color: '#fff', fontWeight: 700 }}
              />
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.85)' }}>
                A ritmo de 50 L/persona
              </Typography>
            </Box>
          </CardContent>
        </Card>

        {/* 3. Recomendación de uso */}
        <Card
          sx={{
            ...cardHoverSx,
            borderTop: '4px solid',
            borderTopColor: 'primary.main',
          }}
        >
          <CardContent sx={{ p: 2.8, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="subtitle2" color="text.secondary" fontWeight={700}>
                Recomendación de uso
              </Typography>
              <Box
                sx={{
                  width: 38,
                  height: 38,
                  borderRadius: '50%',
                  bgcolor: 'rgba(2, 119, 189, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <BathtubIcon color="primary" fontSize="small" />
              </Box>
            </Box>

            <Typography variant="h5" sx={{ fontWeight: 800, my: 0.8 }}>
              {resultado.recomendacion_titulo}
            </Typography>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8, mt: 1 }}>
              <Chip icon={<RestaurantIcon />} label="Cocina" size="small" color="primary" variant="outlined" />
              <Chip icon={<BathtubIcon />} label="Baño" size="small" color="secondary" variant="outlined" />
              {resultado.nivel_alerta !== 'rojo' && (
                <Chip icon={<CleaningServicesIcon />} label="Limpieza" size="small" variant="outlined" />
              )}
            </Box>
          </CardContent>
        </Card>

        {/* 4. Alerta de déficit */}
        <Card
          sx={{
            ...cardHoverSx,
            background: alerta.bgGradient,
            border: '1.5px solid',
            borderColor: `${alerta.colorKey}.main`,
          }}
        >
          <CardContent sx={{ p: 2.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                <WarningAmberIcon color={alerta.colorKey} fontSize="small" />
                <Typography variant="subtitle2" color="text.secondary" fontWeight={700}>
                  Alerta de déficit
                </Typography>
              </Box>
              <Chip label={alerta.badgeLabel} color={alerta.colorKey} size="small" sx={{ fontWeight: 800 }} />
            </Box>

            <SemicircleGauge percentage={resultado.porcentaje_cobertura} color={alerta.hex} />

            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center', mt: 0.5 }}>
              Cobertura frente a la meta básica diaria (50 L/persona)
            </Typography>
          </CardContent>
        </Card>
      </Box>

      <UsageDistribution
        distribucion={resultado.distribucion_uso}
        consejos={resultado.consejos}
        racionDiaria={resultado.racion_diaria_litros}
      />
    </Box>
  )
}
