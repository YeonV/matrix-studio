// src/components/MatrixStudio/MatrixStudio.types.ts

// NEW: Define the shape of a device object
export interface IDevice {
  id: string;
  count: number;
}

// The core data structure for a single cell
export interface IMCell {
  deviceId: string;
  pixel: number;
  group?: string;
}

// The default empty cell state constant
export const MCell: IMCell = { deviceId: '', pixel: 0, group: '' };

export interface ILayoutFile {
  name?: string
  matrixData: IMCell[][];
  deviceList?: IDevice[];
}

// The props our main component will accept
export interface MatrixStudioProps {
  rows?: number;
  cols?: number;
  initialData?: IMCell[][];
  onSave?: (data: IMCell[][]) => void;
  onChange?: (data: IMCell[][]) => void;
  deviceList?: IDevice[];
  onLoadLayout?: (layout: ILayoutFile) => void;
  onFileDrop?: (file: File) => void;
  onLoadEmpty: () => void;
  onLoadClick: () => void;
  onExportClick: () => void;
  onResizeClick: () => void;
  ledFxOrigin?: string | null;
  onSaveAndReturn?: () => void;
}