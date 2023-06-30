import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import assert from 'assert';
import { render } from 'react-dom';
import { DataExplorerHookValue } from '../../hooks/data-explorer/dataExplorerHook';
import DataExplorerHookTestContainer, { DataExplorerHookValueAccessor, expectHookValue }
    from '../../hooks/data-explorer/dataExplorerHook.test';
import { createAsyncWaitCallback, setupMockFetchSuccess } from '../../test-utils/testUtils';
import DataExplorerContainer from './dataExplorerContainer';
import DataTreeView, { createTreeNodeKey, DataTreeViewId } from './dataTreeView';

const findAndClickTreeItemByNodeId = (dataHookValue: Required<DataExplorerHookValue>,
    treeNodeId: string): HTMLElement => {
    const { readAccessors, state } = dataHookValue;
    const treeNode = readAccessors.findDataTreeNode(state.data, treeNodeId);
    if (treeNode === undefined) {
        throw Error(`TreeNode with node id '${treeNodeId}' not found.`);
    }
    expect(treeNode).toBeDefined();
    const treeItemKey = createTreeNodeKey(treeNode);
    const treeItemRoot = screen.getByTestId(treeItemKey);
    const treeNodeContent = screen.getByText(treeNode.name);
    userEvent.click(treeNodeContent);
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
        expect(screen.getByTestId(DataTreeViewId)).toBeInTheDocument();
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
        const topLevelChildNodes = await screen.findAllByRole('treeitem');
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
        findAndClickTreeItemByNodeId(hookValue, '46');
        findAndClickTreeItemByNodeId(hookValue, '61');
        const treeItemL03 = findAndClickTreeItemByNodeId(hookValue, '65');
        expect(treeItemL03).toHaveAttribute('aria-selected', 'true');
    });
});