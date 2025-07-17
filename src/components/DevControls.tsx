import { Box, Button, Stack, Typography, IconButton, Tooltip } from '@mui/material';
import {
  InfoOutlined,
  ZoomIn,
  OpenWith,
  TouchApp,
  Gesture,
  CropFree,
  ViewModule,
} from '@mui/icons-material';
import React from 'react';

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


// Define the props our component will accept
interface DevControlsProps {
  onLoadEmpty: () => void;
  onLoadSimple: () => void;
}

export const DevControls = ({ onLoadEmpty, onLoadSimple }: DevControlsProps) => {
  return (
    <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
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
      <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
        <Button variant="outlined" onClick={onLoadEmpty}>Load Empty 8x8</Button>
        <Button variant="outlined" onClick={onLoadSimple}>Load Simple Layout</Button>
      </Stack>
    </Box>
  );
};