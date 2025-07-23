import {Box, Stack, Typography} from '@mui/material';
import {
  ZoomIn,
  OpenWith,
  TouchApp,
  Gesture,
  CropFree,
  ViewModule,
} from '@mui/icons-material';

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

export const InfoTooltipContent = () => (
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

