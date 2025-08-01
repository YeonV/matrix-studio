// src/components/MatrixStudio/components/GridCell.tsx

import { useAtom, useSetAtom, useAtomValue, useStore } from 'jotai';
import { useTheme } from '@mui/material/styles';
import {
  activeToolAtom,
  brushAtom,
  dragStateAtom,
  pixelIncrementModeAtom,
  strokeAtomsAtom,
  selectionAtom,
  isInteractingAtom,
  groupMapAtom,
  historyGridDataAtom, // <-- IMPORT THE HISTORY ATOM
  type CellAtom,
} from '../atoms';
import { MCell } from '../MatrixStudio.types';
import { Box } from '@mui/material';
import Pixel from './Pixel';
import { useMatrixEditorContext } from '../MatrixStudioContext';

const paintCursorSVG = `<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="#FFFFFF"/></svg>`;
const encodedPaintCursor = encodeURIComponent(paintCursorSVG).replace(/'/g, '%27').replace(/"/g, '%22');
const customPaintCursor = `url("data:image/svg+xml;charset=utf-8,${encodedPaintCursor}") 4 19, crosshair`;

interface GridCellProps {
  cellAtom: CellAtom;
  rowIndex: number;
  colIndex: number;
  onDrop: (r: number, c: number) => void;
  onValidateDrop: (r: number, c: number) => void;
}

const GridCell = ({ cellAtom, rowIndex, colIndex, onDrop, onValidateDrop }: GridCellProps) => {
  // We still read the cell's own data for display, but we no longer get its setter.
  const [cellData] = useAtom(cellAtom);
  const dragState = useAtomValue(dragStateAtom);
  const selection = useAtomValue(selectionAtom);
  const isInteracting = useAtomValue(isInteractingAtom);
  const store = useStore();
  const theme = useTheme();
  const { deviceList } = useMatrixEditorContext();

  // --- THE ARCHITECTURAL CHANGE ---
  // All write operations must target the main history atom.
  const setGridData = useSetAtom(historyGridDataAtom);

  const setDragState = useSetAtom(dragStateAtom);
  const setSelection = useSetAtom(selectionAtom);
  const setBrushData = useSetAtom(brushAtom);
  const setIsInteracting = useSetAtom(isInteractingAtom);
  const setStrokeAtoms = useSetAtom(strokeAtomsAtom);
  
  const activeTool = useAtomValue(activeToolAtom);
  const pixelMode = useAtomValue(pixelIncrementModeAtom);
  const groupMap = useAtomValue(groupMapAtom); 

  const applyPaintAction = () => {
    const currentBrushData = store.get(brushAtom);
    const selectedDevice = deviceList.find(d => d.id === currentBrushData.deviceId);
    if (selectedDevice && (currentBrushData.pixel >= selectedDevice.count || currentBrushData.pixel < 0)) return;

    // We now update the root data grid.
    setGridData(prevGrid => {
      // Don't paint if the cell is already occupied.
      if (prevGrid[rowIndex]?.[colIndex]?.deviceId) return prevGrid;

      const newGrid = prevGrid.map(r => [...r]);
      newGrid[rowIndex][colIndex] = currentBrushData;
      setStrokeAtoms(prev => [...prev, cellAtom]); // Still track the atom for grouping
      
      if (pixelMode === 'increment') {
        setBrushData(prev => ({ ...prev, pixel: prev.pixel + 1 }));
      } else if (pixelMode === 'decrement') {
        setBrushData(prev => ({ ...prev, pixel: prev.pixel - 1 }));
      }
      return newGrid;
    });
  };

  const applyEraseAction = () => {
    setGridData(prevGrid => {
      if (!prevGrid[rowIndex]?.[colIndex]?.deviceId) return prevGrid;
      const newGrid = prevGrid.map(r => [...r]);
      newGrid[rowIndex][colIndex] = MCell;
      return newGrid;
    });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    e.stopPropagation();
    setIsInteracting(true);
    if (activeTool === 'paint') {
      const isAlreadySelected = selection.has(cellAtom);
      if (cellData.deviceId && isAlreadySelected) {
        setDragState({ type: 'move', isDragging: false, draggedAtoms: Array.from(selection), draggedFrom: { r: rowIndex, c: colIndex }, isCollision: false, dropPreview: [] });
      } else if (!cellData.deviceId) {
        setStrokeAtoms([]);
        applyPaintAction();
        setDragState({ type: 'paint', isDragging: false, draggedAtoms: [], draggedFrom: null, isCollision: false, dropPreview: [] });
      }
    } else if (activeTool === 'erase') {
      if (cellData.deviceId) applyEraseAction();
    }
  };

  const handleMouseEnter = () => {
    if (dragState?.type === 'move' && dragState.isDragging) onValidateDrop(rowIndex, colIndex);
    if (!isInteracting) return;
    if (dragState?.type === 'paint' && !cellData.deviceId) {
      applyPaintAction();
    } else if (activeTool === 'erase' && cellData.deviceId) {
      applyEraseAction();
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (dragState?.isDragging) {
      if (dragState.type === 'move') onDrop(rowIndex, colIndex);
      return;
    }
    if (activeTool === 'paint' && cellData.deviceId) {
      const isAlreadySelected = selection.has(cellAtom);
      if (e.ctrlKey) {
        const newSelection = new Set(selection);
        if (isAlreadySelected) newSelection.delete(cellAtom);
        else newSelection.add(cellAtom);
        setSelection(newSelection);
      } else {
        if (isAlreadySelected) setSelection(new Set());
        else setSelection(new Set([cellAtom]));
      }
    }
  };

  const handleDoubleClick = () => {
    if (activeTool !== 'paint' || !cellData.deviceId || !cellData.group) return;
    const groupAtoms = groupMap.get(cellData.group) || [];
    setSelection(new Set(groupAtoms));
};

  const previewInfo = dragState?.type === 'move' && dragState.isDragging ? dragState.dropPreview.find(p => p.r === rowIndex && p.c === colIndex) : null;
  const getHighlightStyle = () => {
    if (!previewInfo) return {};
    if (previewInfo.status === 'valid') return { backgroundColor: 'rgba(0, 188, 212, 0.2)', border: `1px dashed ${theme.palette.primary.main}` };
    if (previewInfo.status === 'colliding') return { backgroundColor: `rgba(${theme.palette.error.main.replace('rgb(','').replace(')','')}, 0.2)`, border: `1px dashed ${theme.palette.error.main}` };
    return {};
  };
  
  const getCursor = () => {
    if (dragState?.type === 'move' && dragState.isDragging) return dragState.isCollision ? 'not-allowed' : 'grabbing';
    if (activeTool === 'paint') {
      if (cellData.deviceId && selection.has(cellAtom)) return 'grab';
      else if (!cellData.deviceId) return customPaintCursor;
    }
    if (activeTool === 'erase') return 'cell';
    return 'default';
  };
  
  return (
    <Box
      onMouseDown={handleMouseDown}
      onMouseEnter={handleMouseEnter}
      onMouseUp={handleMouseUp}
      onDoubleClick={handleDoubleClick}
      sx={{
        boxSizing: 'border-box',
        transition: 'background-color 0.1s ease-in-out, border 0.1s ease-in-out',
        cursor: getCursor(),
        ...getHighlightStyle(),
      }}
    >
      <Pixel cellAtom={cellAtom} />
    </Box>
  );
};

export default GridCell;