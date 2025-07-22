// src/components/MatrixStudio/useMatrixStudio.ts

import { useEffect } from 'react';
import { useSetAtom, useAtomValue } from 'jotai';
import { UNDO, REDO, RESET } from 'jotai-history';
import type { MatrixStudioProps } from './MatrixStudio.types';
import { historyGridDataAtom, pixelGridTargetAtom, gridDataAtom } from './atoms';

export const useMatrixStudio = (props: MatrixStudioProps) => {
  const { initialData, rows = 16, cols = 20, deviceList = [] } = props;

  // --- THE FIX: Get setters for both the data atom and the history atom ---
  const setGridData = useSetAtom(gridDataAtom);
  const setHistory = useSetAtom(historyGridDataAtom);
  
  const gridHistory = useAtomValue(historyGridDataAtom);
  const currentGridOfAtoms = useAtomValue(pixelGridTargetAtom);

  useEffect(() => {
    // This effect runs only once on mount, as intended.
    
    // Step 1: Set the initial data on the underlying data atom.
    // This might create an initial history entry, which is fine.
    setGridData(initialData || []);

    // Step 2: Send the RESET command to the history atom.
    // This tells the history utility to clear its stack and use the
    // CURRENT value of gridDataAtom as the new, single baseline entry.
    setHistory(RESET);
    
  }, []); // Empty dependency array is correct.

  const handleUndo = () => setHistory(UNDO);
  const handleRedo = () => setHistory(REDO);

  return {
    rows,
    cols,
    gridForRender: currentGridOfAtoms,
    undo: handleUndo,
    redo: handleRedo,
    canUndo: gridHistory.canUndo,
    canRedo: gridHistory.canRedo,
    deviceList,
  };
};