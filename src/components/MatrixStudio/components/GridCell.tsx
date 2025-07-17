// src/components/MatrixStudio/components/GridCell.tsx

import { useState } from 'react';
import { useAtom, useSetAtom, useAtomValue } from 'jotai';
import {
  activeToolAtom,
  isInteractingAtom,
  brushAtom,
  selectionAtom,
  dragStateAtom,
  type CellAtom,
} from '../atoms';
import { MCell } from '../MatrixStudio.types';
import { Box } from '@mui/material';
import { Pixel } from './Pixel';

// --- (Cursor definitions are unchanged) ---
const paintCursorSVG = `<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="#FFFFFF"/></svg>`;
const encodedPaintCursor = encodeURIComponent(paintCursorSVG).replace(/'/g, '%27').replace(/"/g, '%22');
const customPaintCursor = `url("data:image/svg+xml;charset=utf-8,${encodedPaintCursor}") 4 19, crosshair`;

interface GridCellProps {
  cellAtom: CellAtom;
  rowIndex: number;
  colIndex: number;
  onDrop: (r: number, c: number) => void;
}

const GridCell = ({ cellAtom, rowIndex, colIndex, onDrop }: GridCellProps) => {
  const [cellData, setCellData] = useAtom(cellAtom);
  const [dragState, setDragState] = useAtom(dragStateAtom);
  const [selection, setSelection] = useAtom(selectionAtom);
  const activeTool = useAtomValue(activeToolAtom);
  const isInteracting = useAtomValue(isInteractingAtom);
  const brush = useAtomValue(brushAtom);
  const setIsInteracting = useSetAtom(isInteractingAtom);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    e.stopPropagation();
    setIsInteracting(true);

    if (activeTool === 'paint') {
      // --- LOGIC CHANGE 1: DRAG PREPARATION IS NOW CONDITIONAL ---
      // We only prepare a 'move' drag IF the clicked pixel is ALREADY selected.
      const isAlreadySelected = selection.includes(cellAtom);
      if (cellData.deviceId && isAlreadySelected) {
        setDragState({
          type: 'move',
          isDragging: false,
          draggedAtoms: selection, // We drag the entire current selection
          draggedFrom: { r: rowIndex, c: colIndex },
        });
      } else if (!cellData.deviceId) {
        // If the cell is empty, we still prepare a 'paint' drag.
        setCellData(brush);
        setDragState({
          type: 'paint',
          isDragging: false,
          draggedAtoms: [],
          draggedFrom: null,
        });
      }
    } else if (activeTool === 'erase') {
      if (cellData.deviceId) setCellData(MCell);
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (!isInteracting) return;
    if (dragState?.type === 'paint' && !cellData.deviceId) {
      setCellData(brush);
    } else if (activeTool === 'erase' && cellData.deviceId) {
      setCellData(MCell);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleMouseUp = () => {
    // --- LOGIC CHANGE 2: MOUSEUP IS NOW SIMPLER AND MORE EXPLICIT ---
    // First, check if a drag actually occurred.
    if (dragState?.isDragging) {
      if (dragState.type === 'move') {
        onDrop(rowIndex, colIndex);
      }
      // No action needed for 'paint' drag on mouseup.
      return; // The function is done if a drag happened.
    }

    // If we reach here, it was a CLICK, not a drag.
    // Now we perform the selection logic.
    if (activeTool === 'paint' && cellData.deviceId) {
      const isAlreadySelected = selection.includes(cellAtom);
      if (isAlreadySelected) {
        setSelection([]); // A click on an already-selected pixel deselects it.
      } else {
        setSelection([cellAtom]); // A click on an unselected pixel selects it.
      }
    }
  };
  
  const isPotentialDropTarget = dragState?.type === 'move' && dragState.isDragging && !cellData.deviceId;
  const showBackground = isPotentialDropTarget && isHovered;

  const getCursor = () => {
    if (dragState?.type === 'move' && dragState.isDragging) {
      return 'grabbing';
    }
    if (activeTool === 'paint') {
      // Show the 'grab' hand only if the hovered pixel is part of the selection.
      if (cellData.deviceId && selection.includes(cellAtom)) {
        return 'grab';
      } else if (!cellData.deviceId) {
        return customPaintCursor;
      }
    }
    if (activeTool === 'erase') {
      return 'cell';
    }
    // For unselected pixels in paint mode, use the default pointer.
    return 'default';
  };

  return (
    <Box
      onMouseDown={handleMouseDown}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseUp={handleMouseUp}
      sx={{
        boxSizing: 'border-box',
        backgroundColor: showBackground ? 'rgba(0, 188, 212, 0.2)' : 'transparent',
        border: isPotentialDropTarget ? `1px dashed #00bcd4` : 'none',
        transition: 'background-color 0.1s ease-in-out',
        cursor: getCursor(),
      }}
    >
      <Pixel cellAtom={cellAtom} />
    </Box>
  );
};

export default GridCell;