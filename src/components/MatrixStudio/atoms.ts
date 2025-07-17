// src/components/MatrixStudio/atoms.ts

import { atom } from 'jotai';
import { withHistory } from 'jotai-history';
import type { IMCell } from './MatrixStudio.types';
import { MCell } from './MatrixStudio.types';

export const createCellAtom = (initialValue: IMCell = MCell) => atom(initialValue);
export type CellAtom = ReturnType<typeof createCellAtom>;

// The raw data atom & history
export const pixelGridTargetAtom = atom<CellAtom[][]>([]);
export const pixelGridHistoryAtom = withHistory(pixelGridTargetAtom, 20);

// --- Tool State Atoms ---
export type EditorTool = 'paint' | 'erase';
export const activeToolAtom = atom<EditorTool>('paint');

// --- Interaction State Atoms ---
export const isInteractingAtom = atom<boolean>(false);

// The brush atom for painting
export const brushAtom = atom<IMCell>({
  deviceId: 'paint-brush',
  pixel: 1,
  group: 'painted-group',
});

// For selecting and initiating DnD in 'paint' mode
export const selectionAtom = atom<CellAtom[]>([]);

// For managing the DnD operation itself. This is now more descriptive.
export const dragStateAtom = atom<{
  type: 'paint' | 'move'; // The INTENT of the drag
  isDragging: boolean;     // True only after the mouse has moved
  draggedAtoms: CellAtom[]; // The pixels being moved (only for 'move' type)
  draggedFrom: { r: number; c: number } | null; // Start coordinates (only for 'move' type)
} | null>(null);