import { ValueFilter } from './dataExplorerState';

interface DataExplorerActionCreators {
    fetchData(): Promise<void>;
    getAsyncWaitTimeout(): number;
    updateTreeNodeSelection(nodeId?: string): void;
    updateValueFilter(filter: Readonly<ValueFilter> | undefined): void;
}

export default DataExplorerActionCreators;