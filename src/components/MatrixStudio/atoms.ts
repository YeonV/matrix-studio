// src/components/MatrixStudio/atoms.ts

import { atom } from 'jotai';
import { withHistory } from 'jotai-history';
import type { IMCell } from './MatrixStudio.types';
import { MCell } from './MatrixStudio.types';

// ==================================================================
// == 1. SOURCE OF TRUTH (DATA)
// ==================================================================

export const gridDataAtom = atom<IMCell[][]>([]);
export const historyGridDataAtom = withHistory(gridDataAtom, 512);

// Helper atom to get the latest data snapshot CORRECTLY.
export const currentGridDataAtom = atom<IMCell[][]>((get) => {
  const history = get(historyGridDataAtom);
  // The correct way to get the latest value from the history's IterableIterator
  const allValues = [...history.values()];
  return allValues[0] || [];
});


// ==================================================================
// == 2. DERIVED STATE FOR UI (ATOMS)
// ==================================================================

export const createCellAtom = (initialValue: IMCell = MCell) => atom(initialValue);
export type CellAtom = ReturnType<typeof createCellAtom>;

// This read-only atom creates our "atom of atoms" grid for rendering.
// It is DERIVED from our data source of truth.
export const pixelGridTargetAtom = atom<CellAtom[][]>((get) => {
  const gridData = get(currentGridDataAtom);
  if (!gridData) return [];
  // For now, we accept the re-creation of atoms. We can optimize later if needed.
  return gridData.map(row => row.map(cellData => createCellAtom(cellData)));
});


// ==================================================================
// == 3. INTERACTION AND TOOL STATE (UNCHANGED)
// ==================================================================

export type EditorTool = 'paint' | 'erase';
export const activeToolAtom = atom<EditorTool>('paint');

export const isInteractingAtom = atom<boolean>(false);

export const brushAtom = atom<IMCell>({ deviceId: 'paint-brush', pixel: 0, group: 'group-1' });

export const selectionAtom = atom<Set<CellAtom>>(new Set<CellAtom>());

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


// ==================================================================
// == 4. DERIVED STATE FOR PERFORMANCE (OPTIMIZATIONS)
// ==================================================================

export const groupMapAtom = atom((get) => {
  const gridData = get(currentGridDataAtom); // Use the correct data atom
  const gridOfAtoms = get(pixelGridTargetAtom);
  const map = new Map<string, CellAtom[]>();

  // Now gridData is correctly typed as IMCell[][]
  gridData.forEach((row, r) => {
    row.forEach((cellData, c) => {
      if (cellData.group) {
        if (!map.has(cellData.group)) {
          map.set(cellData.group, []);
        }
        const cellAtom = gridOfAtoms[r]?.[c];
        if (cellAtom) {
          map.get(cellData.group)!.push(cellAtom);
        }
      }
    });
  });
  return map;
});

export const getPixelStateAtom = (cellAtom: CellAtom) => atom((get) => {
  const selection = get(selectionAtom);
  const dragState = get(dragStateAtom);
  
  const isSelected = selection.has(cellAtom);
  const isGhosted = dragState?.type === 'move' && dragState.isDragging && dragState.draggedAtoms.includes(cellAtom);
  
  return { isSelected, isGhosted };
});