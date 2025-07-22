// src/components/MatrixStudio/components/SelectionDetails.tsx

import { useAtom, useAtomValue } from 'jotai';
import { Box, Stack, TextField, Typography, Autocomplete } from '@mui/material';
import { selectionAtom, type CellAtom } from '../atoms';
import { useMatrixEditorContext } from '../MatrixStudioContext';

const SinglePixelEditor = ({ cellAtom }: { cellAtom: CellAtom }) => {
  const [cellData, setCellData] = useAtom(cellAtom);
  const { deviceList } = useMatrixEditorContext();

  const handleChange = (field: string, value: string | number) => {
    setCellData(prev => ({ ...prev, [field]: value }));
  };

  const selectedDevice = deviceList.find(d => d.id === cellData.deviceId);
  const maxPixel = selectedDevice ? selectedDevice.count - 1 : undefined;

  return (
    <Stack spacing={2}>
      <Autocomplete
        freeSolo
        options={deviceList}
        getOptionLabel={(option) => (typeof option === 'string' ? option : option.id)}
        value={selectedDevice || cellData.deviceId}
        onChange={(_event, newValue) => {
          const newDeviceId = typeof newValue === 'string' ? newValue : newValue?.id || '';
          handleChange('deviceId', newDeviceId);
        }}
        onInputChange={(_event, newInputValue) => {
          handleChange('deviceId', newInputValue);
        }}
        renderInput={(params) => (
          <TextField {...params} label="Device ID" variant="filled" size="small" />
        )}
      />
      <TextField
        label="Pixel #"
        name="pixel"
        type="number"
        value={cellData.pixel}
        onChange={(e) => handleChange('pixel', parseInt(e.target.value, 10) || 0)}
        variant="filled"
        size="small"
        fullWidth
        slotProps={{ htmlInput: { min: 0, max: maxPixel } }}
        error={maxPixel !== undefined && cellData.pixel > maxPixel}
        helperText={maxPixel !== undefined && cellData.pixel > maxPixel ? `Max: ${maxPixel}` : ''}
      />
      <TextField
        label="Group"
        name="group"
        value={cellData.group || ''}
        onChange={(e) => handleChange('group', e.target.value)}
        variant="filled"
        size="small"
        fullWidth
      />
    </Stack>
  );
};

export const SelectionDetails = () => {
  const selection = useAtomValue(selectionAtom);
  const hasSingleSelection = selection.length === 1;
  const hasMultipleSelection = selection.length > 1;

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="overline" color="text.secondary" display="block" sx={{ mb: 1.5 }}>
        Selection Details
      </Typography>
      {hasSingleSelection && <SinglePixelEditor cellAtom={selection[0]} />}
      {hasMultipleSelection && <Typography variant="body2" color="text.secondary">{selection.length} pixels selected.</Typography>}
      {!hasSingleSelection && !hasMultipleSelection && <Typography variant="body2" color="text.secondary">No selection.</Typography>}
    </Box>
  );
};