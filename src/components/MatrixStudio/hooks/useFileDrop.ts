import { useState, useCallback } from 'react';
import type { IDevice, IMCell } from '../MatrixStudio.types';

// Define the shape of our layout file
interface ILayoutFile {
  rows: number;
  cols: number;
  matrixData: IMCell[][];
  deviceList?: IDevice[];
}

// The props our hook will accept
interface UseFileDropProps {
  onLoadLayout: (layout: ILayoutFile) => void;
}

export const useFileDrop = ({ onLoadLayout }: UseFileDropProps) => {
  const [isDragOver, setIsDragOver] = useState(false);

  // A simple validation function for our layout file
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const isValidLayoutFile = (data: any): data is ILayoutFile => {
  return (
    Array.isArray(data.matrixData) &&
    data.matrixData.length > 0 && // Must have at least one row
    Array.isArray(data.matrixData[0]) // The first row must be an array
  );
};

  const handleFile = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (isValidLayoutFile(data)) {
          const inferredRows = data.matrixData.length;
            const inferredCols = data.matrixData[0].length;
            
            // Pass a complete, validated object to the handler
            onLoadLayout({
            rows: inferredRows,
            cols: inferredCols,
            matrixData: data.matrixData,
            deviceList: data.deviceList, // Pass this along if it exists
            });
        } else {
          // You could add a snackbar here for user feedback
          console.error("Invalid layout file format.");
        }
      } catch (error) {
        console.error("Failed to parse JSON file.", error);
      }
    };
    reader.readAsText(file);
  }, [onLoadLayout]);

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
        handleFile(file);
      } else {
        console.error("Invalid file type. Please drop a .json file.");
      }
      // Clean up to prevent the browser from opening the file
      event.dataTransfer.clearData();
    }
  }, [handleFile]);

  // Return the state and the handlers for the component to use
  return {
    isDragOver,
    dropZoneProps: {
      onDragOver,
      onDragLeave,
      onDrop,
    },
  };
};