import { Box, Typography } from '@mui/material';
import { FileUpload } from '@mui/icons-material';

interface FileDropOverlayProps {
  isDragOver: boolean;
}

export const FileDropOverlay = ({ isDragOver }: FileDropOverlayProps) => {
  if (!isDragOver) {
    return null;
  }

  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000,
        pointerEvents: 'none', // Let drop events pass through to the parent
        border: 2,
        borderColor: 'primary.main',
        borderStyle: 'dashed',
        borderRadius: 2, // Match parent's padding
      }}
    >
      <FileUpload sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
      <Typography variant="h5" color="common.white">
        Drop JSON Layout File
      </Typography>
    </Box>
  );
};