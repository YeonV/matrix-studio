import { Provider as JotaiProvider } from 'jotai';
import { Box, Stack } from '@mui/material';
import type { MatrixStudioProps } from './MatrixStudio.types';
import { useMatrixStudio } from './useMatrixStudio';
import { Grid } from './components/Grid';
import { MStudioControls } from './components/MStudioControls';
import { MatrixStudioContext } from './MatrixStudioContext';

const MatrixStudioCore = (props: MatrixStudioProps) => {
  const matrixApi = useMatrixStudio(props);

  return (
    // Provide the API to all children
    <MatrixStudioContext.Provider value={matrixApi}>
      <Stack direction="row" sx={{ height: '100%', width: '100%' }}>
        <Box sx={{ width: 80, borderRight: 1, borderColor: 'divider', flexShrink: 0 }}>
          <MStudioControls />
        </Box>
        <Box sx={{ flexGrow: 1, p: 2, overflow: 'auto' }}>
          <Box
            sx={{
              width: matrixApi.cols * 50,
              height: matrixApi.rows * 50,
            }}
          >
            <Grid />
          </Box>
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