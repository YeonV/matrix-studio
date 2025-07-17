// src/components/MatrixStudio/components/SelectionDetails.tsx

import { useAtom, useAtomValue } from 'jotai';
import { Box, Stack, TextField, Typography } from '@mui/material';
import { selectionAtom, type CellAtom } from '../atoms';

// The SinglePixelEditor sub-component remains unchanged.
const SinglePixelEditor = ({ cellAtom }: { cellAtom: CellAtom }) => {
  const [cellData, setCellData] = useAtom(cellAtom);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCellData(prev => ({
      ...prev,
      [name]: name === 'pixel' ? parseInt(value, 10) || 0 : value,
    }));
  };

  return (
    <Stack spacing={2}>
      <TextField
        label="Device ID"
        name="deviceId"
        value={cellData.deviceId}
        onChange={handleChange}
        variant="filled"
        size="small"
        fullWidth
      />
      <TextField
        label="Pixel #"
        name="pixel"
        type="number"
        value={cellData.pixel}
        onChange={handleChange}
        variant="filled"
        size="small"
        fullWidth
      />
      <TextField
        label="Group"
        name="group"
        value={cellData.group || ''}
        onChange={handleChange}
        variant="filled"
        size="small"
        fullWidth
      />
    </Stack>
  );
};

// The main component is now simplified for its new role.
export const SelectionDetails = () => {
  const selection = useAtomValue(selectionAtom);

  const hasSingleSelection = selection.length === 1;
  const hasMultipleSelection = selection.length > 1;

  return (
    // This is now a simple padded container.
    <Box sx={{ p: 2 }}>
      <Typography variant="overline" color="text.secondary" display="block" sx={{ mb: 1.5 }}>
        Selection Details
      </Typography>

      {hasSingleSelection && <SinglePixelEditor cellAtom={selection[0]} />}

      {hasMultipleSelection && (
        <Typography variant="body2" color="text.secondary">
          {selection.length} pixels selected.
        </Typography>
      )}

      {/* This case is technically handled by the parent hiding the whole panel, but it's good practice to keep it. */}
      {!hasSingleSelection && !hasMultipleSelection && (
        <Typography variant="body2" color="text.secondary">
          No selection.
        </Typography>
      )}
    </Box>
  );
};