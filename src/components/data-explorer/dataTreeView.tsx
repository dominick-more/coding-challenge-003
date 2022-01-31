import { FC, ReactNode, Fragment, useMemo } from 'react';
import { TreeItem, treeItemClasses, TreeItemProps, TreeView } from '@mui/lab';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import DataTreeNode, { DataTreeNodeType, DataTreeRootNodeId } from '../../types/data-explorer/dataTreeNode';
import { Box, styled, SxProps, Theme } from '@mui/material';
import useDataExplorerHook from '../../hooks/data-explorer/dataExplorerHook';

const DataTreeViewId = 'data-explorer-capability-tree';

const createTreeNodeKey = (treeNode: DataTreeNode): string =>
    `${DataTreeViewId}-${treeNode.nodeId}`;

const StyledTreeItem = styled((props: TreeItemProps) => (
    <TreeItem {...props} />
  ))(({ theme }) => ({
    [`& .${treeItemClasses.label}`]: {
      fontSize: '0.8rem !important'
    }
  }));

const DataTreeItem: FC<{treeNode: DataTreeNode}> = ({treeNode, children}) => {
    const { nodeId, name } = treeNode;
    const uniqueKey = createTreeNodeKey(treeNode);
    return (
        <StyledTreeItem nodeId={nodeId} label={name} data-testid={uniqueKey}>
            {children}
        </StyledTreeItem>
    );
};

const renderTreeNodeRecursive: FC<{treeNode?: DataTreeNode}> = ({treeNode}) => {
    const { children, type } = treeNode || {};
    if ((treeNode === undefined) || (type !== DataTreeNodeType.branch)) {
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
    const { state, actionCreators, eventHandlers } = useDataExplorerHook();
    const { data } = state || {};
    
    // Memoize TreeView onNodeSelect handler based on context utils
    const onNodeSelect = useMemo(() => {
        if (eventHandlers === undefined) {
            return undefined;
        }
        return eventHandlers.createUpdateTreeNodeSelectHandler(actionCreators);
    }, [actionCreators, eventHandlers]);

    return (
        <Box sx={sx}>
            <TreeView
                id={DataTreeViewId}
                data-testid={DataTreeViewId}
                defaultCollapseIcon={<ArrowDropUpIcon />}
                defaultExpandIcon={<ArrowDropDownIcon />}
                onNodeSelect={onNodeSelect}
            >
                {renderTreeNodeRecursive({treeNode: data})}
            </TreeView>
        </Box>
    );
};

export default DataTreeView;

export {
    createTreeNodeKey,
    DataTreeViewId
}