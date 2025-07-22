// src\components\MatrixStudio\components\ConfirmationDialog.tsx
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';
import type { ILayoutFile } from '../MatrixStudio.types';

interface ConfirmationDialogProps {
  isOpen: boolean;
  layout: ILayoutFile | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmationDialog = ({ isOpen, layout, onConfirm, onCancel }: ConfirmationDialogProps) => {
  if (!layout) {
    return null;
  }
    const rows = layout.matrixData.length;
  const cols = layout.matrixData[0]?.length || 0;

  // Generate a descriptive message for the user
  const description = `You are about to load a ${rows}x${cols} layout.`;
  const deviceDescription = layout.deviceList
    ? ` It includes a new list of ${layout.deviceList.length} device(s).`
    : '';

  return (
    <Dialog open={isOpen} onClose={onCancel}>
      <DialogTitle>Load New Layout?</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {description}
          {deviceDescription}
        </DialogContentText>
        <DialogContentText sx={{ mt: 1 }}>
          Your current unsaved work will be overwritten. Are you sure you want to proceed?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>Cancel</Button>
        <Button onClick={onConfirm} variant="contained" autoFocus>
          Load Layout
        </Button>
      </DialogActions>
    </Dialog>
  );
};