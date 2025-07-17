import { useState } from 'react';
import { Box, Button, Stack, Typography } from '@mui/material';
// We no longer import MatrixStudioRef because it doesn't exist anymore.
import { MatrixStudio } from '@/components/MatrixStudio/MatrixStudio';
import type { IMCell } from '@/components/MatrixStudio/MatrixStudio.types';

// Templates for our layouts
const emptyLayoutTemplate: IMCell[][] = [];
const simpleLayoutTemplate: IMCell[][] = [
  [{ deviceId: 'dev-1', pixel: 0, group: 'group-1' }, { deviceId: 'dev-1', pixel: 1, group: 'group-1' }],
  [{ deviceId: '', pixel: 0, group: '' }, { deviceId: 'dev-1', pixel: 2, group: 'group-1' }],
];

function App() {
  const [matrixData, setMatrixData] = useState<IMCell[][]>(() => JSON.parse(JSON.stringify(simpleLayoutTemplate)));
  const [rows, setRows] = useState(16);
  const [cols, setCols] = useState(20);

  // The ref is no longer needed for undo/redo, so we can remove it.
  // const matrixStudioRef = useRef<MatrixStudioRef>(null);

  const handleSave = (data: IMCell[][]) => {
    console.log("SAVED DATA:", data);
    alert('Matrix data saved! Check the console.');
  };

  const loadLayout = (layout: IMCell[][], newRows: number, newCols: number) => {
    setRows(newRows);
    setCols(newCols);
    // We still use a deep copy to ensure React sees a new prop object.
    setMatrixData(JSON.parse(JSON.stringify(layout)));
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', bgcolor: '#121212' }}>
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
        <Typography variant="h5" component="h1">MatrixStudio Dev Playground</Typography>
        <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
          <Button variant="outlined" onClick={() => loadLayout(emptyLayoutTemplate, 8, 8)}>Load Empty 8x8</Button>
          <Button variant="outlined" onClick={() => loadLayout(simpleLayoutTemplate, 16, 20)}>Load Simple Layout</Button>
          
          {/* Undo/Redo buttons are removed for now. We will add them back correctly later. */}
        </Stack>
      </Box>
      <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
        {/* The key prop is still valuable to ensure a clean re-mount when loading new data. */}
        <MatrixStudio
          key={`${rows}-${cols}-${JSON.stringify(matrixData)}`} 
          initialData={matrixData}
          rows={rows}
          cols={cols}
          onSave={handleSave}
        />
      </Box>
    </Box>
  );
}

export default App;