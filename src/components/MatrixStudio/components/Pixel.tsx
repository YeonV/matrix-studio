import React from 'react';
import { useAtomValue } from 'jotai';
import { Box, Typography, useTheme } from '@mui/material';
import { type CellAtom, getPixelStateAtom } from '../atoms';

interface PixelProps {
  cellAtom: CellAtom;
}

const PixelComponent = ({ cellAtom }: PixelProps) => {
  const theme = useTheme();
  // This subscription is fine, it's to the pixel's own data.
  const cellData = useAtomValue(cellAtom);
  
  // --- THE PERFORMANCE FIX ---
  // Create a memoized instance of our derived atom. This atom is specific to THIS pixel.
  const pixelStateAtom = React.useMemo(() => getPixelStateAtom(cellAtom), [cellAtom]);
  // We subscribe to this tiny atom. If its result doesn't change for this pixel, no re-render happens.
  const { isSelected, isGhosted } = useAtomValue(pixelStateAtom);

  const dynamicStyles = {
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

export default React.memo(PixelComponent);