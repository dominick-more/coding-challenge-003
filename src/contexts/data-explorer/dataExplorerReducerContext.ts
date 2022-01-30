import { createContext, Dispatch, Reducer, ReducerState } from 'react';
import { DataExplorerStateAction } from '../../reducers/data-explorer/dataExplorerReducer';
import DataExplorerState from '../../types/data-explorer/dataExplorerState';

type GetState<R extends Reducer<any, any>> = () => ReducerState<R>;

type DataExplorerReducerContextValue = {
    dispatch: Dispatch<DataExplorerStateAction>;
    state: DataExplorerState;
    getState: GetState<Reducer<DataExplorerState, DataExplorerStateAction>>;
}

const DataExplorerReducerContext = createContext<DataExplorerReducerContextValue | undefined>(undefined);
  
export default DataExplorerReducerContext;

export type {
    DataExplorerReducerContextValue,
    GetState
}