// src/components/MatrixStudio/components/BrushSettings.tsx

import { useAtom } from 'jotai';
import { Box, Divider, Stack, TextField, Typography, InputAdornment, IconButton, Tooltip, Autocomplete } from '@mui/material';
import { Exposure, DynamicFeed } from '@mui/icons-material';
import { brushAtom, isPixelAutoIncrementAtom, isGroupAutoIncrementAtom } from '../atoms';
import { useMatrixEditorContext } from '../MatrixStudioContext'; // Import context hook

export const BrushSettings = () => {
  const [brushData, setBrushData] = useAtom(brushAtom);
  const [isPixelIncrement, setIsPixelIncrement] = useAtom(isPixelAutoIncrementAtom);
  const [isGroupIncrement, setIsGroupIncrement] = useAtom(isGroupAutoIncrementAtom);

  // Get the device list from the context
  const { deviceList } = useMatrixEditorContext();

  const handleBrushChange = (field: string, value: string | number) => {
    setBrushData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Box>
      <Divider sx={{ my: 2 }} />
      <Typography variant="overline" color="text.secondary" display="block" sx={{ mb: 1.5 }}>
        Brush Settings
      </Typography>
      <Stack spacing={2}>
        <Autocomplete
          freeSolo
          options={deviceList}
          value={brushData.deviceId}
          // This handles both selecting an option and typing a new value
          onChange={(event, newValue) => {
            handleBrushChange('deviceId', newValue || '');
          }}
          // This ensures the atom updates as you type
          onInputChange={(event, newInputValue) => {
            handleBrushChange('deviceId', newInputValue);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Device ID"
              variant="filled"
              size="small"
            />
          )}
        />
        <TextField
          label="Pixel #"
          name="pixel"
          type="number"
          value={brushData.pixel}
          onChange={(e) => handleBrushChange('pixel', parseInt(e.target.value, 10) || 0)}
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
          onChange={(e) => handleBrushChange('group', e.target.value)}
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