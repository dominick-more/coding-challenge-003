import { Dispatch, FC, Reducer, ReducerAction, ReducerState, useCallback, useMemo, useReducer, useRef } from 'react';
import ReducerContext, { GetState } from '../../contexts/data-explorer/dataExplorerReducerContext';
import dataExplorerReducer, { DataExplorerStateInitializer, defaultStateInitializer } from '../../reducers/data-explorer/dataExplorerReducer';
import DataExplorerState from '../../types/data-explorer/dataExplorerState';

const useStateRefReducer = <R extends Reducer<any, any>, I>(reducer: R, initState: I, initializer: (arg: I) => ReducerState<R>):
    [ReducerState<R>, Dispatch<ReducerAction<R>>, GetState<R>] => {
    const lastState = useMemo(() => initializer(initState), [initState, initializer]);
    const lastStateRef = useRef<ReducerState<R>>(lastState);
    const getState = useCallback(() => lastStateRef.current, [lastStateRef]);
    const stateRefReducer = useCallback(
        (state: ReducerState<R>, action: ReducerAction<R>): ReducerState<R> => {
            lastStateRef.current = reducer(state, action);
            return lastStateRef.current;
        }, [reducer, lastStateRef]);
    return [
        ...useReducer(
            stateRefReducer,
            initState,
            initializer
        ),
        getState
    ];
};
  
const DataExplorerReducerProvider: FC<{initialState?: DataExplorerState}> = ({initialState, children}) => {
    const [state, dispatch, getState] = useStateRefReducer(dataExplorerReducer, initialState, defaultStateInitializer);
    return <ReducerContext.Provider value={{dispatch, state, getState}}>{children}</ReducerContext.Provider>;
};

export default DataExplorerReducerProvider;

export type {
    DataExplorerStateInitializer
}