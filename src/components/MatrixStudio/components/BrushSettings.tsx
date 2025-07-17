import { useAtom } from 'jotai';
import { Box, Divider, Stack, TextField, Typography } from '@mui/material';
import { brushAtom } from '../atoms';

export const BrushSettings = () => {
  // Get two-way binding to the global brush atom
  const [brushData, setBrushData] = useAtom(brushAtom);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Update the brush atom's state as the user types
    setBrushData(prev => ({
      ...prev,
      [name]: name === 'pixel' ? parseInt(value, 10) || 0 : value,
    }));
  };

  return (
    <Box>
      <Divider sx={{ my: 2 }} />
      <Typography variant="overline" color="text.secondary" display="block" sx={{ mb: 1.5 }}>
        Brush Settings
      </Typography>
      <Stack spacing={2}>
        <TextField
          label="Device ID"
          name="deviceId"
          value={brushData.deviceId}
          onChange={handleChange}
          variant="filled"
          size="small"
          fullWidth
        />
        <TextField
          label="Pixel #"
          name="pixel"
          type="number"
          value={brushData.pixel}
          onChange={handleChange}
          variant="filled"
          size="small"
          fullWidth
        />
        <TextField
          label="Group"
          name="group"
          value={brushData.group || ''}
          onChange={handleChange}
          variant="filled"
          size="small"
          fullWidth
        />
      </Stack>
    </Box>
  );
};