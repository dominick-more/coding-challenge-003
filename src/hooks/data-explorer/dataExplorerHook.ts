import { useContext, useEffect, useMemo } from 'react';
import DataExplorerActionCreatorsDefault from '../../action-creators/data-explorer/dataExplorerActionCreatorsDefault';
import DataExplorerReadAccessorsDefault from '../../accessors/data-explorer/dataExplorerReadAccessorsDefault';
import Context from '../../contexts/data-explorer/dataExplorerReducerContext';
import DataExplorerActionCreators from '../../types/data-explorer/dataExplorerActionCreators';
import DataExplorerReadAccessors from '../../types/data-explorer/dataExplorerAccessors';
import DataExplorerState from '../../types/data-explorer/dataExplorerState';
import DataExplorerEventHandlers from '../../types/data-explorer/dataExplorerEventHandlers';
import DataExplorerEventHandlersDefault from '../../event-handlers/data-explorer/dataExplorerEventHandlersDefault';

type DataExplorerHookResult = {
    actionCreators?: DataExplorerActionCreators;
    eventHandlers?: DataExplorerEventHandlers;
    readAccessors?: DataExplorerReadAccessors;
    state?: DataExplorerState;
}

const readAccessors = new DataExplorerReadAccessorsDefault();
const eventHandlers = new DataExplorerEventHandlersDefault();

const useDataExplorerHook = (): DataExplorerHookResult => {
    const reducerContext = useContext(Context);
    const { dispatch, state, getState } = reducerContext || {};
    const { fetchStatus } = state || {};

    const actionCreators = useMemo(() => {
        if ((dispatch === undefined) || (getState === undefined)) {
            return undefined;
        }
        return new DataExplorerActionCreatorsDefault(dispatch, readAccessors, getState);
    }, [dispatch, getState]);

    // Fetching server data in the top level data explorer render component
    useEffect(() => {
        if (actionCreators === undefined) {
            return;
        }
        // If fetch is already initialized return
        if (fetchStatus !== undefined) {
            return;
        }
        (async () => {
            await actionCreators.fetchData();
        })();
        
    }, [fetchStatus, actionCreators]);

    return {
        actionCreators,
        eventHandlers,
        readAccessors,
        state
    }
};

export default useDataExplorerHook;

export type {
    DataExplorerHookResult
}