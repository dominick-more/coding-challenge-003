import AppBusinessData from '../../types/data-explorer/appBusinessData';
import DataExplorerReadAccessors, { NormalizeFilterValue } from '../../types/data-explorer/dataExplorerAccessors';
import { ValueFilter } from '../../types/data-explorer/dataExplorerState';
import DataTreeNode, { DataTreeNodeType, DataTreeRootNodeId } from '../../types/data-explorer/dataTreeNode';

const AppBusinessDataAsTreeComparator = Object.freeze((a: AppBusinessData, b: AppBusinessData): number => {
    if (a.BCAP1 !== b.BCAP1) {
        return String(a.BCAP1).localeCompare(String(b.BCAP1));
    }
    if (a.BCAP2 !== b.BCAP2) {
        return String(a.BCAP2).localeCompare(String(b.BCAP2));
    }
    if (a.BCAP3 !== b.BCAP3) {
        return String(a.BCAP3).localeCompare(String(b.BCAP3));
    }
    if (a.id !== b.id) {
        return String(a.id).localeCompare(String(b.id));
    }
    return 0;
});

class DataExplorerReadAccessorsDefault implements DataExplorerReadAccessors {
    
    filterDataTreeLeaves(rootTreeNode: DataTreeNode, nodeId?: string, valueFilter?: Readonly<ValueFilter>): Array<DataTreeNode> | undefined {
        const foundTreeNode = this.findDataTreeNode(rootTreeNode, nodeId);
        if (foundTreeNode === undefined) {
            return undefined;
        }
        const { children, type } = foundTreeNode;
        if ((type !== DataTreeNodeType.branch) || (children === undefined)) {
            return undefined;
        }
        return Object.values(children).filter((childNode) => {
            const { type: childType, value } = childNode;
            if ((childType !== DataTreeNodeType.leaf) || (value === undefined)) {
                return false;
            }
            if (valueFilter !== undefined) {
                return (value >= valueFilter[0]) && (value <= valueFilter[1]);
            }
            return true;
        });
    }

    findDataTreeNode(rootTreeNode: DataTreeNode, nodeId?: string): DataTreeNode | undefined {
        if (nodeId === undefined) {
            return undefined;
        }
        const treeNodeStack: Array<DataTreeNode> = [];
        const findNode = (treeNode: DataTreeNode): boolean => {
            const { nodeId : compareNodeId, children} = treeNode;
            if (nodeId === compareNodeId) {
                // Root node path is the empty array
                return true;
            }
            if ((children !== undefined) && Object.getOwnPropertyNames(children).length) {
                return Object.values(children).some((childNode) => {
                    treeNodeStack.push(childNode);
                    const result = findNode(childNode);
                    if(!result) {
                        treeNodeStack.pop();
                    }
                    return result;
                });
            }
            return false;
        };
        return findNode(rootTreeNode) ? treeNodeStack.pop() : undefined;
    }

    getRemoteAsTreeComparator(): (a: AppBusinessData, b: AppBusinessData) => number {
        return AppBusinessDataAsTreeComparator;
    }

    getMinMaxFilterValue(treeNode: DataTreeNode): Readonly<ValueFilter> {
        const allValues: Array<number> = [];
        const walkTree = (treeNode: DataTreeNode): void => {
            const { children, type, value } = treeNode;
            if (type === DataTreeNodeType.leaf) {
                if((value !== undefined) && Number.isInteger(value) &&
                    (value > 0) && !allValues.includes(value))  {
                    allValues.push(value);
                }
                return;
            }
            if ((children !== undefined) && Object.getOwnPropertyNames(children).length) {
                Object.values(children).forEach((childNode) => {
                    walkTree(childNode);
                });
            }
        };
        walkTree(treeNode);
        allValues.sort((a, b) => a - b);
        const length = allValues.length;
        if (length === 0) {
            return [0, 1];
        }
        if (length === 1) {
            return [0, allValues[0]];
        }
        return [allValues[0], allValues[length - 1]];
    }

    createNormalizeValueFilter(minMaxValues: Readonly<ValueFilter>): NormalizeFilterValue {
        return (value: number | number[]): Readonly<ValueFilter> | undefined => {
            const [min, max] = minMaxValues;
            const arrayValue = Array.isArray(value) ? [...value] : [value];
            const length = arrayValue.length;
            if (!length) {
                return undefined;
            }
            if (length === 1) {
                const newValue = arrayValue[0];
                if (newValue >= min) {
                    return (newValue <= max) ? [min, newValue] : undefined;
                }
                return undefined;
            }
            arrayValue.sort((a, b) => a - b);
            const [newMinValue, newMaxValue] = [...arrayValue.slice(0, 2)];
            if (newMinValue >= min) {
                if (newMaxValue <= max) {
                    return [newMinValue, newMaxValue];
                }
            }
            return undefined;
        };
    }

    transformTableToDataTree(data: ReadonlyArray<AppBusinessData>): DataTreeNode {
        let counter = 0;
        const addTreeNodeBranch = (parent: DataTreeNode, id: string, name: string): DataTreeNode | undefined => {
            if (parent.children !== undefined) {
                if (!parent.children.hasOwnProperty(id)) {
                    const child: DataTreeNode = {
                        id,
                        name,
                        nodeId: String(counter++),
                        type: DataTreeNodeType.branch,
                        children: {}
                    };
                    parent.children[id] = child;
                    return child;
                } else {
                    return parent.children[id];
                }
            }
            return undefined;
        };
        const rootTreeNode: DataTreeNode = {
            id: DataTreeRootNodeId,
            name: '',
            nodeId: String(counter++),
            type: DataTreeNodeType.branch,
            children: {}
        };
        const treeSortedData = [...data].sort(this.getRemoteAsTreeComparator());
        treeSortedData.reduce((accumulator: DataTreeNode, value: AppBusinessData): DataTreeNode => {
            if (value.BCAP1?.length) {
                const bcap1Node = addTreeNodeBranch(accumulator, value.BCAP1, value.BCAP1);
                if (bcap1Node && value.BCAP2?.length) {
                    const bcap2Node = addTreeNodeBranch(bcap1Node, value.BCAP2, value.BCAP2);
                    if (bcap2Node && value.BCAP3?.length) {
                        const bcap3Node = addTreeNodeBranch(bcap2Node, value.BCAP3, value.BCAP3);
                        if (bcap3Node?.children !== undefined && value.id?.length) {
                            if (!bcap3Node.children.hasOwnProperty(value.id)) {
                                bcap3Node.children[value.id] = {
                                    id: value.id,
                                    name: value.name,
                                    nodeId: String(counter++),
                                    type: DataTreeNodeType.leaf,
                                    value: value.spend
                                };
                            } else {
                                console.warn(
                                    `Branch '${bcap3Node.id}' already contains a child '${value.id}'.`);
                            }
                        }
                    }
                }
            }
            return accumulator;
        }, rootTreeNode);
        return rootTreeNode;
    }
}

export default DataExplorerReadAccessorsDefault;