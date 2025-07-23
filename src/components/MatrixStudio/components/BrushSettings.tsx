// src/components/MatrixStudio/components/BrushSettings.tsx

import { useAtom } from 'jotai';
import { Box, Stack, TextField, Typography, InputAdornment, IconButton, Tooltip, Autocomplete } from '@mui/material';
import { AddBox, Block, DynamicFeed, IndeterminateCheckBox } from '@mui/icons-material';
import { brushAtom, isGroupAutoIncrementAtom, type PixelIncrementMode, pixelIncrementModeAtom } from '../atoms';
import { useMatrixEditorContext } from '../MatrixStudioContext';

export const BrushSettings = () => {
  const [brushData, setBrushData] = useAtom(brushAtom);
  
  
  const [pixelMode, setPixelMode] = useAtom(pixelIncrementModeAtom);
  const [isGroupIncrement, setIsGroupIncrement] = useAtom(isGroupAutoIncrementAtom);
  const { deviceList } = useMatrixEditorContext();

  const handleBrushChange = (field: string, value: string | number) => {
    setBrushData(prev => ({ ...prev, [field]: value }));
  };

  const cyclePixelMode = () => {
    const modes: PixelIncrementMode[] = ['increment', 'decrement', 'off'];
    const currentIndex = modes.indexOf(pixelMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setPixelMode(modes[nextIndex]);
  };

  const getPixelModeUI = () => {
    switch (pixelMode) {
      case 'increment':
        return { icon: <AddBox color="primary" />, title: 'Pixel Auto-Increment: ON' };
      case 'decrement':
        return { icon: <IndeterminateCheckBox color="primary" />, title: 'Pixel Auto-Decrement: ON' };
      case 'off':
      default:
        return { icon: <Block />, title: 'Pixel Auto-Increment: OFF' };
    }
  };


  const pixelModeUI = getPixelModeUI();
  const selectedDevice = deviceList.find(d => d.id === brushData.deviceId);
  const maxPixel = selectedDevice ? selectedDevice.count - 1 : undefined;

  return (
    <Box>
      <Typography variant="overline" color="text.secondary" display="block" sx={{ mb: 1.5 }}>
        Brush Settings
      </Typography>
      <Stack spacing={2}>
        <Autocomplete
          freeSolo
          options={deviceList}
          // The Autocomplete needs to know how to get the label string from the object
          getOptionLabel={(option) => (typeof option === 'string' ? option : option.id)}
          value={selectedDevice || brushData.deviceId} // Show the object or the raw string
          onChange={(_event, newValue) => {
            const newDeviceId = typeof newValue === 'string' ? newValue : newValue?.id || '';
            handleBrushChange('deviceId', newDeviceId);
          }}
          onInputChange={(_event, newInputValue) => {
            handleBrushChange('deviceId', newInputValue);
          }}
          renderInput={(params) => (
            <TextField {...params} label="Device ID" variant="filled" size="small" />
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
          inputProps={{ min: 0, max: maxPixel }}
          error={maxPixel !== undefined && (brushData.pixel > maxPixel || brushData.pixel < 0)}
          helperText={
            maxPixel !== undefined && (brushData.pixel > maxPixel || brushData.pixel < 0)
              ? `Range: 0 - ${maxPixel}`
              : ''
          }
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Tooltip title={pixelModeUI.title}>
                  <IconButton onClick={cyclePixelMode} edge="end">
                    {pixelModeUI.icon}
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