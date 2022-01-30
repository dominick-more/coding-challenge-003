import AppBusinessData from './appBusinessData';
import { ValueFilter } from './dataExplorerState';
import DataTreeNode from './dataTreeNode';

type NormalizeFilterValue = (value: number | number[]) => Readonly<ValueFilter> | undefined;

interface DataExplorerReadAccessors {
    createNormalizeValueFilter(minMaxValues: Readonly<ValueFilter>): NormalizeFilterValue;
    filterDataTreeLeaves(rootTreeNode: DataTreeNode, nodeId?: string, valueFilter?: Readonly<ValueFilter>): Array<DataTreeNode> | undefined;
    findDataTreeNode(rootTreeNode: DataTreeNode, nodeId?: string): DataTreeNode | undefined;
    getMinMaxFilterValue(treeNode: DataTreeNode): Readonly<ValueFilter>;
    getRemoteAsTreeComparator(): (a: AppBusinessData, b: AppBusinessData) => number;
    transformTableToDataTree(data: ReadonlyArray<AppBusinessData>): DataTreeNode;
    
}

export default DataExplorerReadAccessors;

export type {
    NormalizeFilterValue
}