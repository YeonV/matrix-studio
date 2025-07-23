// src/components/MatrixStudio/MatrixStudio.tsx

import type { MatrixStudioProps } from './MatrixStudio.types';
import { Provider as JotaiProvider } from 'jotai';
import { useAtomValue } from 'jotai';
import { Box, Stack } from '@mui/material';
import { useMatrixStudio } from './useMatrixStudio';
import { Grid } from './components/Grid';
import { MatrixStudioContext } from './MatrixStudioContext';
import { DragPreview } from './components/DragPreview';
import { selectionAtom } from './atoms';
import { SelectionDetails } from './components/SelectionDetails';
import { StateBridge } from '../StateBridge';
import { useFileDrop } from './hooks/useFileDrop';
import { FileDropOverlay } from './components/FileDropOverlay';
import { Toolbar } from '../Toolbar';
import { PropertiesPanel } from './components/PropertiesPanel';

const MatrixStudioCore = (props: MatrixStudioProps) => {
  const matrixApi = useMatrixStudio(props); 
  const selection = useAtomValue(selectionAtom);
  const isDetailsVisible = selection.size > 0;
 
  const { isDragOver, dropZoneProps } = useFileDrop({ 
    onFileDrop: props.onFileDrop!,
  });
  console.log(props.ledFxOrigin)
  return (
    <MatrixStudioContext.Provider value={matrixApi}>
      <StateBridge onChange={props.onChange} />
      <DragPreview />
      <Toolbar
          canUndo={matrixApi.canUndo}
          onUndo={matrixApi.undo}
          canRedo={matrixApi.canRedo}
          onRedo={matrixApi.redo}
          onResizeClick={props.onResizeClick}
          onLoadClick={props.onLoadClick}
          onExportClick={props.onExportClick}
          onLoadEmpty={props.onLoadEmpty}
          ledFxOrigin={props.ledFxOrigin}
          onSaveAndReturn={props.onSaveAndReturn}
        />
      {/* This is now a 3-column (or 2-column) layout */}
      <Stack direction="row" sx={{ height: '100%', width: '100%' }}>
        {/* --- Column 1: Left Toolbar --- */}
        <Box sx={{ width: 240, borderRight: 1, borderColor: 'divider', flexShrink: 0 }}>
          <PropertiesPanel />
        </Box>

        {/* --- Column 2: Main Grid Content --- */}
        <Box sx={{ flexGrow: 1, p: 2, overflow: 'auto', position: 'relative' }} {...dropZoneProps}>
          <FileDropOverlay isDragOver={isDragOver} />
          <Box sx={{ width: '100%', height: '100%' }}>
            <Grid />
          </Box>
        </Box>
        
        {/* --- Column 3: Right Properties Sidebar (Conditional) --- */}
        <Box
          sx={{
            width: 280,
            flexShrink: 0,
            borderLeft: 1,
            borderColor: 'divider',
           
            transition: 'width 0.2s ease-in-out',
           
            overflow: 'hidden',
            ...(!isDetailsVisible && {
              width: 0,
              borderLeft: 0,
            }),
          }}
        >
          {isDetailsVisible && <SelectionDetails />}
        </Box>
      </Stack>
    </MatrixStudioContext.Provider>
  );
};

export const MatrixStudio = (props: MatrixStudioProps) => {
  return (
    <JotaiProvider>
      <MatrixStudioCore {...props} />
    </JotaiProvider>
  );
};