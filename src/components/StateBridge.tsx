// src/components/StateBridge.tsx

import { useEffect, useRef } from 'react';
import { useAtomValue } from 'jotai';
import type { IMCell } from './MatrixStudio/MatrixStudio.types';
import { gridDataAtom } from './MatrixStudio/atoms'; // <-- IMPORT THE NEW ATOM

interface StateBridgeProps {
  onChange?: (data: IMCell[][]) => void;
}

export const StateBridge = ({ onChange }: StateBridgeProps) => {
  // We now listen to the derived atom, which gives us the plain data directly.
  const gridData = useAtomValue(gridDataAtom);
  const isMounted = useRef(false);

  useEffect(() => {
    // On the first render, the grid is empty, then populated.
    // This prevents firing onChange during the initial setup.
    if (!isMounted.current) {
      if (gridData.length > 0) { // Wait for the grid to be populated
        isMounted.current = true;
      }
      return;
    }

    if (onChange) {
      // The value is already plain data. We just pass it up.
      onChange(gridData);
    }
    // This effect correctly depends on the plain gridData.
  }, [gridData, onChange]);

  return null;
};