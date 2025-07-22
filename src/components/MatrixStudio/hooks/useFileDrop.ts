// src/components/MatrixStudio/hooks/useFileDrop.ts

import { useState, useCallback } from 'react';

// This hook now expects a simple callback that receives the raw File
interface UseFileDropProps {
  onFileDrop: (file: File) => void;
}

export const useFileDrop = ({ onFileDrop }: UseFileDropProps) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(true);
  }, []);

  const onDragLeave = useCallback(() => {
    setIsDragOver(false);
  }, []);

  const onDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      const file = event.dataTransfer.files[0];
      if (file.type === 'application/json') {
        // Call the prop with the raw file. The App will handle parsing.
        onFileDrop(file);
      } else {
        console.error("Invalid file type. Please drop a .json file.");
      }
      event.dataTransfer.clearData();
    }
  }, [onFileDrop]);

  return {
    isDragOver,
    dropZoneProps: { onDragOver, onDragLeave, onDrop },
  };
};