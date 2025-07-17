import { createContext, useContext } from 'react';
import { useMatrixStudio } from './useMatrixStudio';

type MatrixStudioAPI = ReturnType<typeof useMatrixStudio>;

export const MatrixStudioContext = createContext<MatrixStudioAPI | null>(null);

export const useMatrixEditorContext = () => {
  const context = useContext(MatrixStudioContext);
  if (!context) {
    throw new Error('useMatrixEditorContext must be used within MatrixStudio');
  }
  return context;
};