// src/components/StateBridge.tsx

import { useEffect, useRef } from 'react';
import { useAtomValue } from 'jotai';
import type { IMCell } from './MatrixStudio/MatrixStudio.types';
import { currentGridDataAtom } from './MatrixStudio/atoms'; // <-- IMPORT THE CORRECT DATA ATOM

interface StateBridgeProps {
  onChange?: (data: IMCell[][]) => void;
}

export const StateBridge = ({ onChange }: StateBridgeProps) => {
  // We now subscribe to the derived atom that gives us the plain data directly.
  const gridData = useAtomValue(currentGridDataAtom);
  const isMounted = useRef(false);

  useEffect(() => {
    // This effect correctly fires only when the gridData itself changes.

    // On the first couple of renders, the grid might be initializing.
    // This prevents firing onChange during that setup phase.
    if (!isMounted.current) {
      if (gridData.length > 0) { // Wait for the grid to be populated before marking as mounted
        isMounted.current = true;
      }
      return;
    }

    if (onChange) {
      // The value from the atom is already the plain data we need.
      // We just pass it up to the parent component.
      onChange(gridData);
    }
  }, [gridData, onChange]);

  // This component renders nothing to the DOM.
  return null;
};