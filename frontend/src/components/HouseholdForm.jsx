import React from 'react'
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Autocomplete,
  Button,
  Box,
  Slider,
  InputAdornment,
  MenuItem,
  Chip,
  Divider,
  IconButton,
  CircularProgress,
} from '@mui/material'
import HomeWorkIcon from '@mui/icons-material/HomeWork'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom'
import GroupsIcon from '@mui/icons-material/Groups'
import WaterIcon from '@mui/icons-material/Water'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import CalculateIcon from '@mui/icons-material/Calculate'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import OpacityIcon from '@mui/icons-material/Opacity'

const CAPACIDADES_TANQUE = [500, 1000, 1500, 2000, 3000, 5000]
const CAPACIDADES_POTE = [
  { label: '20 L (Botellón / Tobo)', value: 20 },
  { label: '50 L (Bidón)', value: 50 },
  { label: '100 L (Tambor)', value: 100 },
  { label: '200 L (Pipote)', value: 200 },
]

export default function HouseholdForm({
  form,
  sectores,
  onChange,
  onSubmit,
  loading,
}) {
  const totalLitrosPreview =
    (Number(form.tanques) || 0) * (Number(form.capacidad_tanque_litros) || 0) +
    (Number(form.potes) || 0) * (Number(form.capacidad_pote_litros) || 0)

  const adjustNumber = (field, delta, min = 0, max = 100) => {
    const current = Number(form[field]) || 0
    const next = Math.min(max, Math.max(min, current + delta))
    onChange(field, next)
  }

  return (
    <Card component="form" onSubmit={onSubmit}>
      <CardContent sx={{ p: { xs: 2.2, sm: 3.5 } }}>
        {/* Sección 1: Identificación del Hogar */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, mb: 2.5 }}>
          <HomeWorkIcon color="primary" />
          <Typography variant="h6">Datos del Hogar</Typography>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
            gap: 2.2,
            mb: 1,
          }}
        >
          <Autocomplete
            freeSolo
            fullWidth
            options={sectores}
            value={form.sector}
            onInputChange={(_, newValue) => onChange('sector', newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
                label="Sector"
                required
                placeholder="Ej: Escalera Raquel - Parte Alta"
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <>
                      <InputAdornment position="start">
                        <LocationOnIcon color="primary" fontSize="small" />
                      </InputAdornment>
                      {params.InputProps.startAdornment}
                    </>
                  ),
                }}
              />
            )}
          />

          <TextField
            fullWidth
            required
            label="Familia"
            placeholder="Ej: Familia Pérez"
            value={form.familia}
            onChange={(e) => onChange('familia', e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <FamilyRestroomIcon color="primary" fontSize="small" />
                  </InputAdornment>
                ),
              },
            }}
          />
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Sección 2: Calculadora de Racionamiento */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 1.5,
            mb: 2.5,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
            <CalculateIcon color="primary" />
            <Typography variant="h6">Calculadora de Racionamiento</Typography>
          </Box>
          <Chip
            icon={<OpacityIcon />}
            label={`Total almacenado: ${totalLitrosPreview.toLocaleString('es-VE')} L`}
            color="primary"
            variant="outlined"
            sx={{ fontWeight: 700 }}
          />
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
            gap: 2.2,
          }}
        >
          {/* Integrantes */}
          <Box
            sx={{
              p: 2,
              borderRadius: 3,
              bgcolor: (theme) =>
                theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(2,119,189,0.04)',
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 0.6, mb: 1.2 }}
            >
              <GroupsIcon fontSize="small" color="primary" /> Integrantes en casa
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton
                size="small"
                color="primary"
                onClick={() => adjustNumber('integrantes', -1, 1, 30)}
                aria-label="Restar integrante"
                sx={{ border: '1px solid', borderColor: 'divider' }}
              >
                <RemoveIcon />
              </IconButton>
              <TextField
                type="number"
                value={form.integrantes}
                onChange={(e) => onChange('integrantes', Math.max(1, Number(e.target.value) || 1))}
                inputProps={{ min: 1, max: 30, style: { textAlign: 'center', fontWeight: 700 } }}
                sx={{ width: 84 }}
              />
              <IconButton
                size="small"
                color="primary"
                onClick={() => adjustNumber('integrantes', 1, 1, 30)}
                aria-label="Sumar integrante"
                sx={{ border: '1px solid', borderColor: 'divider' }}
              >
                <AddIcon />
              </IconButton>
              <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
                {Number(form.integrantes) === 1 ? 'persona' : 'personas'}
              </Typography>
            </Box>
          </Box>

          {/* Días de espera */}
          <Box
            sx={{
              p: 2,
              borderRadius: 3,
              bgcolor: (theme) =>
                theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(2,119,189,0.04)',
              border: '1px solid',
              borderColor: 'divider',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.8 }}>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 0.6 }}
              >
                <AccessTimeIcon fontSize="small" color="primary" /> Días de espera (sin bombeo)
              </Typography>
              <Chip label={`${form.dias_espera} días`} size="small" color="primary" sx={{ fontWeight: 700 }} />
            </Box>
            <Slider
              value={Number(form.dias_espera) || 1}
              min={1}
              max={30}
              step={1}
              valueLabelDisplay="auto"
              onChange={(_, val) => onChange('dias_espera', val)}
              sx={{ mt: 0.5 }}
            />
          </Box>

          {/* Tanques */}
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <TextField
              label="Cantidad de Tanques"
              type="number"
              fullWidth
              value={form.tanques}
              onChange={(e) => onChange('tanques', Math.max(0, Number(e.target.value) || 0))}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <WaterIcon color="primary" fontSize="small" />
                    </InputAdornment>
                  ),
                },
                htmlInput: { min: 0, max: 50 },
              }}
            />
            <TextField
              select
              label="Capacidad"
              value={form.capacidad_tanque_litros}
              onChange={(e) => onChange('capacidad_tanque_litros', Number(e.target.value))}
              sx={{ minWidth: 130 }}
            >
              {CAPACIDADES_TANQUE.map((cap) => (
                <MenuItem key={cap} value={cap}>
                  {cap} L
                </MenuItem>
              ))}
            </TextField>
          </Box>

          {/* Potes / Pipotes */}
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <TextField
              label="Potes / Pipotes"
              type="number"
              fullWidth
              value={form.potes}
              onChange={(e) => onChange('potes', Math.max(0, Number(e.target.value) || 0))}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <OpacityIcon color="secondary" fontSize="small" />
                    </InputAdornment>
                  ),
                },
                htmlInput: { min: 0, max: 200 },
              }}
            />
            <TextField
              select
              label="Capacidad"
              value={form.capacidad_pote_litros}
              onChange={(e) => onChange('capacidad_pote_litros', Number(e.target.value))}
              sx={{ minWidth: 165 }}
            >
              {CAPACIDADES_POTE.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </TextField>
          </Box>
        </Box>

        <Box sx={{ mt: 3 }}>
          <Button
            type="submit"
            variant="contained"
            size="large"
            fullWidth
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <CalculateIcon />}
            sx={{
              py: 1.4,
              fontSize: '1rem',
              background: 'linear-gradient(135deg, #0277bd 0%, #0288d1 100%)',
              boxShadow: '0 6px 18px rgba(2, 119, 189, 0.30)',
            }}
          >
            {loading ? 'Calculando racionamiento...' : 'Calcular Racionamiento'}
          </Button>
        </Box>
      </CardContent>
    </Card>
  )
}
