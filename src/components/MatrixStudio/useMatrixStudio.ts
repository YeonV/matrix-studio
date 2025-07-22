// src/components/MatrixStudio/useMatrixStudio.ts

import { useEffect, useRef } from 'react';
import { useSetAtom, useAtomValue } from 'jotai';
import { UNDO, REDO, RESET } from 'jotai-history';
import type { MatrixStudioProps } from './MatrixStudio.types';
import { pixelGridHistoryAtom, pixelGridTargetAtom, createCellAtom } from './atoms';

export const useMatrixStudio = (props: MatrixStudioProps) => {
  const { initialData, rows = 16, cols = 20, deviceList = [] } = props;

  const setPixelGrid = useSetAtom(pixelGridTargetAtom);
  const setHistory = useSetAtom(pixelGridHistoryAtom);
  const gridHistory = useAtomValue(pixelGridHistoryAtom);
  const currentGrid = useAtomValue(pixelGridTargetAtom);

  const isMounted = useRef(false);

  useEffect(() => {
    // This effect now runs whenever its dependencies change.
    // However, the logic inside it is now smart enough to handle it.

    // On the very first run (component mount), we treat initialData as the source of truth.
    if (!isMounted.current) {
      isMounted.current = true; // Mark as mounted
      const newGrid = Array.from({ length: rows }, (_, r: number) =>
        Array.from({ length: cols }, (_, c: number) => {
          const cellData = initialData?.[r]?.[c];
          return createCellAtom(cellData);
        })
      );
      setPixelGrid(newGrid);
      setHistory(RESET);
    }
    
    // On subsequent runs, this effect will be triggered by App.tsx passing a new
    // initialData prop. But because our StateBridge is keeping App.tsx's state
    // perfectly in sync with Jotai's state, these updates are redundant and harmless.
    // The key is that the initial seeding only happens ONCE per mount.

  }, [rows, cols, initialData, setPixelGrid, setHistory]);

  return {
    rows,
    cols,
    gridForRender: currentGrid,
    undo: () => setHistory(UNDO),
    redo: () => setHistory(REDO),
    canUndo: gridHistory.canUndo,
    canRedo: gridHistory.canRedo,
    deviceList,
  };
};