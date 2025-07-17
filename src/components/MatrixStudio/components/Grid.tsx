import { Box } from '@mui/material';
import { useAtom, useSetAtom } from 'jotai';
import { pixelGridAtom, isPaintingAtom, brushAtom } from '../atoms';
import type { CellAtom } from '../atoms';
import { Pixel } from './Pixel';

// This is a new component for a single interactive cell.
// It encapsulates the paint logic for one cell.
const GridCell = ({ cellAtom }: { cellAtom: CellAtom }) => {
  const [cellData, setCellData] = useAtom(cellAtom);
  const [isPainting, setIsPainting] = useAtom(isPaintingAtom);
  const [brush] = useAtom(brushAtom);

  const handleMouseDown = () => {
    // Start painting when the user clicks down
    setIsPainting(true);
    // Paint the first cell immediately if it's empty
    if (cellData.deviceId === '') {
      setCellData(brush);
    }
  };

  const handleMouseEnter = () => {
    // If the mouse enters this cell AND we are in painting mode...
    if (isPainting && cellData.deviceId === '') {
      // ...paint this cell.
      setCellData(brush);
    }
  };

  return (
    <Box
      onMouseDown={handleMouseDown}
      onMouseEnter={handleMouseEnter}
      sx={{
        backgroundColor: '#222',
        cursor: 'crosshair', // Give the user feedback that they can paint
      }}
    >
      <Pixel cellAtom={cellAtom} />
    </Box>
  );
};


export const Grid = () => {
  const [pixelGrid] = useAtom(pixelGridAtom);
  // We need a global mouse up handler to stop painting
  // even if the user releases the mouse outside the grid.
  const setIsPainting = useSetAtom(isPaintingAtom);

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
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp} // Also stop painting if the mouse leaves the grid area
      sx={{
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
        width: '100%',
        height: '100%',
        border: `1px solid #444`,
        backgroundColor: '#111',
        gap: '1px',
        // Prevent text selection while dragging
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