// src/components/MatrixStudio/atoms.ts

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

export const brushAtom = atom<IMCell>({ deviceId: 'paint-brush', pixel: 1, group: 'painted-group' });

export const selectionAtom = atom<CellAtom[]>([]);

// The drag state now has a more descriptive drop preview.
export const dragStateAtom = atom<{
  type: 'paint' | 'move';
  isDragging: boolean;
  draggedAtoms: CellAtom[];
  draggedFrom: { r: number; c: number } | null;
  isCollision: boolean; // We keep this for a quick global check
  dropPreview: { r: number; c: number; status: 'valid' | 'colliding' }[]; // <-- UPGRADED
} | null>(null);