import { Box, Button, Stack, Typography, IconButton, Tooltip, Slider, Grid, TextField } from '@mui/material';
import {
  InfoOutlined,
  ZoomIn,
  OpenWith,
  TouchApp,
  Gesture,
  CropFree,
  ViewModule,
} from '@mui/icons-material';

// --- The New, Awesome Tooltip Content ---
const controlData = [
  {
    category: 'Canvas',
    icon: <ZoomIn fontSize="small" />,
    title: 'Mouse Wheel',
    description: 'Zoom In / Out',
  },
  {
    category: 'Canvas',
    icon: <OpenWith fontSize="small" />,
    title: 'Right-Drag',
    description: 'Pan Canvas',
  },
  {
    category: 'Paint Mode',
    icon: <TouchApp fontSize="small" />,
    title: 'Left-Click (Empty)',
    description: 'Paint Pixel',
  },
  {
    category: 'Paint Mode',
    icon: <Gesture fontSize="small" />,
    title: 'Left-Drag (Empty)',
    description: 'Paint Pixels',
  },
  {
    category: 'Paint Mode',
    icon: <CropFree fontSize="small" />,
    title: 'Left-Click (Pixel)',
    description: 'Select Pixel',
  },
  {
    category: 'Paint Mode',
    icon: <ViewModule fontSize="small" />,
    title: 'Left-Double-Click (Pixel)',
    description: 'Select Group',
  },
];

const InfoTooltipContent = () => (
  <Box sx={{ p: 1.5, minWidth: 320 }}>
    <Typography variant="h6" sx={{ mb: 1.5 }}>
      Editor Controls
    </Typography>
    <table style={{ width: '100%', borderSpacing: 0 }}>
      <tbody>
        {controlData.map(({ icon, title, description }) => (
          <tr key={title}>
            <td style={{ padding: '8px 4px', verticalAlign: 'middle' }}>
              <Stack direction="row" alignItems="center" spacing={1.5}>
                {icon}
                <Typography variant="body2" sx={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>
                  {title}
                </Typography>
              </Stack>
            </td>
            <td style={{ padding: '8px 4px', verticalAlign: 'middle', width: '100%' }}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {description}
              </Typography>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </Box>
);
// --- End of Tooltip Content ---


interface DevControlsProps {
  onLoadEmpty: () => void;
  onLoadSimple: () => void;
  onApplyResize: () => void;
  rows: number;
  cols: number;
  onRowsChange: (value: number) => void;
  onColsChange: (value: number) => void;
}

export const DevControls = (props: DevControlsProps) => {
  const {
    onLoadEmpty,
    onLoadSimple,
    onApplyResize,
    rows,
    cols,
    onRowsChange,
    onColsChange,
  } = props;

  // Handler for TextField input to ensure we use numbers
  const handleNumericInputChange = (setter: (value: number) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value)) {
      setter(value);
    }
  };

  return (
    <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h5" component="h1">MatrixStudio Dev Playground</Typography>
        <Tooltip
          title={<InfoTooltipContent />}
          placement="bottom-end"
          componentsProps={{
            tooltip: {
              sx: {
                backgroundColor: 'background.paper',
                border: '1px solid',
                borderColor: 'divider',
                color: 'text.primary',
                minWidth: 350,
              },
            },
          }}
        >
          <IconButton>
            <InfoOutlined />
          </IconButton>
        </Tooltip>
      </Stack>
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 2 }}>
        {/* --- Layout Buttons --- */}
        <Button variant="outlined" size="small" onClick={onLoadEmpty}>Load Empty 8x8</Button>
        <Button variant="outlined" size="small" onClick={onLoadSimple}>Load Simple Layout</Button>
        
        {/* --- PRO LAYOUT: Dimension Controls --- */}
        <Grid container spacing={2} alignItems="center" sx={{ flexGrow: 1, px: 2 }}>
          <Grid size={{xs:6}}>
            <Typography variant="caption" id="rows-slider" gutterBottom>
              Rows ({rows})
            </Typography>
            <Stack direction="row" spacing={2} alignItems="center">
              <Slider
                aria-labelledby="rows-slider"
                value={rows}
                onChange={(e, value) => onRowsChange(value as number)}
                min={1}
                max={100}
                size="small"
              />
              <TextField
                value={rows}
                onChange={handleNumericInputChange(onRowsChange)}
                size="small"
                inputProps={{ step: 1, min: 1, max: 100, type: 'number' }}
                sx={{ width: '80px' }}
              />
            </Stack>
          </Grid>
          <Grid size={{xs:6}}>
            <Typography variant="caption" id="cols-slider" gutterBottom>
              Cols ({cols})
            </Typography>
            <Stack direction="row" spacing={2} alignItems="center">
              <Slider
                aria-labelledby="cols-slider"
                value={cols}
                onChange={(e, value) => onColsChange(value as number)}
                min={1}
                max={100}
                size="small"
              />
              <TextField
                value={cols}
                onChange={handleNumericInputChange(onColsChange)}
                size="small"
                inputProps={{ step: 1, min: 1, max: 100, type: 'number' }}
                sx={{ width: '80px' }}
              />
            </Stack>
          </Grid>
        </Grid>
        <Button variant="contained" onClick={onApplyResize}>Apply</Button>
      </Stack>
    </Box>
  );
};
