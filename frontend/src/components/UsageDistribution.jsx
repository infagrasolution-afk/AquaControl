import React from 'react'
import {
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Divider,
} from '@mui/material'
import RestaurantIcon from '@mui/icons-material/Restaurant'
import BathtubIcon from '@mui/icons-material/Bathtub'
import CleaningServicesIcon from '@mui/icons-material/CleaningServices'
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'

const ICONOS_CATEGORIA = {
  'Cocina y Bebida': <RestaurantIcon color="primary" fontSize="small" />,
  'Baño e Higiene': <BathtubIcon color="secondary" fontSize="small" />,
  'Limpieza y Lavado': <CleaningServicesIcon color="action" fontSize="small" />,
  'Limpieza Básica': <CleaningServicesIcon color="action" fontSize="small" />,
}

export default function UsageDistribution({ distribucion, consejos, racionDiaria }) {
  return (
    <Card sx={{ mt: 2.5 }}>
      <CardContent sx={{ p: { xs: 2.2, sm: 3 } }}>
        <Typography variant="h6" gutterBottom>
          Distribución Diaria Sugerida ({racionDiaria} L/día)
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
          Así puede repartir su ración diaria la familia para no quedarse sin agua antes del próximo bombeo:
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {distribucion.map((item) => (
            <Box key={item.categoria}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.6 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {ICONOS_CATEGORIA[item.categoria] || <TipsAndUpdatesIcon fontSize="small" />}
                  <Typography variant="body2" fontWeight={600}>
                    {item.categoria}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Chip label={`${item.porcentaje}%`} size="small" variant="outlined" />
                  <Typography variant="body2" fontWeight={700} color="primary">
                    {item.litros} L
                  </Typography>
                </Box>
              </Box>
              <LinearProgress
                variant="determinate"
                value={item.porcentaje}
                sx={{
                  height: 10,
                  borderRadius: 5,
                  bgcolor: (theme) =>
                    theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(2,119,189,0.10)',
                }}
              />
            </Box>
          ))}
        </Box>

        <Divider sx={{ my: 2.5 }} />

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <TipsAndUpdatesIcon color="warning" />
          <Typography variant="subtitle1" fontWeight={700}>
            Consejos Prácticos para el Hogar
          </Typography>
        </Box>

        <List dense disablePadding>
          {consejos.map((consejo, idx) => (
            <ListItem key={idx} disableGutters sx={{ py: 0.4 }}>
              <ListItemIcon sx={{ minWidth: 32 }}>
                <CheckCircleOutlineIcon color="success" fontSize="small" />
              </ListItemIcon>
              <ListItemText primary={consejo} primaryTypographyProps={{ variant: 'body2' }} />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  )
}

