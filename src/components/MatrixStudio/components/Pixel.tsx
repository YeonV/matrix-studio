// src/components/MatrixStudio/components/Pixel.tsx

import { useAtomValue } from 'jotai';
import { Box, Typography, useTheme } from '@mui/material';
import { type CellAtom, getPixelStateAtom } from '../atoms'; // Import our new atom creator
import React from 'react';

interface PixelProps {
  cellAtom: CellAtom;
}

const Pixel = ({ cellAtom }: PixelProps) => {
  const theme = useTheme();
  // Subscribe ONLY to this pixel's own data.
  const cellData = useAtomValue(cellAtom);
  
  // --- THE PERFORMANCE FIX ---
  // Create a memoized derived atom for just this pixel's display state.
  // This atom only recalculates when the global selection/drag state changes.
  // CRUCIALLY, the Pixel component only re-renders if the *result* of this
  // derived atom (the boolean values) actually changes for THIS pixel.
  const pixelStateAtom = React.useMemo(() => getPixelStateAtom(cellAtom), [cellAtom]);
  const { isSelected, isGhosted } = useAtomValue(pixelStateAtom);

  const dynamicStyles = {
    // ... (all your style properties are the same, just using isSelected and isGhosted)
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    borderRadius: '4px',
    boxSizing: 'border-box',
    transition: 'all 0.1s ease-in-out',
    border: isSelected ? `2px solid ${theme.palette.primary.main}` : `1px solid ${theme.palette.divider}`,
    backgroundColor: isSelected ? theme.palette.action.selected : (cellData.deviceId ? 'rgba(255, 255, 255, 0.1)' : 'transparent'),
    transform: isSelected ? 'scale(1.05)' : 'scale(1)',
    zIndex: isSelected ? 1 : 0,
    opacity: isGhosted ? 0.3 : 1,
  };

  return (
    <Box sx={dynamicStyles}>
      {cellData.deviceId && (
        <>
          <Typography variant="caption" sx={{ fontSize: '0.6rem' }} noWrap>{cellData.deviceId}</Typography>
          <Typography variant="h6" sx={{ lineHeight: 1 }}>{cellData.pixel}</Typography>
        </>
      )}
    </Box>
  );
};

export default React.memo(Pixel);