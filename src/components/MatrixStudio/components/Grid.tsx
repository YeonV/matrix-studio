// src/components/MatrixStudio/components/Grid.tsx

import { Box } from '@mui/material';
import { useAtom, useSetAtom, useAtomValue, useStore } from 'jotai'; // <-- IMPORT useStore
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

  // --- THE FIX: Get the store instance for imperative reads ---
  const store = useStore();

  const rows = pixelGrid.length;
  const cols = pixelGrid[0]?.length || 0;

  const handleValidateDrop = (targetR: number, targetC: number) => {
    // This function can now safely read atom values inside its logic
    if (!dragState || !dragState.draggedFrom) return;

    const { draggedAtoms, draggedFrom } = dragState;
    const deltaR = targetR - draggedFrom.r;
    const deltaC = targetC - draggedFrom.c;

    const draggedAtomsSet = new Set(draggedAtoms);
    let collisionDetected = false;

    for (const atom of draggedAtoms) {
      let originalR = -1, originalC = -1;
      for (let r = 0; r < rows; r++) {
        const c = pixelGrid[r].indexOf(atom);
        if (c !== -1) {
          originalR = r;
          originalC = c;
          break;
        }
      }
      
      if (originalR === -1) continue;

      const newR = originalR + deltaR;
      const newC = originalC + deltaC;

      if (newR < 0 || newR >= rows || newC < 0 || newC >= cols) {
        collisionDetected = true;
        break;
      }
      
      const targetCellAtom = pixelGrid[newR][newC];
      // --- THE FIX IN ACTION ---
      // Instead of the illegal hook, we use store.get() to read the value
      const targetCellData = store.get(targetCellAtom);
      const targetCellIsEmpty = targetCellData.deviceId === '';
      
      if (!targetCellIsEmpty && !draggedAtomsSet.has(targetCellAtom)) {
        collisionDetected = true;
        break;
      }
    }

    setDragState(prev => (prev ? { ...prev, isCollision: collisionDetected } : null));
  };

  const handleCellDrop = (dropTargetR: number, dropTargetC: number) => {
    if (!dragState || !dragState.isDragging || !dragState.draggedFrom || dragState.isCollision) return;

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

  const handleMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.cursor = 'default';
    setIsInteracting(false);
    setDragState(null);
  };
  
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button === 2) e.currentTarget.style.cursor = 'grabbing';
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (dragState && !dragState.isDragging && e.buttons === 1) {
      setDragState({ ...dragState, isDragging: true, isCollision: false });
    }
  };

  return (
    <Box
      onContextMenu={(e) => e.preventDefault()}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
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
                <GridCell
                  key={`${r}-${c}`}
                  cellAtom={cellAtom}
                  rowIndex={r}
                  colIndex={c}
                  onDrop={handleCellDrop}
                  onValidateDrop={handleValidateDrop}
                />
              ))
            )}
          </Box>
        </TransformComponent>
      </TransformWrapper>
    </Box>
  );
};