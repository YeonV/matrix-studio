// src/App.tsx

import { useState, useCallback, useRef } from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material';
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

// --- DIALOG SUB-COMPONENTS ---

interface ConfirmLoadDialogProps {
  open: boolean;
  layout: ILayoutFile | null;
  onConfirm: () => void;
  onCancel: () => void;
}
const ConfirmLoadDialog = ({ open, layout, onConfirm, onCancel }: ConfirmLoadDialogProps) => {
  if (!layout) return null;
  const layoutName = layout.name ? `'${layout.name}'` : 'a new layout';
  const description = `You are about to load ${layoutName} (${layout.matrixData.length}x${layout.matrixData[0].length}).`;
  return (
    <Dialog open={open} onClose={onCancel}>
      <DialogTitle>Load New Layout?</DialogTitle>
      <DialogContent>
        <DialogContentText>{description}</DialogContentText>
        <DialogContentText sx={{ mt: 1 }}>Your current unsaved work will be overwritten. Are you sure?</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>Cancel</Button>
        <Button onClick={onConfirm} variant="contained" autoFocus>Load Layout</Button>
      </DialogActions>
    </Dialog>
  );
};

interface ExportDialogProps {
  open: boolean;
  onClose: () => void;
  onExport: (name: string) => void;
}
const ExportDialog = ({ open, onClose, onExport }: ExportDialogProps) => {
  const [name, setName] = useState('My Layout');
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Export Layout</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Layout Name"
          type="text"
          fullWidth
          variant="standard"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onExport(name)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={() => onExport(name)} disabled={!name}>Export</Button>
      </DialogActions>
    </Dialog>
  );
};

// --- MAIN APP COMPONENT ---

function App() {
  const [activeRows, setActiveRows] = useState(16);
  const [activeCols, setActiveCols] = useState(20);
  const [matrixData, setMatrixData] = useState<IMCell[][]>(() => resizeMatrix(simpleLayoutTemplate, 16, 20));
  const [draftRows, setDraftRows] = useState(activeRows);
  const [draftCols, setDraftCols] = useState(activeCols);
  const [availableDevices, setAvailableDevices] = useState<IDevice[]>(initialDevices);
  
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [pendingLayout, setPendingLayout] = useState<ILayoutFile | null>(null);
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (data.matrixData) { // Simple validation
          setPendingLayout(data);
          setIsConfirmOpen(true);
        } else { console.error("Invalid layout file"); }
      } catch (error) { console.error("Failed to parse JSON", error); }
    };
    reader.readAsText(file);
  }, []);

  const handleLoadClick = () => fileInputRef.current?.click();
  const handleFileSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) handleFile(file); // Use the master handler
    event.target.value = '';
  };

  
 const confirmLoad = () => { // No useCallback needed here
    if (pendingLayout) {
      const { matrixData, deviceList } = pendingLayout;
      const rows = matrixData.length;
      const cols = matrixData[0].length;
      
      if (deviceList) setAvailableDevices(deviceList);
      setActiveRows(rows);
      setActiveCols(cols);
      setDraftRows(rows);
      setDraftCols(cols);
      setMatrixData(resizeMatrix(matrixData, rows, cols));
    }
    setIsConfirmOpen(false);
    setPendingLayout(null);
  };

    const cancelLoad = () => {
    setIsConfirmOpen(false);
    setPendingLayout(null);
  };


  const handleExport = (name: string) => {
    const layout: ILayoutFile = { name, matrixData, deviceList: availableDevices };
    const blob = new Blob([JSON.stringify(layout, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${name.toLowerCase().replace(/\s+/g, '-') || 'layout'}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setIsExportDialogOpen(false);
  };

  const handleMatrixChange = useCallback((newData: IMCell[][]) => setMatrixData(newData), []);
  const loadLayout = (layout: IMCell[][], newRows: number, newCols: number) => {
    setActiveRows(newRows);
    setActiveCols(newCols);
    setDraftRows(newRows);
    setDraftCols(newCols);
    setMatrixData(resizeMatrix(layout, newRows, newCols));
  };
const handleLoadEmpty = () => loadLayout(emptyLayoutTemplate, 8, 8);
  const handleLoadSimple = () => loadLayout(simpleLayoutTemplate, 16, 20);
  const handleApplyResize = () => {
    setActiveRows(draftRows);
    setActiveCols(draftCols);
    setMatrixData(prevData => resizeMatrix(prevData, draftRows, draftCols));
  }
  


  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', bgcolor: '#121212' }}>
      <input type="file" ref={fileInputRef} onChange={handleFileSelected} style={{ display: 'none' }} accept=".json" />
      <ConfirmLoadDialog open={isConfirmOpen} layout={pendingLayout} onConfirm={confirmLoad} onCancel={cancelLoad} />
      <ExportDialog open={isExportDialogOpen} onClose={() => setIsExportDialogOpen(false)} onExport={handleExport} />

       <DevControls
        onLoadEmpty={handleLoadEmpty}
        onLoadSimple={handleLoadSimple}
        onApplyResize={handleApplyResize}
        rows={draftRows}
        cols={draftCols}
        onRowsChange={setDraftRows}
        onColsChange={setDraftCols}
        onLoadClick={handleLoadClick}
        onExportClick={() => setIsExportDialogOpen(true)}
      />
      <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
        <MatrixStudio
          key={`${activeRows}-${activeCols}`}
          initialData={matrixData}
          rows={activeRows}
          cols={activeCols}
          onChange={handleMatrixChange}
          deviceList={availableDevices}
          onFileDrop={handleFile} // <-- This now receives the raw File object
        />
      </Box>
    </Box>
  );
}

export default App;