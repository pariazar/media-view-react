import { createContext } from 'react';
import type { DataType } from './types';
export type UpdateItemType = (dataType: DataType) => void;
export interface MediaContextType {
  show: (key: number) => void;
  update: UpdateItemType;
  remove: (key: number) => void;
  nextId: () => number;
}
export default createContext<MediaContextType>(undefined as unknown as MediaContextType);
