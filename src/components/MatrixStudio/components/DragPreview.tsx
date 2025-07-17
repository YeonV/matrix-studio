// src/components/MatrixStudio/components/DragPreview.tsx

import { useAtomValue } from 'jotai';
import { Paper, Stack, Typography } from '@mui/material';
import { ViewModule, Gesture } from '@mui/icons-material';
import { dragStateAtom } from '../atoms';
import { useEffect, useState } from 'react';

export const DragPreview = () => {
  const dragState = useAtomValue(dragStateAtom);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  // This effect tracks the mouse position globally
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Don't render anything unless a drag is *actively* happening
  if (!dragState || !dragState.isDragging) {
    return null;
  }

  // Render a different preview based on the drag type
  const isMove = dragState.type === 'move';
  const icon = isMove ? <ViewModule /> : <Gesture />;
  const text = isMove
    ? `${dragState.draggedAtoms.length} pixel${dragState.draggedAtoms.length > 1 ? 's' : ''}`
    : 'Painting';

  return (
    <Paper
      elevation={4}
      sx={{
        position: 'fixed',
        top: position.y,
        left: position.x,
        // Critical: Let mouse events pass through to the grid below
        pointerEvents: 'none',
        zIndex: 9999,
        // Offset the preview so it doesn't sit directly under the cursor
        transform: 'translate(20px, 20px)',
        p: 1,
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1}>
        {icon}
        <Typography variant="body2">{text}</Typography>
      </Stack>
    </Paper>
  );
};