// src/components/MatrixStudio/components/SelectionDetails.tsx

import { useAtom, useAtomValue } from 'jotai';
import { Box, Stack, TextField, Typography } from '@mui/material';
import { selectionAtom, type CellAtom } from '../atoms';

const SinglePixelEditor = ({ cellAtom }: { cellAtom: CellAtom }) => {
  const [cellData, setCellData] = useAtom(cellAtom);

  const handleChange = (field: string, value: string | number) => {
    setCellData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Stack spacing={2}>
      <TextField
        label="Device ID"
        name="deviceId"
        value={cellData.deviceId}
        disabled
        variant="filled"
        size="small"
        fullWidth
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