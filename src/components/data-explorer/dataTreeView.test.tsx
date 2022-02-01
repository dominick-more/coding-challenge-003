import { act, findAllByRole,getByTestId, getByText } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import assert from 'assert';
import { render } from 'react-dom';
import { DataExplorerHookValue } from '../../hooks/data-explorer/dataExplorerHook';
import DataExplorerHookTestContainer, { DataExplorerHookValueAccessor, expectHookValue }
    from '../../hooks/data-explorer/dataExplorerHook.test';
import { createAsyncWaitCallback, setupMockFetchSuccess } from '../../test-utils/testUtils';
import DataExplorerContainer from './dataExplorerContainer';
import DataTreeView, { createTreeNodeKey, DataTreeViewId } from './dataTreeView';

const findAndClickTreeItemByNodeId = (
    dataHookValue: Required<DataExplorerHookValue>,
    container: HTMLElement, treeNodeId: string): HTMLElement => {
    const { readAccessors, state } = dataHookValue;
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
        const hookValueAccessor = new DataExplorerHookValueAccessor();
        await act( async () => {
            await new Promise<void>((resolve) => {
                const callback = createAsyncWaitCallback(resolve);
                render(<DataExplorerContainer>
                    <DataExplorerHookTestContainer setValue={hookValueAccessor.setValue}>
                        <DataTreeView/>
                    </DataExplorerHookTestContainer>
                </DataExplorerContainer>, container, callback);
            });
        });
        const hookValue = expectHookValue(hookValueAccessor.getValue());
        const treeItemL01 = findAndClickTreeItemByNodeId(hookValue, container, '46');
        const treeItemL02 = findAndClickTreeItemByNodeId(hookValue, treeItemL01, '61');
        const treeItemL03 = findAndClickTreeItemByNodeId(hookValue, treeItemL02, '65');
        expect(treeItemL03).toHaveAttribute('aria-selected', 'true');
    });
});