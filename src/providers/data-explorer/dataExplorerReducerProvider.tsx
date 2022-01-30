import { Dispatch, FC, Reducer, ReducerAction, ReducerState, useCallback, useReducer, useRef } from 'react';
import Context, { GetState } from '../../contexts/data-explorer/dataExplorerReducerContext';
import dataExplorerReducer, { DataExplorerStateInitializer, defaultStateInitializer } from '../../reducers/data-explorer/dataExplorerReducer';
import DataExplorerState from '../../types/data-explorer/dataExplorerState';

const useEnhancedReducer = <R extends Reducer<any, any>, I>(reducer: R, initState: I, initializer: (arg: I) => ReducerState<R>):
    [ReducerState<R>, Dispatch<ReducerAction<R>>, GetState<R>] => {
    const lastState = useRef<ReducerState<R>>(initializer(initState));
    const getState = useCallback(() => lastState.current, [lastState]);
    const enhancedReducer = useCallback(
        (state: ReducerState<R>, action: ReducerAction<R>): ReducerState<R> => {
            lastState.current = reducer(state, action);
            return lastState.current;
        }, [reducer, lastState]);
    return [
        ...useReducer(
            enhancedReducer,
            initState,
            initializer
        ),
        getState
    ];
};
  
const DataExplorerReducerProvider: FC<{initialState?: DataExplorerState}> = ({initialState, children}) => {
    const [state, dispatch, getState] = useEnhancedReducer(dataExplorerReducer, initialState, defaultStateInitializer);
    return <Context.Provider value={{dispatch, state, getState}}>{children}</Context.Provider>;
};

export default DataExplorerReducerProvider;

export type {
    DataExplorerStateInitializer
}