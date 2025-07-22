// src/components/MatrixStudio/components/SelectionDetails.tsx

import { useAtom, useAtomValue, useSetAtom, useStore } from 'jotai';
import { useMemo, useState, useEffect } from 'react';
import { Box, Stack, TextField, Typography, Autocomplete, Button } from '@mui/material';
import { selectionAtom, type CellAtom, historyGridDataAtom, pixelGridTargetAtom } from '../atoms';
import { useMatrixEditorContext } from '../MatrixStudioContext';

const SinglePixelEditor = ({ cellAtom }: { cellAtom: CellAtom }) => {
  const [cellData] = useAtom(cellAtom); // Read-only to display current data
  const { deviceList } = useMatrixEditorContext();
  const setGridData = useSetAtom(historyGridDataAtom);
  const pixelGrid = useAtomValue(pixelGridTargetAtom);

  const handleChange = (field: string, value: string | number) => {
    setGridData(prevGrid => {
      // Find the r, c of the atom we're editing
      for (let r = 0; r < pixelGrid.length; r++) {
        const c = pixelGrid[r].indexOf(cellAtom);
        if (c !== -1) {
          const newGrid = prevGrid.map(row => [...row]);
          const newCellData = { ...newGrid[r][c], [field]: value };
          newGrid[r][c] = newCellData;
          return newGrid;
        }
      }
      return prevGrid; // Should not happen
    });
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
        error={maxPixel !== undefined && (cellData.pixel > maxPixel || cellData.pixel < 0)}
        helperText={maxPixel !== undefined && (cellData.pixel > maxPixel || cellData.pixel < 0) ? `Range: 0 - ${maxPixel}` : ''}
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

const MultiPixelEditor = ({ selection }: { selection: Set<CellAtom> }) => {
  const { deviceList } = useMatrixEditorContext();
  const setGridData = useSetAtom(historyGridDataAtom);
  const pixelGrid = useAtomValue(pixelGridTargetAtom);
  const store = useStore(); // For reading initial common state
  
  const selectionArray = useMemo(() => Array.from(selection), [selection]);

  const commonState = useMemo(() => {
    if (selectionArray.length === 0) return { commonDeviceId: '', commonGroup: '' };
    const firstPixelData = store.get(selectionArray[0]);
    let commonDeviceId: string | null = firstPixelData.deviceId;
    let commonGroup: string | null = firstPixelData.group || '';
    for (let i = 1; i < selectionArray.length; i++) {
      const pixelData = store.get(selectionArray[i]);
      if (pixelData.deviceId !== commonDeviceId) commonDeviceId = null;
      if ((pixelData.group || '') !== commonGroup) commonGroup = null;
    }
    return { commonDeviceId, commonGroup };
  }, [selectionArray, store]);

  const [deviceId, setDeviceId] = useState(commonState.commonDeviceId ?? '');
  const [group, setGroup] = useState(commonState.commonGroup ?? '');
  const [startPixel, setStartPixel] = useState(0);

  useEffect(() => {
    setDeviceId(commonState.commonDeviceId ?? '');
    setGroup(commonState.commonGroup ?? '');
  }, [commonState]);

  const handleBatchUpdate = (field: 'deviceId' | 'group', value: string) => {
    setGridData(prevGrid => {
      const newGrid = prevGrid.map(row => [...row]);
      pixelGrid.forEach((row, r) => row.forEach((atom, c) => {
        if (selection.has(atom)) {
          newGrid[r][c] = { ...newGrid[r][c], [field]: value };
        }
      }));
      return newGrid;
    });
  };

  const handleRenumber = () => {
    setGridData(prevGrid => {
      const newGrid = prevGrid.map(row => [...row]);
      let count = 0;
      pixelGrid.forEach((row, r) => row.forEach((atom, c) => {
        if (selection.has(atom)) {
          newGrid[r][c] = { ...newGrid[r][c], pixel: startPixel + count };
          count++;
        }
      }));
      return newGrid;
    });
  };
  
  return (
    <Stack spacing={2}>
      <Autocomplete
        freeSolo
        options={deviceList}
        getOptionLabel={(option) => (typeof option === 'string' ? option : option.id)}
        value={deviceList.find(d => d.id === deviceId) || deviceId}
        onChange={(_event, newValue) => {
          const newDeviceId = typeof newValue === 'string' ? newValue : newValue?.id || '';
          setDeviceId(newDeviceId);
          handleBatchUpdate('deviceId', newDeviceId);
        }}
        onInputChange={(_event, newInputValue) => setDeviceId(newInputValue)}
        renderInput={(params) => (
          <TextField {...params} label="Device ID" variant="filled" size="small" placeholder={commonState.commonDeviceId === null ? 'Multiple Values' : ''} />
        )}
      />
      <TextField
        label="Group"
        value={group}
        onChange={(e) => setGroup(e.target.value)}
        onBlur={() => handleBatchUpdate('group', group)}
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

export const SelectionDetails = () => {
  const selection = useAtomValue(selectionAtom);
  const hasSingleSelection = selection.size === 1;
  const hasMultipleSelection = selection.size > 1;
  const singleSelectedAtom = hasSingleSelection ? selection.values().next().value : null;

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="overline" color="text.secondary" display="block" sx={{ mb: 1.5 }}>
        Selection Details
      </Typography>
      {hasMultipleSelection && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {selection.size} pixels selected.
        </Typography>
      )}
      {hasSingleSelection && singleSelectedAtom && <SinglePixelEditor cellAtom={singleSelectedAtom} />}
      {hasMultipleSelection && <MultiPixelEditor selection={selection} />}
      {!hasSingleSelection && !hasMultipleSelection && (
        <Typography variant="body2" color="text.secondary">No selection.</Typography>
      )}
    </Box>
  );
};