import { useAtomValue } from 'jotai';
import { Box, Typography, useTheme } from '@mui/material';
import type { CellAtom } from '../atoms';

// The props are now extremely simple. It just needs its own atom.
interface PixelProps {
  cellAtom: CellAtom;
}

export const Pixel = ({ cellAtom }: PixelProps) => {
  const theme = useTheme();
  // We use useAtomValue because this component only ever READS the state.
  // The painting logic will handle writing to the atom.
  const cellData = useAtomValue(cellAtom);

  // TODO: We will add dynamic highlighting and opacity styles here later.
  const dynamicStyles = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: '4px',
    boxSizing: 'border-box',
    transition: 'all 0.1s ease-in-out',
    backgroundColor: cellData.deviceId ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
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