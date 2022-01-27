import DataTreeNode from './dataTreeNode';

enum FetchStatus {
    'InProgress', 'Done'
}

type ValueFilter = [number, number];

type DataExplorerState = {
    data: DataTreeNode;
    treeNodeSelection?: string;
    error?: Error;
    fetchStatus?: FetchStatus;
    valueFilter?: Readonly<ValueFilter>;
    
}

export default DataExplorerState;

export {
    FetchStatus
}

export type {
    ValueFilter
}