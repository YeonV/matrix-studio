import { atom } from 'jotai';
import type { IMCell } from './MatrixStudio.types';
import { MCell } from './MatrixStudio.types';

export const createCellAtom = (initialValue: IMCell = MCell) => atom(initialValue);
export type CellAtom = ReturnType<typeof createCellAtom>;

// ONE SINGLE ATOM. That's it. No history, no targets.
export const pixelGridAtom = atom<CellAtom[][]>([]);

// 1. The "Brush" Atom: Holds the data we want to paint onto cells.
// For now, it's a hardcoded dummy pixel. Later, a UI panel will update this atom.
export const brushAtom = atom<IMCell>({
  deviceId: 'paint-brush',
  pixel: 1,
  group: 'painted-group',
});

// 2. The Painting State Atom: Tracks if the user is actively painting (mouse button is down).
export const isPaintingAtom = atom<boolean>(false);