// src/components/MatrixStudio/components/Pixel.tsx

import { useAtomValue } from 'jotai';
import { Box, Typography, useTheme } from '@mui/material';
import { type CellAtom, selectionAtom, dragStateAtom } from '../atoms'; // Import dragStateAtom

interface PixelProps {
  cellAtom: CellAtom;
}

export const Pixel = ({ cellAtom }: PixelProps) => {
  const theme = useTheme();
  const cellData = useAtomValue(cellAtom);
  const selection = useAtomValue(selectionAtom);
  const dragState = useAtomValue(dragStateAtom);

  const isSelected = selection.includes(cellAtom);
  // A pixel is "ghosted" if it's part of an active 'move' operation.
  const isGhosted = dragState?.type === 'move' && dragState.isDragging && dragState.draggedAtoms.includes(cellAtom);

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
    // Apply the ghosting effect
    opacity: isGhosted ? 0.3 : 1,
  };

  return (
    <Box sx={dynamicStyles}>
      {cellData.deviceId && (
        <>
          <Typography variant="caption" sx={{ fontSize: '0.6rem' }} noWrap>
            {cellData.deviceId}
          </Typography>
          <Typography variant="h6" sx={{ lineHeight: 1 }}>
            {cellData.pixel}
          </Typography>
        </>
      )}
    </Box>
  );
};