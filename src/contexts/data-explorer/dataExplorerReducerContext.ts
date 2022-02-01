import { createContext, Dispatch, Reducer, ReducerState } from 'react';
import { DataExplorerStateAction } from '../../reducers/data-explorer/dataExplorerReducer';
import DataExplorerState from '../../types/data-explorer/dataExplorerState';

/**
 * A reference to the current reducer state value for inspection before the
 * react fiber is reconciled. This is helpful to determine the current reducer
 * state as it was last set, before the new state is propagated to the component
 * in the next render lifecycle.
 */
type GetState<R extends Reducer<any, any>> = () => ReducerState<R>;

type DataExplorerReducerContextValue = {
    dispatch: Dispatch<DataExplorerStateAction>;
    state: DataExplorerState;
    getState: GetState<Reducer<DataExplorerState, DataExplorerStateAction>>;
}

const DataExplorerReducerContext = createContext<DataExplorerReducerContextValue | undefined>(undefined);
DataExplorerReducerContext.displayName = 'DataExplorerReducerContext';

export default DataExplorerReducerContext;

export type {
    DataExplorerReducerContextValue,
    GetState
}