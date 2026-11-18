import React from 'react'
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItemButton,
  ListItemText,
  Chip,
  Box,
  IconButton,
  Tooltip,
} from '@mui/material'
import HistoryIcon from '@mui/icons-material/History'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'

const CHIP_COLOR = {
  rojo: 'error',
  amarillo: 'warning',
  verde: 'success',
}

export default function HistoryPanel({ historial, onSelect, onClear }) {
  if (!historial.length) return null

  return (
    <Card sx={{ mt: 3 }}>
      <CardContent sx={{ p: { xs: 2, sm: 2.5 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <HistoryIcon color="primary" />
            <Typography variant="h6">Historial Reciente</Typography>
          </Box>
          <Tooltip title="Limpiar historial">
            <IconButton size="small" onClick={onClear} color="error">
              <DeleteOutlineIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>

        <List dense disablePadding>
          {historial.map((item, index) => (
            <ListItemButton
              key={`${item.familia}-${item.timestamp}-${index}`}
              onClick={() => onSelect(item)}
              sx={{ borderRadius: 2, mb: 0.5 }}
            >
              <ListItemText
                primary={`${item.familia} · ${item.racion_diaria_litros} L/día`}
                secondary={`${item.sector} · ${item.dias_reserva} días de reserva`}
                primaryTypographyProps={{ fontWeight: 600 }}
              />
              <Chip
                size="small"
                label={item.nivel_alerta.toUpperCase()}
                color={CHIP_COLOR[item.nivel_alerta] || 'default'}
                sx={{ fontWeight: 700 }}
              />
            </ListItemButton>
          ))}
        </List>
      </CardContent>
    </Card>
  )
}

