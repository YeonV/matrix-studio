// src/App.tsx

import { useState, useCallback  } from 'react';
import { Box } from '@mui/material';
import { MatrixStudio } from '@/components/MatrixStudio/MatrixStudio';
import { type IMCell, type IDevice, MCell, type ILayoutFile } from '@/components/MatrixStudio/MatrixStudio.types';
import { DevControls } from '@/components/DevControls';

const simpleLayoutTemplate: IMCell[][] = [
  [{ deviceId: 'dev-1', pixel: 0, group: 'group-1' }, { deviceId: 'dev-1', pixel: 1, group: 'group-1' }],
  [{ deviceId: '', pixel: 0, group: '' }, { deviceId: 'dev-1', pixel: 2, group: 'group-1' }],
];
const emptyLayoutTemplate: IMCell[][] = [];
// --- DEFINE THE NEW DEVICE LIST DATA STRUCTURE ---
const initialDevices: IDevice[] = [
  { id: 'wled-strip-1', count: 150 },
  { id: 'wled-strip-2', count: 300 },
  { id: 'dev-1', count: 50 },
  { id: 'main-matrix', count: 1024 },
];

/**
 * Resizes a 2D matrix, preserving existing data.
 * - Truncates rows/columns if the new size is smaller.
 * - Pads with empty cells if the new size is larger.
 * @param matrix The original matrix data.
 * @param newRows The target number of rows.
 * @param newCols The target number of columns.
 * @returns The resized matrix.
 */
const resizeMatrix = (matrix: IMCell[][], newRows: number, newCols: number): IMCell[][] => {
  const newMatrix: IMCell[][] = [];
  for (let r = 0; r < newRows; r++) {
    const newRow: IMCell[] = [];
    for (let c = 0; c < newCols; c++) {
      newRow.push(matrix[r]?.[c] || MCell);
    }
    newMatrix.push(newRow);
  }
  return newMatrix;
};



// ... rest of App component ...
function App() {
  // The "active" state for the MatrixStudio component
  const [activeRows, setActiveRows] = useState(16);
  const [activeCols, setActiveCols] = useState(20);
  const [matrixData, setMatrixData] = useState<IMCell[][]>(() => resizeMatrix(simpleLayoutTemplate, 16, 20));
  const [availableDevices, setAvailableDevices] = useState<IDevice[]>(initialDevices);

  // The "draft" state bound to the sliders
  const [draftRows, setDraftRows] = useState(activeRows);
  const [draftCols, setDraftCols] = useState(activeCols);

  const handleSave = (data: IMCell[][]) => {
    console.log("SAVED DATA:", data);
    alert('Matrix data saved! Check the console.');
  };

 const loadLayout = (layout: IMCell[][], newRows: number, newCols: number) => {
    setActiveRows(newRows);
    setActiveCols(newCols);
    setDraftRows(newRows);
    setDraftCols(newCols);
    // Ensure the loaded layout matches the dimensions
    setMatrixData(resizeMatrix(layout, newRows, newCols));
  };
  const handleLoadEmpty = () => loadLayout(emptyLayoutTemplate, 8, 8);
  const handleLoadSimple = () => loadLayout(simpleLayoutTemplate, 16, 20);

  // --- REFINED RESIZE HANDLER ---
  const handleApplyResize = () => {
    setActiveRows(draftRows);
    setActiveCols(draftCols);
    // Use the utility to resize the *current* data, not reset it
    setMatrixData(prevData => resizeMatrix(prevData, draftRows, draftCols));
  };

 const handleMatrixChange = useCallback((newData: IMCell[][]) => {
    setMatrixData(newData);
  }, []);

const handleLoadLayoutFromFile = useCallback((layoutFile: ILayoutFile) => {
  const { rows, cols, matrixData, deviceList } = layoutFile;
  
  // If the file includes a device list, overwrite the current one.
  if (deviceList && Array.isArray(deviceList)) {
    setAvailableDevices(deviceList);
  }

  // Use the rest of the data to update the layout
  setActiveRows(rows);
  setActiveCols(cols);
  setDraftRows(rows);
  setDraftCols(cols);
  setMatrixData(resizeMatrix(matrixData, rows, cols));
  console.log(`Loaded layout: ${rows}x${cols} with ${deviceList ? 'new' : 'existing'} devices.`);
}, []);


  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', bgcolor: '#121212' }}>
      <DevControls
        onLoadEmpty={handleLoadEmpty}
        onLoadSimple={handleLoadSimple}
        onApplyResize={handleApplyResize}
        rows={draftRows}
        cols={draftCols}
        onRowsChange={setDraftRows}
        onColsChange={setDraftCols}
      />
      <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
        <MatrixStudio
          key={`${activeRows}-${activeCols}`} 
          initialData={matrixData}
          rows={activeRows}
          cols={activeCols}
          onSave={handleSave}
          onChange={handleMatrixChange}
          deviceList={availableDevices}
          onLoadLayout={handleLoadLayoutFromFile}
        />
      </Box>
    </Box>
  );
}

export default App;