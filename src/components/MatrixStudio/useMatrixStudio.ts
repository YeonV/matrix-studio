import { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import type { MatrixStudioProps } from './MatrixStudio.types';
import { pixelGridAtom, createCellAtom } from './atoms';

// src/components/MatrixStudio/useMatrixStudio.ts

export const useMatrixStudio = (props: MatrixStudioProps) => {
  // We now manage rows and cols state INSIDE the hook
  const [rows, setRows] = useState(props.rows || 16);
  const [cols, setCols] = useState(props.cols || 20);
  
  const [grid, setGrid] = useAtom(pixelGridAtom);

  // The effect now also updates the internal dimension state
  useEffect(() => {
    setRows(props.rows || 16);
    setCols(props.cols || 20);
    
    const newGrid = Array.from({ length: props.rows || 16 }, (_, r) =>
      Array.from({ length: props.cols || 20 }, (_, c) => {
        const cellData = props.initialData?.[r]?.[c];
        return createCellAtom(cellData);
      })
    );
    setGrid(newGrid);
  }, [props.rows, props.cols, props.initialData, setGrid]);

  return {
    gridForRender: grid,
    rows, // <-- EXPOSE ROWS
    cols, // <-- EXPOSE COLS
  };
};