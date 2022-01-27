import { useContext, useMemo, FC, ReactNode, SyntheticEvent, Fragment } from 'react';
import { TreeItem, TreeView } from '@mui/lab';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import DataExplorerContext from '../../contexts/data-explorer/dataExplorerContext';
import DataTreeNode, { DataTreeNodeType, DataTreeRootNodeId } from '../../types/data-explorer/dataTreeNode';
import { Box } from '@mui/material';

const createTreeNodeKey = (treeNode: DataTreeNode): string => `tree-item-${treeNode.nodeId}`;

const DataTreeItem: FC<{treeNode: DataTreeNode}> = ({treeNode, children}) => {
    const { nodeId, name } = treeNode;
    return (
        <TreeItem nodeId={nodeId} label={name} key={createTreeNodeKey(treeNode)}>
            {children}
        </TreeItem>
    );
};

const renderTreeNodeRecursive: FC<{treeNode: DataTreeNode}> = ({treeNode}) => {
    const { children, type } = treeNode;
    if (type !== DataTreeNodeType.branch) {
        return null;
    }
    const childNodes: ReactNode = ((children !== undefined) && Object.getOwnPropertyNames(children).length) ?
        Object.values(children).filter((childNode) => {
            return (childNode.type === DataTreeNodeType.branch)
        }).map((childNode) => {
            return renderTreeNodeRecursive({treeNode: childNode});
        }) : undefined;
    if (treeNode.id === DataTreeRootNodeId) {
        return (
            <Fragment key={createTreeNodeKey(treeNode)}>{childNodes}</Fragment>
        );
    } else {
        return (
            <DataTreeItem treeNode={treeNode} key={createTreeNodeKey(treeNode)}>
                {childNodes}
            </DataTreeItem>
        );
    }
};

const DataTreeView: FC = () => {
    const context = useContext(DataExplorerContext);
    const { state, utils } = context || {};
    const { data } = state || {};
    
    const onNodeSelect = useMemo(() => {
        return (event: SyntheticEvent, nodeId: string): void => {
            if ((utils === undefined) || (data === undefined)) {
                return;
            }
            event.preventDefault();
            utils.updateTreeNodeSelection(nodeId);
        };
    }, [data, utils]);

    if (data !== undefined) {
        return (
            <Box>
                <TreeView
                    defaultCollapseIcon={<ArrowDropUpIcon />}
                    defaultExpandIcon={<ArrowDropDownIcon />}
                    key='data-tree-view'
                    onNodeSelect={onNodeSelect}
                >
                    {renderTreeNodeRecursive({treeNode: data})}
                </TreeView>
            </Box>
        );
    } else {
        return null;
    }
};

export default DataTreeView;