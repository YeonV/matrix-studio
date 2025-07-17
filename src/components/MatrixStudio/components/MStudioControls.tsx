import { useAtom } from 'jotai';
import { Box, IconButton, Stack, ToggleButton, ToggleButtonGroup, Tooltip } from '@mui/material';
import { Undo, Redo, Brush, RectangleOutlined } from '@mui/icons-material';
import { activeToolAtom } from '../atoms';
import { useMatrixEditorContext } from '../MatrixStudioContext'; // We will create this next

export const MStudioControls = () => {
  const { canUndo, undo, canRedo, redo } = useMatrixEditorContext();
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
              {/* Using a generic icon for eraser */}
              <RectangleOutlined /> 
            </Tooltip>
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
    </Stack>
  );
};