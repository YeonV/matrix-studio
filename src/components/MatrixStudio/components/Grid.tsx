// src/components/MatrixStudio/components/Grid.tsx

import { Box } from '@mui/material';
import { useAtom, useSetAtom, useAtomValue } from 'jotai';
import {
  pixelGridTargetAtom,
  isInteractingAtom,
  dragStateAtom,
  createCellAtom,
  type CellAtom,
} from '../atoms';
import { MCell } from '../MatrixStudio.types';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import GridCell from './GridCell';

export const Grid = () => {
  const setPixelGrid = useSetAtom(pixelGridTargetAtom);
  const setIsInteracting = useSetAtom(isInteractingAtom);
  const [dragState, setDragState] = useAtom(dragStateAtom);
  const pixelGrid = useAtomValue(pixelGridTargetAtom);

  const rows = pixelGrid.length;
  const cols = pixelGrid[0]?.length || 0;

  const handleCellDrop = (dropTargetR: number, dropTargetC: number) => {
    if (!dragState || !dragState.isDragging || !dragState.draggedFrom) return;

    const { draggedAtoms, draggedFrom } = dragState;
    const deltaR = dropTargetR - draggedFrom.r;
    const deltaC = dropTargetC - draggedFrom.c;

    setPixelGrid(grid => {
      const positions: { r: number, c: number, atom: CellAtom }[] = [];
      grid.forEach((row, r) => {
        row.forEach((atom, c) => {
          if (draggedAtoms.includes(atom)) {
            positions.push({ r, c, atom });
          }
        });
      });

      const nextGrid = grid.map(r => [...r]);

      for (const pos of positions) {
        nextGrid[pos.r][pos.c] = createCellAtom(MCell);
      }

      for (const pos of positions) {
        const newR = pos.r + deltaR;
        const newC = pos.c + deltaC;

        if (newR >= 0 && newR < rows && newC >= 0 && newC < cols) {
          nextGrid[newR][newC] = pos.atom;
        }
      }
      return nextGrid;
    });
  };
  
  // --- CURSOR LOGIC FOR PANNING ---
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    // On right-click, set the cursor to 'grabbing' for pan feedback
    if (e.button === 2) {
      e.currentTarget.style.cursor = 'grabbing';
    }
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
    // Always reset cursor to default on mouse up
    e.currentTarget.style.cursor = 'default';
    setIsInteracting(false);
    setDragState(null);
  };
  // --- END CURSOR LOGIC ---

  const handleMouseMove = (e: React.MouseEvent) => {
    if (dragState && !dragState.isDragging && e.buttons === 1) {
      setDragState({ ...dragState, isDragging: true });
    }
  };

  return (
    <Box
      onContextMenu={(e) => e.preventDefault()}
      onMouseDown={handleMouseDown} // <-- Updated handler
      onMouseUp={handleMouseUp}       // <-- Updated handler
      onMouseLeave={handleMouseUp}
      onMouseMove={handleMouseMove}
      sx={{ width: '100%', height: '100%', cursor: 'default', backgroundColor: '#111' }}
    >
      <TransformWrapper limitToBounds={false} minScale={0.2} maxScale={8} panning={{ disabled: false }} wheel={{ step: 0.05 }}>
        <TransformComponent wrapperStyle={{ width: '100%', height: '100%' }}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: `repeat(${cols}, 50px)`,
              gridTemplateRows: `repeat(${rows}, 50px)`,
              width: `${cols * 50}px`,
              height: `${rows * 50}px`,
              gap: '1px',
              userSelect: 'none',
            }}
          >
            {pixelGrid.map((row, r) =>
              row.map((cellAtom, c) => (
                <GridCell key={`${r}-${c}`} cellAtom={cellAtom} rowIndex={r} colIndex={c} onDrop={handleCellDrop} />
              ))
            )}
          </Box>
        </TransformComponent>
      </TransformWrapper>
    </Box>
  );
};