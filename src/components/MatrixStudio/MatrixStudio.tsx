// src/components/MatrixStudio/MatrixStudio.tsx

import { Provider as JotaiProvider } from 'jotai';
import { useAtomValue } from 'jotai'; // <-- IMPORT useAtomValue
// import { DevTools } from 'jotai-devtools';
import { Box, Stack } from '@mui/material';
import type { MatrixStudioProps } from './MatrixStudio.types';
import { useMatrixStudio } from './useMatrixStudio';
import { Grid } from './components/Grid';
import { MStudioControls } from './components/MStudioControls';
import { MatrixStudioContext } from './MatrixStudioContext';
import { DragPreview } from './components/DragPreview';
import { selectionAtom } from './atoms'; // <-- IMPORT selectionAtom
import { SelectionDetails } from './components/SelectionDetails'; // <-- IMPORT SelectionDetails
import { StateBridge } from '../StateBridge';
import { useFileDrop } from './hooks/useFileDrop';
import { FileDropOverlay } from './components/FileDropOverlay';

const MatrixStudioCore = (props: MatrixStudioProps) => {
  const matrixApi = useMatrixStudio(props);
  // Read the selection state to determine if the right sidebar should be visible.
  const selection = useAtomValue(selectionAtom);
  const isDetailsVisible = selection.size > 0;


  // Use our new hook
  const { isDragOver, dropZoneProps } = useFileDrop({ 
    onFileDrop: props.onFileDrop!,
  });

  return (
    <MatrixStudioContext.Provider value={matrixApi}>
       <StateBridge onChange={props.onChange} />
      {/* <DevTools /> */}
      <DragPreview />
      {/* This is now a 3-column (or 2-column) layout */}
      <Stack direction="row" sx={{ height: '100%', width: '100%' }}>
        {/* --- Column 1: Left Toolbar --- */}
        <Box sx={{ width: 240, borderRight: 1, borderColor: 'divider', flexShrink: 0 }}>
          <MStudioControls />
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
            width: 280, // A good fixed width for a properties panel
            flexShrink: 0,
            borderLeft: 1,
            borderColor: 'divider',
            // Animate the sidebar's appearance and disappearance
            transition: 'width 0.2s ease-in-out',
            // Use width to hide instead of display:none for a smooth animation
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