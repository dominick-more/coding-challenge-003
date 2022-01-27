import { createContext } from 'react';
import DataExplorerUtilities from '../../types/data-explorer/dataExplorerUtilities';
import DataExplorerState from '../../types/data-explorer/dataExplorerState';

type DataExplorerContextValue = {
    state: DataExplorerState;
    utils: DataExplorerUtilities;
}

const DataExplorerContext = createContext<DataExplorerContextValue | undefined>(undefined);
  
export default DataExplorerContext;

export type {
    DataExplorerContextValue
}