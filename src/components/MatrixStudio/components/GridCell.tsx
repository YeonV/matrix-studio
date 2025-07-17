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

const paintCursorSVG = `<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="#FFFFFF"/></svg>`;
const encodedPaintCursor = encodeURIComponent(paintCursorSVG).replace(/'/g, '%27').replace(/"/g, '%22');
const customPaintCursor = `url("data:image/svg+xml;charset=utf-8,${encodedPaintCursor}") 4 19, crosshair`;

interface GridCellProps {
  cellAtom: CellAtom;
  rowIndex: number;
  colIndex: number;
  onDrop: (r: number, c: number) => void;
  onValidateDrop: (r: number, c: number) => void; // <-- RE-ADD VALIDATION PROP
}

const GridCell = ({ cellAtom, rowIndex, colIndex, onDrop, onValidateDrop }: GridCellProps) => {
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
      const isAlreadySelected = selection.includes(cellAtom);
      if (cellData.deviceId && isAlreadySelected) {
        setDragState({
          type: 'move',
          isDragging: false,
          draggedAtoms: selection,
          draggedFrom: { r: rowIndex, c: colIndex },
          isCollision: false, // Initialize collision state
        });
      } else if (!cellData.deviceId) {
        setCellData(brush);
        setDragState({ type: 'paint', isDragging: false, draggedAtoms: [], draggedFrom: null, isCollision: false });
      }
    } else if (activeTool === 'erase') {
      if (cellData.deviceId) setCellData(MCell);
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    // When entering a cell during a move, trigger the validation from the parent
    if (dragState?.type === 'move' && dragState.isDragging) {
      onValidateDrop(rowIndex, colIndex);
    }
    // Continue with paint/erase logic
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

  const handleMouseUp = (e: React.MouseEvent) => {
    if (dragState?.isDragging) {
      if (dragState.type === 'move') {
        onDrop(rowIndex, colIndex);
      }
      return;
    }
    
    // This is the correct, refined selection logic from the last step
    if (activeTool === 'paint') {
      if (dragState?.type === 'move') {
        if (e.ctrlKey) {
          setSelection(prev => prev.filter(atom => atom !== cellAtom));
        } else {
          setSelection([]);
        }
      } else if (!dragState && cellData.deviceId) {
        if (e.ctrlKey) {
          setSelection(prev => [...prev, cellAtom]);
        } else {
          setSelection([cellAtom]);
        }
      }
    }
  };
  
  // Visuals now correctly use the collision state
  const isPotentialDropTarget = dragState?.type === 'move' && dragState.isDragging && !dragState.isCollision;
  const showBackground = isPotentialDropTarget && isHovered;

  const getCursor = () => {
    if (dragState?.type === 'move' && dragState.isDragging) {
      return dragState.isCollision ? 'not-allowed' : 'grabbing';
    }
    if (activeTool === 'paint') {
      if (cellData.deviceId && selection.includes(cellAtom)) {
        return 'grab';
      } else if (!cellData.deviceId) {
        return customPaintCursor;
      }
    }
    if (activeTool === 'erase') {
      return 'cell';
    }
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