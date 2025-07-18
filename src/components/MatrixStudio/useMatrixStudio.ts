// src/components/MatrixStudio/useMatrixStudio.ts

import { useEffect } from 'react';
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

  useEffect(() => {
    const newGrid = Array.from({ length: rows }, (_, r: number) =>
      Array.from({ length: cols }, (_, c: number) => {
        const cellData = initialData?.[r]?.[c];
        return createCellAtom(cellData);
      })
    );
    setPixelGrid(newGrid);
    setHistory(RESET);
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