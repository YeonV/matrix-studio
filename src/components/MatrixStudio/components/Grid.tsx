// src/components/MatrixStudio/components/Grid.tsx

import { Box } from '@mui/material';
import { useAtom, useSetAtom, useAtomValue, useStore } from 'jotai';
import {
  pixelGridTargetAtom,
  isInteractingAtom,
  dragStateAtom,
  isGroupAutoIncrementAtom,
  strokeAtomsAtom,
  brushAtom,
  historyGridDataAtom,
  type CellAtom,
} from '../atoms';
import { MCell, type IMCell } from '../MatrixStudio.types';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import GridCell from './GridCell';
import { useMatrixEditorContext } from '../MatrixStudioContext';
import React from 'react';

export const Grid = () => {
  const setGridData = useSetAtom(historyGridDataAtom);
  const setIsInteracting = useSetAtom(isInteractingAtom);
  const setStrokeAtoms = useSetAtom(strokeAtomsAtom);
  const [dragState, setDragState] = useAtom(dragStateAtom);
  const pixelGrid = useAtomValue(pixelGridTargetAtom); // Read-only atom grid for rendering
  const store = useStore();
  const { deviceList } = useMatrixEditorContext();

  const isGroupIncrement = useAtomValue(isGroupAutoIncrementAtom);
  const strokeAtoms = useAtomValue(strokeAtomsAtom);
  const setBrushData = useSetAtom(brushAtom);

  const rows = pixelGrid.length;
  const cols = pixelGrid[0]?.length || 0;
  const CELL_SIZE = 50;
  const GAP_SIZE = 1;
  const fullCellSize = CELL_SIZE + GAP_SIZE;

  const handleValidateDrop = (targetR: number, targetC: number) => {
    // --- THE FIX: Correctly get the current grid data ---
    const historyState = store.get(historyGridDataAtom);
    const currentGridData = [...historyState.values()][0];
    
    if (!dragState || !dragState.draggedFrom || !currentGridData) return;

    const { draggedAtoms, draggedFrom } = dragState;
    const deltaR = targetR - draggedFrom.r;
    const deltaC = targetC - draggedFrom.c;
    const draggedAtomsSet = new Set(draggedAtoms);
    
    const originalPositions = new Map<CellAtom, { r: number, c: number }>();
    pixelGrid.forEach((row, r) => row.forEach((atom, c) => {
      if (draggedAtomsSet.has(atom)) originalPositions.set(atom, { r, c });
    }));
    
    const newDropPreview: { r: number; c: number; status: 'valid' | 'colliding' }[] = [];
    for (const atom of draggedAtoms) {
      const originalPos = originalPositions.get(atom);
      if (!originalPos) continue;

      const newR = originalPos.r + deltaR;
      const newC = originalPos.c + deltaC;
      let status: 'valid' | 'colliding' = 'valid';
      if (newR < 0 || newR >= rows || newC < 0 || newC >= cols) {
        status = 'colliding';
      } else {
        const targetCellData = currentGridData[newR]?.[newC];
        const targetCellAtom = pixelGrid[newR]?.[newC];
        if (targetCellData && targetCellData.deviceId !== '' && !draggedAtomsSet.has(targetCellAtom)) {
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

    setGridData(prevGrid => {
      const draggedAtomsSet = new Set(draggedAtoms);
      const positions: { r: number, c: number, data: IMCell }[] = [];
      
      prevGrid.forEach((row, r) => row.forEach((cellData, c) => {
        const cellAtom = pixelGrid[r]?.[c];
        if (cellAtom && draggedAtomsSet.has(cellAtom)) {
          positions.push({ r, c, data: cellData });
        }
      }));

      const newGrid = prevGrid.map(r => [...r]);
      for (const pos of positions) newGrid[pos.r][pos.c] = MCell;
      for (const pos of positions) {
        const newR = pos.r + deltaR;
        const newC = pos.c + deltaC;
        if (newR >= 0 && newR < rows && newC >= 0 && newC < cols) {
          newGrid[newR][newC] = pos.data;
        }
      }
      return newGrid;
    });
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.cursor = 'default';

    if (isGroupIncrement && strokeAtoms.length > 0) {
      const newGroupId = `g-${Date.now().toString(36)}`;
      const strokeAtomsSet = new Set(strokeAtoms);
      
      setGridData(prevGrid => {
        const newGrid = prevGrid.map(r => [...r]);
        pixelGrid.forEach((row, r) => row.forEach((atom, c) => {
          if (strokeAtomsSet.has(atom)) {
            newGrid[r][c] = { ...newGrid[r][c], group: newGroupId };
          }
        }));
        return newGrid;
      });
      setBrushData(prev => ({ ...prev, group: newGroupId }));
    }

    const brushValue = store.get(brushAtom);
    const selectedDevice = deviceList.find(d => d.id === brushValue.deviceId);
    if (selectedDevice && brushValue.pixel >= selectedDevice.count) {
      setBrushData(prev => ({ ...prev, pixel: selectedDevice.count - 1 }));
    }

    setIsInteracting(false);
    setDragState(null);
    setStrokeAtoms([]);
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
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: `repeat(${cols}, ${CELL_SIZE}px)`,
              gridTemplateRows: `repeat(${rows}, ${CELL_SIZE}px)`,
              width: `${cols * fullCellSize}px`,
              height: `${rows * fullCellSize}px`,
              gap: `${GAP_SIZE}px`,
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