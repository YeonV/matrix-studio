import { useAtom } from 'jotai';
import { Box, IconButton, Stack, ToggleButton, ToggleButtonGroup, Tooltip } from '@mui/material';
import { Undo, Redo, Brush } from '@mui/icons-material';
import { activeToolAtom } from '../atoms';
import { useMatrixEditorContext } from '../MatrixStudioContext';
import { BrushSettings } from './BrushSettings'; // <-- IMPORT

export const MStudioControls = () => {
  const { canUndo, undo, canRedo, redo } = useMatrixEditorContext();
  // We need both read and write access for the ToggleButtonGroup
  const [activeTool, setActiveTool] = useAtom(activeToolAtom);

  const handleToolChange = (event: React.MouseEvent<HTMLElement>, newTool: 'paint' | 'erase' | null) => {
    if (newTool !== null) {
      setActiveTool(newTool);
    }
  };

  return (
    <Stack sx={{ p: 2, height: '100%' }} spacing={2}>
      {/* Undo/Redo Section */}
      <Box>
        <Tooltip title="Undo (Ctrl+Z)">
          <span>
            <IconButton onClick={undo} disabled={!canUndo}>
              <Undo />
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip title="Redo (Ctrl+Y)">
          <span>
            <IconButton onClick={redo} disabled={!canRedo}>
              <Redo />
            </IconButton>
          </span>
        </Tooltip>
      </Box>

      {/* Tool Selector Section */}
      <Box>
        <ToggleButtonGroup
          orientation="vertical"
          value={activeTool}
          exclusive
          onChange={handleToolChange}
        >
          <ToggleButton value="paint" aria-label="paint tool">
            <Tooltip title="Paint" placement="right">
              <Brush />
            </Tooltip>
          </ToggleButton>
          <ToggleButton value="erase" aria-label="erase tool">
            <Tooltip title="Erase" placement="right">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22,3H7c-0.69,0-1.23,0.35-1.59,0.88L0,12l5.41,8.11C5.77,20.65,6.31,21,7,21h15c1.1,0,2-0.9,2-2V5C24,3.9,23.1,3,22,3z M19,15.59L17.59,17L14,13.41L10.41,17L9,15.59L12.59,12L9,8.41L10.41,7L14,10.59L17.59,7L19,8.41L15.41,12L19,15.59z"/>
              </svg>
            </Tooltip>
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
      
      {/* --- Conditionally render the Brush Settings --- */}
      {activeTool === 'paint' && <BrushSettings />}

    </Stack>
  );
};