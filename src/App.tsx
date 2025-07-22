// src/App.tsx

import { useState } from 'react';
import { Box } from '@mui/material';
import { MatrixStudio } from '@/components/MatrixStudio/MatrixStudio';
import type { IMCell, IDevice } from '@/components/MatrixStudio/MatrixStudio.types';
import { DevControls } from '@/components/DevControls';

const simpleLayoutTemplate: IMCell[][] = [
  [{ deviceId: 'dev-1', pixel: 0, group: 'group-1' }, { deviceId: 'dev-1', pixel: 1, group: 'group-1' }],
  [{ deviceId: '', pixel: 0, group: '' }, { deviceId: 'dev-1', pixel: 2, group: 'group-1' }],
];
const emptyLayoutTemplate: IMCell[][] = [];
// --- DEFINE THE NEW DEVICE LIST DATA STRUCTURE ---
const availableDevices: IDevice[] = [
  { id: 'wled-strip-1', count: 150 },
  { id: 'wled-strip-2', count: 300 },
  { id: 'dev-1', count: 50 },
  { id: 'main-matrix', count: 1024 },
];

// ... rest of App component ...
function App() {
  const [matrixData, setMatrixData] = useState<IMCell[][]>(() => JSON.parse(JSON.stringify(simpleLayoutTemplate)));
  const [rows, setRows] = useState(16);
  const [cols, setCols] = useState(20); 

  const handleSave = (data: IMCell[][]) => {
    console.log("SAVED DATA:", data);
    alert('Matrix data saved! Check the console.');
  };

  // The generic layout loader
  const loadLayout = (layout: IMCell[][], newRows: number, newCols: number) => {
    setRows(newRows);
    setCols(newCols);
    setMatrixData(JSON.parse(JSON.stringify(layout)));
  };

  // Specific handlers to pass down to the controls component
  const handleLoadEmpty = () => loadLayout(emptyLayoutTemplate, 8, 8);
  const handleLoadSimple = () => loadLayout(simpleLayoutTemplate, 16, 20);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', bgcolor: '#121212' }}>
      <DevControls onLoadEmpty={handleLoadEmpty} onLoadSimple={handleLoadSimple} />
      <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
        <MatrixStudio
          key={`${rows}-${cols}-${JSON.stringify(matrixData)}`} 
          initialData={matrixData}
          rows={rows}
          cols={cols}
          onSave={handleSave}
          deviceList={availableDevices}
        />
      </Box>
    </Box>
  );
}

export default App;