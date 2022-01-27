import { ValueFilter } from './dataExplorerState';
import DataTreeNode from './dataTreeNode';

interface DataExplorerUtilities {
    fetchData(): Promise<void>;
    filterDataTreeLeaves(rootTreeNode: DataTreeNode, nodeId: string, valueFilter?: Readonly<ValueFilter>): Array<DataTreeNode> | undefined;
    findDataTreeNode(rootTreeNode: DataTreeNode, nodeId: string): DataTreeNode | undefined;
    getMinMaxFilterValue(treeNode: DataTreeNode): Readonly<ValueFilter>;
    updateTreeNodeSelection(nodeId?: string): void;
    updateValueFilter(filter: Readonly<ValueFilter> | undefined): void;
}

export default DataExplorerUtilities;