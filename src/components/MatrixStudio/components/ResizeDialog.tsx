import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Slider,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

interface ResizeDialogProps {
  open: boolean;
  onClose: () => void;
  onApply: () => void;
  rows: number;
  cols: number;
  onRowsChange: (value: number) => void;
  onColsChange: (value: number) => void;
}

export const ResizeDialog = ({ open, onClose, onApply, rows, cols, onRowsChange, onColsChange }: ResizeDialogProps) => {
  const handleNumericInputChange = (setter: (value: number) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value > 0) { // Ensure value is a positive number
      setter(value);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Resize Matrix</DialogTitle>
      <DialogContent>
        <Grid container spacing={3} alignItems="center" sx={{ pt: 1 }}>
          <Grid size={{ xs: 12 }}>
            <Typography variant="caption" id="rows-slider" gutterBottom>
              Rows ({rows})
            </Typography>
            <Stack direction="row" spacing={2} alignItems="center">
              <Slider
                aria-labelledby="rows-slider"
                value={rows}
                onChange={(_e, value) => onRowsChange(value as number)}
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
          <Grid size={{xs:12}}>
            <Typography variant="caption" id="cols-slider" gutterBottom>
              Cols ({cols})
            </Typography>
            <Stack direction="row" spacing={2} alignItems="center">
              <Slider
                aria-labelledby="cols-slider"
                value={cols}
                onChange={(_e, value) => onColsChange(value as number)}
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
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onApply} variant="contained">Apply</Button>
      </DialogActions>
    </Dialog>
  );
};