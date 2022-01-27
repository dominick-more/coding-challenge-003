enum DataTreeNodeType {
    'branch',
    'leaf'
}

const DataTreeRootNodeId = '<data_root>';

type DataTreeNode = {
    id: string;
    name: string;
    nodeId: string;
    type: DataTreeNodeType; 
    children?: Record<string, DataTreeNode>;
    value?: number;
}

export default DataTreeNode;

export {
    DataTreeNodeType,
    DataTreeRootNodeId
}