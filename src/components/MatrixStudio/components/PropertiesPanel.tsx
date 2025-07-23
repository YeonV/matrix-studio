import { useAtomValue } from 'jotai';
import { Box, Typography } from '@mui/material';
import { activeToolAtom } from '../atoms';
import { BrushSettings } from './BrushSettings';

export const PropertiesPanel = () => {
  const activeTool = useAtomValue(activeToolAtom);

  return (
    <Box sx={{ p: 2, height: '100%' }}>
      {activeTool === 'paint' && <BrushSettings />}
      {activeTool === 'erase' && <Typography variant="overline" color="text.secondary" display="block" sx={{ mb: 1.5 }}>
        Eraser Mode
      </Typography>}
    </Box>
  );
};