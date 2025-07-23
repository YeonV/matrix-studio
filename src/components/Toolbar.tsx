import { Box, Stack, IconButton, Tooltip, ToggleButtonGroup, ToggleButton, Divider, createSvgIcon, Button } from '@mui/material';
import {
  InfoOutlined, Save, AspectRatio,
  Undo, Redo, Brush,
  Delete,
  CheckCircleOutline,
} from '@mui/icons-material';
import { activeToolAtom } from './MatrixStudio/atoms';
import { InfoTooltipContent } from './Toolbar.components';
import { useAtom } from 'jotai';

const EraserIcon = createSvgIcon(
  <>
<path fill="currentColor" d="M16.24,3.56L21.19,8.5C21.97,9.29 21.97,10.55 21.19,11.34L12,20.53C10.44,22.09 7.91,22.09 6.34,20.53L2.81,17C2.03,16.21 2.03,14.95 2.81,14.16L13.41,3.56C14.2,2.78 15.46,2.78 16.24,3.56M4.22,15.58L7.76,19.11C8.54,19.9 9.8,19.9 10.59,19.11L14.12,15.58L9.17,10.63L4.22,15.58Z"></path>
  </>,
  'ParallelogramEraser'
);

interface ToolbarProps {
  canUndo: boolean;
  onUndo: () => void;
  canRedo: boolean;
  onRedo: () => void;
  onLoadEmpty: () => void;
  onLoadClick: () => void;
  onExportClick: () => void;
  onResizeClick: () => void;
  ledFxOrigin?: string | null;
  onSaveAndReturn?: () => void;
}

export const Toolbar = (props: ToolbarProps) => {
  const {
    canUndo, onUndo, canRedo, onRedo,
    onLoadEmpty, onLoadClick, onExportClick, onResizeClick,
    ledFxOrigin, onSaveAndReturn,
  } = props;
  const [activeTool, setActiveTool] = useAtom(activeToolAtom);
  return (
    <Box sx={{ p: 1, borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
      <Stack direction="row" spacing={1} alignItems="center">
         {ledFxOrigin && (
          <>
            <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
            <Tooltip title="Save & Return to LedFx">
              <Button color="primary" onClick={onSaveAndReturn} startIcon={<CheckCircleOutline />} variant="contained" size="small">
                Save & Return to LedFx
              </Button>
            </Tooltip>
            <Box sx={{ pr: 1 }} />
          </>
        )}
        <Tooltip title="Load from File"><IconButton onClick={onLoadClick}><svg width={24} height={24} viewBox="0 0 24 24" ><path fill="currentColor" d="M19,20H4C2.89,20 2,19.1 2,18V6C2,4.89 2.89,4 4,4H10L12,6H19A2,2 0 0,1 21,8H21L4,8V18L6.14,10H23.21L20.93,18.5C20.7,19.37 19.92,20 19,20Z"></path></svg></IconButton></Tooltip>
        <Tooltip title="Export to File"><IconButton onClick={onExportClick}><Save /></IconButton></Tooltip>


        <Divider orientation="vertical" flexItem />
        {/* --- View Group --- */}
        <Tooltip title="Load Empty 8x8 Layout"><IconButton onClick={onLoadEmpty}><Delete /></IconButton></Tooltip>
        <Tooltip title="Resize Matrix"><IconButton onClick={onResizeClick}><AspectRatio /></IconButton></Tooltip>
        
        <Divider orientation="vertical" flexItem />
        
        {/* --- History Group --- */}
        <Tooltip title="Undo (Ctrl+Z)"><IconButton onClick={onUndo} disabled={!canUndo}><Undo /></IconButton></Tooltip>
        <Tooltip title="Redo (Ctrl+Y)"><IconButton onClick={onRedo} disabled={!canRedo}><Redo /></IconButton></Tooltip>
        
        <Divider orientation="vertical" flexItem />
        <Box sx={{ pl: 1 }} />
        
        {/* --- Tools Group --- */}
        <ToggleButtonGroup
          value={activeTool}
          exclusive
          size="small"
          onChange={(_e, newTool) => { if (newTool) setActiveTool(newTool); }}
        >
          <ToggleButton value="paint" aria-label="paint tool"><Tooltip title="Paint Tool"><Brush /></Tooltip></ToggleButton>
          <ToggleButton value="erase" aria-label="erase tool"><Tooltip title="Erase Tool"><EraserIcon /></Tooltip></ToggleButton>
        </ToggleButtonGroup>

        {/* --- Spacer --- */}
        <Box sx={{ flexGrow: 1 }} />

        {/* --- Info --- */}
        <Tooltip title={<InfoTooltipContent />} placement="bottom-end" 
          slotProps ={{
            tooltip: {
              sx: {
                backgroundColor: 'background.paper',
                border: '1px solid',
                borderColor: 'divider',
                color: 'text.primary',
                minWidth: 350,
              },
            },
          }}>
          <IconButton><InfoOutlined /></IconButton>
        </Tooltip>
      </Stack>
    </Box>
  );
};