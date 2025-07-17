import { atom } from 'jotai';
import { withHistory } from 'jotai-history';
import type { IMCell } from './MatrixStudio.types';
import { MCell } from './MatrixStudio.types';

export const createCellAtom = (initialValue: IMCell = MCell) => atom(initialValue);
export type CellAtom = ReturnType<typeof createCellAtom>;

// The raw data atom
export const pixelGridTargetAtom = atom<CellAtom[][]>([]);

// The history-aware wrapper
export const pixelGridHistoryAtom = withHistory(pixelGridTargetAtom, 20);

// --- Tool State Atoms ---
export type EditorTool = 'paint' | 'erase';
export const activeToolAtom = atom<EditorTool>('paint');

// The brush atom for painting
export const brushAtom = atom<IMCell>({
  deviceId: 'paint-brush',
  pixel: 1,
  group: 'painted-group',
});

// --- THIS WAS MISSING ---
// The Painting State Atom: Tracks if the user is actively painting.
export const isPaintingAtom = atom<boolean>(false);