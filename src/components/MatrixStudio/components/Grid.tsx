// src/components/MatrixStudio/components/Grid.tsx

import { Box } from '@mui/material';
import { useAtom, useSetAtom, useAtomValue, useStore } from 'jotai';
import {
  pixelGridTargetAtom,
  isInteractingAtom,
  dragStateAtom,
  createCellAtom,
  type CellAtom,
  isGroupAutoIncrementAtom, // <-- New import
  strokeAtomsAtom,         // <-- New import
  brushAtom,               // <-- New import
} from '../atoms';
import { MCell } from '../MatrixStudio.types';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import GridCell from './GridCell';

export const Grid = () => {
  
  const setPixelGrid = useSetAtom(pixelGridTargetAtom);
  const setIsInteracting = useSetAtom(isInteractingAtom);
  const setStrokeAtoms = useSetAtom(strokeAtomsAtom);
  const [dragState, setDragState] = useAtom(dragStateAtom);
  const pixelGrid = useAtomValue(pixelGridTargetAtom);
  const store = useStore();

  // --- NEW HOOKS FOR ON-RELEASE LOGIC ---
  const isGroupIncrement = useAtomValue(isGroupAutoIncrementAtom);
  const strokeAtoms = useAtomValue(strokeAtomsAtom);
  const setBrushData = useSetAtom(brushAtom); // <-- The clean way to get the setter

  const rows = pixelGrid.length;
  const cols = pixelGrid[0]?.length || 0;

  const handleValidateDrop = (targetR: number, targetC: number) => {
    if (!dragState || !dragState.draggedFrom) return;
    const { draggedAtoms, draggedFrom } = dragState;
    const deltaR = targetR - draggedFrom.r;
    const deltaC = targetC - draggedFrom.c;
    const draggedAtomsSet = new Set(draggedAtoms);
    const newDropPreview: { r: number; c: number; status: 'valid' | 'colliding' }[] = [];
    for (const atom of draggedAtoms) {
      let originalR = -1, originalC = -1;
      for (let r = 0; r < rows; r++) {
        const c = pixelGrid[r].indexOf(atom);
        if (c !== -1) { originalR = r; originalC = c; break; }
      }
      if (originalR === -1) continue;
      const newR = originalR + deltaR;
      const newC = originalC + deltaC;
      let status: 'valid' | 'colliding' = 'valid';
      if (newR < 0 || newR >= rows || newC < 0 || newC >= cols) {
        status = 'colliding';
      } else {
        const targetCellAtom = pixelGrid[newR][newC];
        const targetCellData = store.get(targetCellAtom);
        if (targetCellData.deviceId !== '' && !draggedAtomsSet.has(targetCellAtom)) {
          status = 'colliding';
        }
      }
      newDropPreview.push({ r: newR, c: newC, status });
    }
    const hasCollision = newDropPreview.some(p => p.status === 'colliding');
    setDragState(prev => (prev ? { ...prev, isCollision: hasCollision, dropPreview: newDropPreview } : null));
  };

  const handleCellDrop = (dropTargetR: number, dropTargetC: number) => {
    if (!dragState || !dragState.isDragging || !dragState.draggedFrom || dragState.isCollision) return;
    const { draggedAtoms, draggedFrom } = dragState;
    const deltaR = dropTargetR - draggedFrom.r;
    const deltaC = dropTargetC - draggedFrom.c;
    setPixelGrid(grid => {
      const positions: { r: number, c: number, atom: CellAtom }[] = [];
      grid.forEach((row, r) => row.forEach((atom, c) => {
        if (draggedAtoms.includes(atom)) positions.push({ r, c, atom });
      }));
      const nextGrid = grid.map(r => [...r]);
      for (const pos of positions) nextGrid[pos.r][pos.c] = createCellAtom(MCell);
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
    // if (strokeAtoms.length > 0) {
    //   const currentData = pixelGrid.map(row => row.map(cellAtom => store.get(cellAtom)));
    //   const newGridOfNewAtoms = currentData.map(row => row.map(cellData => createCellAtom(cellData)));
    //   setPixelGrid(newGridOfNewAtoms);
    // }

    // --- NEW "ON RELEASE" LOGIC ---
    if (isGroupIncrement && strokeAtoms.length > 0) {
      const newGroupId = `g-${Date.now().toString(36)}`;
      strokeAtoms.forEach(atom => {
        const currentData = store.get(atom);
        store.set(atom, { ...currentData, group: newGroupId });
      });
      setBrushData(prev => ({ ...prev, group: newGroupId }));
    }

    // Reset interaction states
    setIsInteracting(false);
    setDragState(null);
    setStrokeAtoms([]); // Clear the stroke
  };
  
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button === 2) e.currentTarget.style.cursor = 'grabbing';
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (dragState && !dragState.isDragging && e.buttons === 1) {
      setDragState({ ...dragState, isDragging: true, isCollision: false, dropPreview: [] });
    }
  };

  return (
    <Box onContextMenu={(e) => e.preventDefault()} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp} onMouseMove={handleMouseMove} sx={{ width: '100%', height: '100%', cursor: 'default', backgroundColor: '#111' }}>
      <TransformWrapper
        limitToBounds={false}
        minScale={0.2}
        maxScale={8}
        panning={{ disabled: false }}
        wheel={{ step: 0.05 }}
        doubleClick={{ disabled: true }}
      >
        <TransformComponent wrapperStyle={{ width: '100%', height: '100%' }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 50px)`, gridTemplateRows: `repeat(${rows}, 50px)`, width: `${cols * 50}px`, height: `${rows * 50}px`, gap: '1px', userSelect: 'none' }}>
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