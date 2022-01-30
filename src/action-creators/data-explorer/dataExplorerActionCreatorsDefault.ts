import { Dispatch, Reducer } from 'react';
import { DataExplorerActionType, DataExplorerStateAction } from '../../reducers/data-explorer/dataExplorerReducer';
import DataExplorerState, { FetchStatus, ValueFilter } from '../../types/data-explorer/dataExplorerState';
import DataExplorerActionCreators from '../../types/data-explorer/dataExplorerActionCreators';
import DataExplorerReadAccessors from '../../types/data-explorer/dataExplorerAccessors';
import { GetState } from '../../contexts/data-explorer/dataExplorerReducerContext';

const asyncWaitTimeout = 10;
    
const coerceAsError = (reason: any): Error => {
    if (reason instanceof Error) {
        return reason;
    }
    return new Error(`An error occured: ${JSON.stringify(reason)}`);
};

const getDataUrl = (): string => {
    const {hostname, protocol} = document.location; 
    const dataUrl = [protocol, '//', hostname, ':8080', '/data'].join('');
    return dataUrl;
};

class DataExplorerActionCreatorsDefault implements DataExplorerActionCreators {
    private readonly dispatch: Dispatch<DataExplorerStateAction>;
    private readonly readAccessors: DataExplorerReadAccessors;
    private readonly getState: GetState<Reducer<DataExplorerState, DataExplorerStateAction>>;
    
    constructor(dispatch: Dispatch<DataExplorerStateAction>, readAccessors: DataExplorerReadAccessors,
        getState: GetState<Reducer<DataExplorerState, DataExplorerStateAction>>) {
        this.dispatch = dispatch;
        this.readAccessors = readAccessors;
        this.getState = getState;
    }

    fetchData(): Promise<void> {
        // getState returns a ref to the last updated state which is updated when
        // reducer is called instead of on rerender. This is required when calling
        // the same action from different components to ensure fetch is not called
        // multiple times.
        if (this.getState().fetchStatus === FetchStatus.InProgress) {
            return Promise.resolve();
        }
        const dataUrl = getDataUrl();
        this.dispatch({
            type: DataExplorerActionType.UpdateFetchStatus,
            payload: FetchStatus.InProgress
        });
        const thisClosure = this;
        return new Promise((resolve) => {
            const dataPromise = fetch(dataUrl, {mode: 'cors'});
            // Delay dispatch until provider is rendered with fetchStatus
            setTimeout(() => {
                dataPromise.then((response) => response.json()).then((data) => {
                    thisClosure.dispatch({
                        type: DataExplorerActionType.UpdateData,
                        payload: thisClosure.readAccessors.transformTableToDataTree(
                            Array.isArray(data) ? data : [])
                    });
                }).catch((reason) => {
                    thisClosure.dispatch({
                        type: DataExplorerActionType.UpdateData,
                        payload: coerceAsError(reason)
                    });
                }).finally(() => resolve());
            }, thisClosure.getAsyncWaitTimeout());
            
        });
    }

    getAsyncWaitTimeout(): number {
        return asyncWaitTimeout;
    }

    updateTreeNodeSelection(nodeId?: string): void {
        this.dispatch({
            type: DataExplorerActionType.UpdateTreeNodeSelection,
            payload: nodeId
        });
    }

    updateValueFilter(filter?: Readonly<ValueFilter>): void {
        this.dispatch({
            type: DataExplorerActionType.UpdateValueFilter,
            payload: filter
        });
    }
}

export default DataExplorerActionCreatorsDefault;

export {
    asyncWaitTimeout
}
