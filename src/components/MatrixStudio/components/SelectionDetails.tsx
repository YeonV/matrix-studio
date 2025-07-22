// src/components/MatrixStudio/components/SelectionDetails.tsx

import { useAtom, useAtomValue, useStore } from 'jotai';
import { useMemo, useState, useEffect } from 'react';
import { Box, Stack, TextField, Typography, Autocomplete, Button } from '@mui/material';
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

// --- NEW: The Batch Editor for Multi-Selections ---
const MultiPixelEditor = ({ selection }: { selection: CellAtom[] }) => {
  const { deviceList } = useMatrixEditorContext();
  const store = useStore();

  // Calculate the common properties of the selection. useMemo is critical for performance.
  const commonState = useMemo(() => {
    const firstPixelData = store.get(selection[0]);
    let commonDeviceId: string | null = firstPixelData.deviceId;
    let commonGroup: string | null = firstPixelData.group || '';

    for (let i = 1; i < selection.length; i++) {
      const pixelData = store.get(selection[i]);
      if (pixelData.deviceId !== commonDeviceId) commonDeviceId = null;
      if ((pixelData.group || '') !== commonGroup) commonGroup = null;
    }
    return { commonDeviceId, commonGroup };
  }, [selection, store]);

  // Local state for the form inputs
  const [deviceId, setDeviceId] = useState(commonState.commonDeviceId ?? '');
  const [group, setGroup] = useState(commonState.commonGroup ?? '');
  const [startPixel, setStartPixel] = useState(0);

  // Effect to sync local state if the selection changes
  useEffect(() => {
    setDeviceId(commonState.commonDeviceId ?? '');
    setGroup(commonState.commonGroup ?? '');
  }, [commonState]);

  const handleBatchUpdate = (field: 'deviceId' | 'group', value: string) => {
    selection.forEach(atom => {
      store.set(atom, prev => ({ ...prev, [field]: value }));
    });
  };

  const handleRenumber = () => {
    selection.forEach((atom, index) => {
      store.set(atom, prev => ({ ...prev, pixel: startPixel + index }));
    });
  };

  return (
    <Stack spacing={2}>
      <Autocomplete
        freeSolo
        options={deviceList}
        getOptionLabel={(option) => (typeof option === 'string' ? option : option.id)}
        value={deviceList.find(d => d.id === deviceId) || deviceId}
        onChange={(e, newValue) => {
          const newDeviceId = typeof newValue === 'string' ? newValue : newValue?.id || '';
          setDeviceId(newDeviceId);
          handleBatchUpdate('deviceId', newDeviceId);
        }}
        onInputChange={(e, newInputValue) => setDeviceId(newInputValue)}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Device ID"
            variant="filled"
            size="small"
            placeholder={commonState.commonDeviceId === null ? 'Multiple Values' : ''}
          />
        )}
      />
      <TextField
        label="Group"
        value={group}
        onChange={(e) => setGroup(e.target.value)}
        onBlur={() => handleBatchUpdate('group', group)} // Update on blur
        variant="filled"
        size="small"
        fullWidth
        placeholder={commonState.commonGroup === null ? 'Multiple Values' : ''}
      />
      <Stack direction="row" spacing={1} alignItems="center">
        <TextField
          label="Start Pixel #"
          type="number"
          value={startPixel}
          onChange={(e) => setStartPixel(parseInt(e.target.value, 10) || 0)}
          variant="filled"
          size="small"
          fullWidth
        />
        <Button onClick={handleRenumber} variant="outlined" sx={{ px: 5 }}>
          Renumber
        </Button>
      </Stack>
    </Stack>
  );
};


// --- The Main Component ---
export const SelectionDetails = () => {
  const selection = useAtomValue(selectionAtom);
  const hasSingleSelection = selection.length === 1;
  const hasMultipleSelection = selection.length > 1;

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="overline" color="text.secondary" display="block" sx={{ mb: 1.5 }}>
        Selection Details
      </Typography>

      {hasMultipleSelection && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {selection.length} pixels selected.
        </Typography>
      )}
      {hasSingleSelection && <SinglePixelEditor cellAtom={selection[0]} />}

      {hasMultipleSelection && <MultiPixelEditor selection={selection} />}

      {!hasSingleSelection && !hasMultipleSelection && (
        <Typography variant="body2" color="text.secondary">
          No selection.
        </Typography>
      )}
    </Box>
  );
};