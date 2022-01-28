import { useContext, FC, ReactNode, SyntheticEvent, Fragment, useCallback } from 'react';
import { TreeItem, treeItemClasses, TreeItemProps, TreeView } from '@mui/lab';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import DataExplorerContext from '../../contexts/data-explorer/dataExplorerContext';
import DataTreeNode, { DataTreeNodeType, DataTreeRootNodeId } from '../../types/data-explorer/dataTreeNode';
import { Box, styled, SxProps, Theme } from '@mui/material';

const DataExplorerCapabilityTreeId = 'data-explorer-capability-tree';

const createTreeNodeKey = (treeNode: DataTreeNode): string => `tree-item-${treeNode.nodeId}`;

const StyledTreeItem = styled((props: TreeItemProps) => (
    <TreeItem {...props} />
  ))(({ theme }) => ({
    [`& .${treeItemClasses.label}`]: {
      fontSize: '0.8rem !important'
    }
  }));

const DataTreeItem: FC<{treeNode: DataTreeNode}> = ({treeNode, children}) => {
    const { nodeId, name } = treeNode;
    return (
        <StyledTreeItem nodeId={nodeId} label={name} key={createTreeNodeKey(treeNode)}>
            {children}
        </StyledTreeItem>
    );
};

const renderTreeNodeRecursive: FC<{treeNode: DataTreeNode}> = ({treeNode}) => {
    const { children, type } = treeNode;
    if (type !== DataTreeNodeType.branch) {
        return null;
    }
    const childNodes: ReactNode = ((children !== undefined) &&
        Object.getOwnPropertyNames(children).length) ?
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

const DataTreeView: FC<{sx?: SxProps<Theme>}> = ({sx}) => {
    const context = useContext(DataExplorerContext);
    const { state, utils } = context || {};
    const { data } = state || {};
    
    // Memoize TreeView onNodeSelect handler based on context utils
    const onNodeSelect = useCallback(
        (event: SyntheticEvent, nodeId: string): void => {
            if (utils === undefined) {
                return;
            }
            event.preventDefault();
            utils.updateTreeNodeSelection(nodeId);
    }, [utils]);

    if (data !== undefined) {
        return (
            <Box sx={sx}>
                <TreeView
                    id={DataExplorerCapabilityTreeId}
                    defaultCollapseIcon={<ArrowDropUpIcon />}
                    defaultExpandIcon={<ArrowDropDownIcon />}
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

export {
    DataExplorerCapabilityTreeId
}