// src/components/MatrixStudio/components/BrushSettings.tsx

import { useAtom } from 'jotai';
import { Box, Divider, Stack, TextField, Typography, InputAdornment, IconButton, Tooltip } from '@mui/material';
import { DynamicFeed, Exposure } from '@mui/icons-material';
import { brushAtom, isPixelAutoIncrementAtom, isGroupAutoIncrementAtom } from '../atoms';

export const BrushSettings = () => {
  const [brushData, setBrushData] = useAtom(brushAtom);
  const [isPixelIncrement, setIsPixelIncrement] = useAtom(isPixelAutoIncrementAtom);
  const [isGroupIncrement, setIsGroupIncrement] = useAtom(isGroupAutoIncrementAtom);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBrushData(prev => ({ ...prev, [name]: name === 'pixel' ? parseInt(value, 10) || 0 : value }));
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
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Tooltip title="Toggle Auto-Increment Pixel #">
                  <IconButton onClick={() => setIsPixelIncrement(prev => !prev)} edge="end">
                    <Exposure color={isPixelIncrement ? 'primary' : 'inherit'} />
                  </IconButton>
                </Tooltip>
              </InputAdornment>
            ),
          }}
        />
        <TextField
          label="Group"
          name="group"
          value={brushData.group || ''}
          onChange={handleChange}
          variant="filled"
          size="small"
          fullWidth
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Tooltip title="Toggle Auto-Generate Group on Release">
                  <IconButton onClick={() => setIsGroupIncrement(prev => !prev)} edge="end">
                    <DynamicFeed color={isGroupIncrement ? 'primary' : 'inherit'} />
                  </IconButton>
                </Tooltip>
              </InputAdornment>
            ),
          }}
        />
      </Stack>
    </Box>
  );
};