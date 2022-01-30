import { Reducer } from 'react';
import DataExplorerState, { FetchStatus, ValueFilter } from '../../types/data-explorer/dataExplorerState';
import DataTreeNode, { DataTreeNodeType, DataTreeRootNodeId } from '../../types/data-explorer/dataTreeNode';

enum DataExplorerActionType {
    'UpdateData' = 'UpdateData',
    'UpdateFetchStatus' = 'UpdateFetchStatus',
    'UpdateTreeNodeSelection' = 'UpdateTreeNodeSelection',
    'UpdateValueFilter' = 'UpdateValueFilter'
}

type UpdateDataAction = {
    type: DataExplorerActionType.UpdateData;
    payload: DataTreeNode | Error;
}

type UpdateFetchStatusAction = {
    type: DataExplorerActionType.UpdateFetchStatus;
    payload: FetchStatus | undefined;
}

type UpdateTreeNodeSelectionAction = {
    type: DataExplorerActionType.UpdateTreeNodeSelection;
    payload: string | undefined;
}

type UpdateValueFilterAction = {
    type: DataExplorerActionType.UpdateValueFilter;
    payload: Readonly<ValueFilter> | undefined;
}

type DataExplorerStateAction = UpdateDataAction | UpdateFetchStatusAction |
    UpdateTreeNodeSelectionAction | UpdateValueFilterAction;

type DataExplorerStateInitializer = (arg?: DataExplorerState) => DataExplorerState;

const createRootTreeNode = (): DataTreeNode => {
    return {
        id: DataTreeRootNodeId,
        name: '',
        nodeId: '0',
        type: DataTreeNodeType.branch,
        children: {}
    };
};

const defaultStateInitializer: DataExplorerStateInitializer = (arg?: DataExplorerState) => {
    if (arg !== undefined) {
        return arg;
    }
    return {
        data: createRootTreeNode()
    };
};
   
const dataExplorerReducer: Reducer<DataExplorerState, DataExplorerStateAction> =
    (state: DataExplorerState, action: DataExplorerStateAction): DataExplorerState => {
    switch (action.type) {
        case DataExplorerActionType.UpdateData: {
            const { payload } = action;  
            if (payload instanceof Error) {
                return {
                    ...state,
                    data: createRootTreeNode(),
                    error: payload,
                    fetchStatus: FetchStatus.Done
                };
            }
            return {
                ...state,
                data: payload,
                error: undefined,
                fetchStatus: FetchStatus.Done
            };
        } case DataExplorerActionType.UpdateFetchStatus: {
            const { payload } = action;
            return {
                ...state,
                fetchStatus: payload
            };
        } case DataExplorerActionType.UpdateTreeNodeSelection: {
            const { payload } = action;
            return {
                ...state,
                treeNodeSelection: payload
            };
        } case DataExplorerActionType.UpdateValueFilter: {
            const { payload } = action;
            return {
                ...state,
                valueFilter: payload
            };
        }
        default:
            throw new Error(`Unhandled action '${JSON.stringify(action)}'.`);
    }
};

export default dataExplorerReducer;

export {
    createRootTreeNode,
    defaultStateInitializer,
    DataExplorerActionType
}

export type {
    DataExplorerStateAction,
    UpdateDataAction,
    UpdateFetchStatusAction,
    UpdateTreeNodeSelectionAction,
    DataExplorerStateInitializer
}