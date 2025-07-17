import { Box } from '@mui/material';
import { useAtom, useSetAtom, useAtomValue } from 'jotai';
import { pixelGridHistoryAtom, isPaintingAtom, brushAtom, activeToolAtom } from '../atoms';
import type { CellAtom } from '../atoms';
import { Pixel } from './Pixel';
import { MCell } from '../MatrixStudio.types';

// This component is now correct and self-contained.
const GridCell = ({ cellAtom }: { cellAtom: CellAtom }) => {
  const [cellData, setCellData] = useAtom(cellAtom);
  const [isPainting] = useAtom(isPaintingAtom);
  const [brush] = useAtom(brushAtom);
  const [activeTool] = useAtom(activeToolAtom);

  const applyTool = () => {
    if (activeTool === 'paint' && cellData.deviceId === '') {
      setCellData(brush);
    } else if (activeTool === 'erase' && cellData.deviceId !== '') {
      setCellData(MCell);
    }
  };

  const handleMouseDown = () => {
    // We don't need to set isPainting here, the parent Grid will handle it.
    applyTool();
  };

  const handleMouseEnter = () => {
    if (isPainting) {
      applyTool();
    }
  };

  return (
    <Box
      onMouseDown={handleMouseDown}
      onMouseEnter={handleMouseEnter}
      sx={{
        backgroundColor: '#222',
        cursor: 'crosshair',
      }}
    >
      <Pixel cellAtom={cellAtom} />
    </Box>
  );
};


export const Grid = () => {
  // --- THE FIX ---
  // We get the grid of atoms from the HISTORY atom, not the target atom.
  const gridHistory = useAtomValue(pixelGridHistoryAtom);
  const pixelGrid = [...gridHistory.values()][0] || [];

  // We get the setter for the isPainting state.
  const setIsPainting = useSetAtom(isPaintingAtom);

  // We need to wrap the mouse down handler to set the global painting state.
  const handleMouseDown = () => {
    setIsPainting(true);
  };

  const handleMouseUp = () => {
    setIsPainting(false);
  };

  const rows = pixelGrid.length;
  const cols = pixelGrid[0]?.length || 0;

  if (rows === 0 || cols === 0) {
    return null; 
  }

  return (
    <Box
      onMouseDown={handleMouseDown} // Start painting when mouse is down anywhere on the grid
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      sx={{
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
        width: '100%',
        height: '100%',
        border: `1px solid #444`,
        backgroundColor: '#111',
        gap: '1px',
        userSelect: 'none',
      }}
    >
      {pixelGrid.map((row, rowIndex) =>
        row.map((cellAtom, colIndex) => (
          <GridCell key={`${rowIndex}-${colIndex}`} cellAtom={cellAtom} />
        ))
      )}
    </Box>
  );
};