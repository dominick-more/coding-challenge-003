import { act, findAllByRole,getByTestId, getByText } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import assert from 'assert';
import { render } from 'react-dom';
import { DataExplorerHookResult } from '../../hooks/data-explorer/dataExplorerHook';
import DataExplorerHookResultTestContainer, { DataExplorerHookResultAccessor, expectHookResult } from '../../hooks/data-explorer/dataExplorerHook.test';
import { createAsyncWaitCallback, setupMockFetchSuccess } from '../../test-utils/testUtils';
import DataExplorerContainer from './dataExplorerContainer';
import DataTreeView, { createTreeNodeKey, DataTreeViewId } from './dataTreeView';

const findAndClickTreeItemByNodeId = async (
    dataHookResult: Required<DataExplorerHookResult>,
    container: HTMLElement, treeNodeId: string): Promise<HTMLElement> => {
    const { readAccessors, state } = dataHookResult;
    const treeNode = readAccessors.findDataTreeNode(state.data, treeNodeId);
    if (treeNode === undefined) {
        throw Error(`TreeNode with node id '${treeNodeId}' not found.`);
    }
    expect(treeNode).toBeDefined();
    const treeItemKey = createTreeNodeKey(treeNode);
    const treeItemRoot = getByTestId(container, treeItemKey);
    const treeNodeContent = getByText(treeItemRoot, treeNode.name);
    act(() => {
        userEvent.click(treeNodeContent);
    });
    return treeItemRoot;
};

describe('DataTreeView Tests', () => {
    let container: HTMLDivElement | null;

    beforeEach(() => {
        container = document.createElement('div');
        document.body.appendChild(container);
        setupMockFetchSuccess();
    });
  
    afterEach(() => {
        if (container !== null) {
            document.body.removeChild(container);
            container = null;
        }
    });

    it('DataTreeView is rendered', async () => {
        assert(container, 'Container may not be null.');
        render(<DataTreeView/>, container);
        expect(getByTestId(container, DataTreeViewId)).toBeInTheDocument();
    });

    it('DataTreeView is rendered with top level child nodes', async () => {
        assert(container, 'Container may not be null.');
        await act( async () => {
            await new Promise<void>((resolve) => {
                const callback = createAsyncWaitCallback(resolve);
                render(<DataExplorerContainer>
                    <DataTreeView/>
                </DataExplorerContainer>, container, callback);
            });
        });
        const topLevelChildNodes = await findAllByRole(container, 'treeitem');
        expect(topLevelChildNodes).toHaveLength(3);
    });

    it('DataTreeView items rendered when selected.', async () => {
        assert(container, 'Container may not be null.');
        const hookResultAccessor = new DataExplorerHookResultAccessor();
        await act( async () => {
            await new Promise<void>((resolve) => {
                const callback = createAsyncWaitCallback(resolve);
                render(<DataExplorerContainer>
                    <DataExplorerHookResultTestContainer setValue={hookResultAccessor.setValue}>
                        <DataTreeView/>
                    </DataExplorerHookResultTestContainer>
                </DataExplorerContainer>, container, callback);
            });
        });
        const hookResult = expectHookResult(hookResultAccessor.getValue());
        const treeItemL01 = await findAndClickTreeItemByNodeId(hookResult, container, '46');
        const treeItemL02 = await findAndClickTreeItemByNodeId(hookResult, treeItemL01, '61');
        const treeItemL03 = await findAndClickTreeItemByNodeId(hookResult, treeItemL02, '65');
        expect(treeItemL03).toHaveAttribute('aria-selected', 'true');
    });
});