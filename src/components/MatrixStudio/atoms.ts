import { atom } from 'jotai';
import { withHistory } from 'jotai-history';
import type { IMCell } from './MatrixStudio.types';
import { MCell } from './MatrixStudio.types';

export const createCellAtom = (initialValue: IMCell = MCell) => atom(initialValue);
export type CellAtom = ReturnType<typeof createCellAtom>;

export const pixelGridTargetAtom = atom<CellAtom[][]>([]);
export const pixelGridHistoryAtom = withHistory(pixelGridTargetAtom, 20);

export type EditorTool = 'paint' | 'erase';
export const activeToolAtom = atom<EditorTool>('paint');

export const isInteractingAtom = atom<boolean>(false);

export const brushAtom = atom<IMCell>({ deviceId: 'paint-brush', pixel: 0, group: 'group-1' });

export const selectionAtom = atom<CellAtom[]>([]);

export const dragStateAtom = atom<{
  type: 'paint' | 'move';
  isDragging: boolean;
  draggedAtoms: CellAtom[];
  draggedFrom: { r: number; c: number } | null;
  isCollision: boolean;
  dropPreview: { r: number; c: number; status: 'valid' | 'colliding' }[];
} | null>(null);

export type PixelIncrementMode = 'increment' | 'decrement' | 'off';
export const pixelIncrementModeAtom = atom<PixelIncrementMode>('increment');
export const isGroupAutoIncrementAtom = atom(false);
export const strokeAtomsAtom = atom<CellAtom[]>([]);
export const lastPaintedCellAtom = atom<{ r: number; c: number } | null>(null);

export const gridDataAtom = atom((get) => {
  const gridOfAtoms = get(pixelGridTargetAtom);
  return gridOfAtoms.map(row => row.map(cellAtom => get(cellAtom)));
});

// --- PERFORMANCE ATOM #1: The Group Map ---
// This creates a fast lookup table for group selections.
export const groupMapAtom = atom((get) => {
  const gridOfAtoms = get(pixelGridTargetAtom);
  const map = new Map<string, CellAtom[]>();
  gridOfAtoms.forEach(row => {
    row.forEach(atom => {
      const data = get(atom);
      if (data.group) {
        if (!map.has(data.group)) {
          map.set(data.group, []);
        }
        map.get(data.group)!.push(atom);
      }
    });
  });
  return map;
});

// --- PERFORMANCE ATOM #2: The Pixel State Creator ---
// This function creates a tiny, derived atom that only tracks the
// display state (isSelected, isGhosted) for a single pixel.
export const getPixelStateAtom = (cellAtom: CellAtom) => atom((get) => {
  const selection = get(selectionAtom);
  const dragState = get(dragStateAtom);
  
  const isSelected = selection.includes(cellAtom);
  const isGhosted = dragState?.type === 'move' && dragState.isDragging && dragState.draggedAtoms.includes(cellAtom);
  
  return { isSelected, isGhosted };
});