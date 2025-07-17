import { Provider as JotaiProvider } from 'jotai';
import { Box, Stack } from '@mui/material';
import type { MatrixStudioProps } from './MatrixStudio.types';
import { useMatrixStudio } from './useMatrixStudio';
import { Grid } from './components/Grid';

// This is the inner component that does the actual work.
// It can safely call our hook because it's rendered inside the JotaiProvider.
const MatrixStudioCore = (props: MatrixStudioProps) => {
  // Get the state and dimensions from our central hook.
  const { rows, cols } = useMatrixStudio(props);

  return (
    <Stack direction="row" sx={{ height: '100%', width: '100%' }}>
      {/* TODO: Left Panel for Controls will be built here */}
      <Box sx={{ width: 400, borderRight: 1, borderColor: 'divider', flexShrink: 0 }}>
        <p style={{ color: 'white', padding: '1rem' }}>Controls Placeholder</p>
        <p style={{ color: 'white', padding: '1rem' }}>Rows: {rows}</p>
        <p style={{ color: 'white', padding: '1rem' }}>Cols: {cols}</p>
      </Box>

      {/* Right Panel for the Grid */}
      <Box sx={{ flexGrow: 1, p: 2, overflow: 'auto' }}>
        {/* This is the container that sets the physical size of the grid area */}
        <Box
          sx={{
            width: cols * 50, // Using a 50px cell size for now
            height: rows * 50,
          }}
        >
          <Grid />
        </Box>
      </Box>
    </Stack>
  );
};


// This is the main exported component.
// Its only job is to set up the Jotai Provider to create a unique state scope.
export const MatrixStudio = (props: MatrixStudioProps) => {
  return (
    <JotaiProvider>
      <MatrixStudioCore {...props} />
    </JotaiProvider>
  );
};