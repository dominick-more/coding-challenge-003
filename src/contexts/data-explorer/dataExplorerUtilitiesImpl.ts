import { Dispatch } from 'react';
import { DataExplorerActionType, DataExplorerStateAction } from '../../reducers/data-explorer/dataExplorerReducer';
import AppBusinessData from '../../types/data-explorer/appBusinessData';
import { FetchStatus, ValueFilter } from '../../types/data-explorer/dataExplorerState';
import DataExplorerUtilities from '../../types/data-explorer/dataExplorerUtilities';
import DataTreeNode, { DataTreeNodeType, DataTreeRootNodeId } from '../../types/data-explorer/dataTreeNode';

const compareAppBusinessData = (a: AppBusinessData, b: AppBusinessData): number => {
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
};

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

class DataExplorerUtilitiesImpl implements DataExplorerUtilities {

    private readonly dispatch: Dispatch<DataExplorerStateAction>;

    constructor(dispatch: Dispatch<DataExplorerStateAction>) {
        this.dispatch = dispatch;
    }

    _makeDataTree(data: ReadonlyArray<AppBusinessData>): DataTreeNode {
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
        data.reduce((accumulator: DataTreeNode, value: AppBusinessData): DataTreeNode => {
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

    fetchData(): Promise<void> {
        const dataUrl = getDataUrl();
        const thisClosure = this;
        this.dispatch({
            type: DataExplorerActionType.UpdateFetchStatus,
            payload: FetchStatus.InProgress
        });
        return new Promise((resolve) => {
            const dataPromise = fetch(dataUrl, {mode: 'cors'});
            dataPromise.then((response) => response.json()).then((data) => {
                thisClosure.dispatch({
                    type: DataExplorerActionType.UpdateData,
                    payload: thisClosure._makeDataTree(Array.isArray(data) ? data.sort(
                        compareAppBusinessData) : [])
                });
            }).catch((reason) => {
                thisClosure.dispatch({
                    type: DataExplorerActionType.UpdateData,
                    payload: coerceAsError(reason)
                });
            }).finally(() => resolve());
        });
    }

    filterDataTreeLeaves(rootTreeNode: DataTreeNode, nodeId: string, valueFilter?: Readonly<ValueFilter>): Array<DataTreeNode> | undefined {
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

    findDataTreeNode(rootTreeNode: DataTreeNode, nodeId: string): DataTreeNode | undefined {
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

export default DataExplorerUtilitiesImpl;

