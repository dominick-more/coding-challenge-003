import { act } from '@testing-library/react'
import assert from 'assert';
import { FC, Fragment } from 'react';
import { render } from 'react-dom';
import { defaultStateInitializer } from '../../reducers/data-explorer/dataExplorerReducer';
import { FetchStatus } from '../../types/data-explorer/dataExplorerState';
import DataExplorerReducerProvider from '../../providers/data-explorer/dataExplorerReducerProvider';
import useDataExplorerHook, { DataExplorerHookResult } from './dataExplorerHook';
import { copyRemoteTestData, createAsyncWaitCallback, setupMockFetchFail, setupMockFetchSuccess } from '../../test-utils/testUtils';

const expectHookResult = (value: DataExplorerHookResult | undefined):
    Required<DataExplorerHookResult> | never => {
    expect(value).toBeDefined();
    if (value === undefined) {
        throw new Error('hook result is undefined.');
    }
    const { actionCreators, eventHandlers, readAccessors, state } = value;
    expect(actionCreators).toBeDefined();
    if (actionCreators === undefined) {
        throw new Error('actionCreators is undefined.');
    }
    expect(eventHandlers).toBeDefined();
    if (eventHandlers === undefined) {
        throw new Error('eventHandlers is undefined.');
    }
    expect(readAccessors).toBeDefined();
    if (readAccessors === undefined) {
        throw new Error('readAccessors is undefined.');
    }
    expect(state).toBeDefined();
    if (state === undefined) {
        throw new Error('state is undefined.');
    }
    return { actionCreators, eventHandlers, readAccessors, state };
};

type SetHookValueResult = (value: DataExplorerHookResult | undefined) => void;

const DataExplorerHookResultTestContainer: FC<{setValue: SetHookValueResult}> = ({setValue, children}) => {
    const value = useDataExplorerHook();
    setValue(value);
    return (<Fragment key='data-explorer-reducer-hook-result-container'>{children})</Fragment>);
};

class DataExplorerHookResultAccessor {
    private value: DataExplorerHookResult | undefined = undefined;

    constructor() {
        this.getValue = this.getValue.bind(this);
        this.setValue = this.setValue.bind(this);
    }

    getValue(): DataExplorerHookResult | undefined {
        return this.value;
    }

    setValue(value: DataExplorerHookResult | undefined): void {
        this.value = value;
    }
}

describe('DataExplorerHook Tests', () => {

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

    it('DataExplorerHook returns result', async () => {
        assert(container, 'Container may not be null.');
        const hookResultAccessor = new DataExplorerHookResultAccessor();
        await act(async () => {
            await new Promise<void>((resolve) => {
                const callback = createAsyncWaitCallback(resolve);
                render(<DataExplorerReducerProvider>
                    <DataExplorerHookResultTestContainer
                        setValue={hookResultAccessor.setValue}
                    />
                </DataExplorerReducerProvider>, container, callback);
            });
        });
        expectHookResult(hookResultAccessor.getValue());
    });

    it('DataExplorerHook automatically fetches data', async () => {
        assert(container, 'Container may not be null.');
        const hookResultAccessor = new DataExplorerHookResultAccessor();
        await act( async () => {
            await new Promise<void>((resolve) => {
                const callback = createAsyncWaitCallback(resolve);
                render(<DataExplorerReducerProvider>
                    <DataExplorerHookResultTestContainer
                        setValue={hookResultAccessor.setValue}
                    />
                </DataExplorerReducerProvider>, container, callback);    
            });
        });
        const { readAccessors, state } = expectHookResult(hookResultAccessor.getValue());
        expect(state.data).toEqual(readAccessors.transformTableToDataTree(copyRemoteTestData()));
        expect(state.error).toBeUndefined();
        expect(state.fetchStatus).toEqual(FetchStatus.Done);
    });

    it('DataExplorerActionCreators re-fetches data', async () => {
        assert(container, 'Container may not be null.');
        const hookResultAccessor = new DataExplorerHookResultAccessor();
        const initialState = defaultStateInitializer();
        initialState.fetchStatus = FetchStatus.Done;
        await act( async () => {
            await new Promise<void>((resolve) => {
                const callback = createAsyncWaitCallback(resolve, false);
                render(<DataExplorerReducerProvider initialState={initialState}>
                    <DataExplorerHookResultTestContainer
                        setValue={hookResultAccessor.setValue}
                    />
                </DataExplorerReducerProvider>, container, callback);    
            });
        });
        const { actionCreators, state } = expectHookResult(hookResultAccessor.getValue());
        expect(state.data).toEqual(initialState.data);
        expect(state.fetchStatus).toEqual(initialState.fetchStatus);
        await act(async () => {
            await actionCreators.fetchData();
        });
        const { state: newState, readAccessors } =
            expectHookResult(hookResultAccessor.getValue());
        expect(newState.data).toEqual(readAccessors.transformTableToDataTree(copyRemoteTestData()));
        expect(newState.error).toBeUndefined();
        expect(newState.fetchStatus).toEqual(FetchStatus.Done);
    });

    it('DataExplorerActionCreators sets fetch error', async () => {
        assert(container, 'Container may not be null.');
        const hookResultAccessor = new DataExplorerHookResultAccessor();
        setupMockFetchFail();
        const initialState = defaultStateInitializer();
        await act( async () => {
            await new Promise<void>((resolve) => {
                const callback = createAsyncWaitCallback(resolve);
                render(<DataExplorerReducerProvider>
                    <DataExplorerHookResultTestContainer
                        setValue={hookResultAccessor.setValue}
                    />
                </DataExplorerReducerProvider>, container, callback);    
            });
        });
        const { state } = expectHookResult(hookResultAccessor.getValue());
        expect(state.data).toEqual(initialState.data);
        expect(state.fetchStatus).toEqual(FetchStatus.Done);
        expect(state.error).toBeInstanceOf(Error);
    });

    it('DataExplorerActionCreators updates tree node selection', async () => {
        assert(container, 'Container may not be null.');
        const hookResultAccessor = new DataExplorerHookResultAccessor();
        const initialState = defaultStateInitializer();
        initialState.fetchStatus = FetchStatus.Done;
        await act( async () => {
            await new Promise<void>((resolve) => {
                const callback = createAsyncWaitCallback(resolve, false);
                render(<DataExplorerReducerProvider initialState={initialState}>
                    <DataExplorerHookResultTestContainer
                        setValue={hookResultAccessor.setValue}
                    />
                </DataExplorerReducerProvider>, container, callback);    
            });
        });
        const { actionCreators, state } = expectHookResult(hookResultAccessor.getValue());
        expect(state.treeNodeSelection).toBeUndefined();
        const newNodeId = '-1';
        act(() => {
            actionCreators.updateTreeNodeSelection(newNodeId);
        });
        const { state: newState } = expectHookResult(hookResultAccessor.getValue());
        expect(newState.treeNodeSelection).toEqual(newNodeId);
    });

    it('DataExplorerActionCreators updates value filter', async () => {
        assert(container, 'Container may not be null.');
        const hookResultAccessor = new DataExplorerHookResultAccessor();
        const initialState = defaultStateInitializer();
        initialState.fetchStatus = FetchStatus.Done;
        await act( async () => {
            await new Promise<void>((resolve) => {
                const callback = createAsyncWaitCallback(resolve, false);
                render(<DataExplorerReducerProvider initialState={initialState}>
                    <DataExplorerHookResultTestContainer
                        setValue={hookResultAccessor.setValue}
                    />
                </DataExplorerReducerProvider>, container, callback);    
            });
        });
        const { actionCreators, state } = expectHookResult(hookResultAccessor.getValue());
        expect(state.valueFilter).toBeUndefined();
        const newValueFilter: [number, number] = [0, 1];
        act(() => {
            actionCreators.updateValueFilter(newValueFilter);
        });
        const { state: newState, readAccessors } =
            expectHookResult(hookResultAccessor.getValue());
        expect(newState.valueFilter).toEqual(newValueFilter);
    });

    it('DataExplorerReadAccessors calculates tree min-max values', async () => {
        assert(container, 'Container may not be null.');
        const hookResultAccessor = new DataExplorerHookResultAccessor();
        const initialState = defaultStateInitializer();
        await act( async () => {
            await new Promise<void>((resolve) => {
                const callback = createAsyncWaitCallback(resolve);
                render(<DataExplorerReducerProvider initialState={initialState}>
                    <DataExplorerHookResultTestContainer
                        setValue={hookResultAccessor.setValue}
                    />
                </DataExplorerReducerProvider>, container, callback);    
            });
        });
        const { readAccessors, state } = expectHookResult(hookResultAccessor.getValue());
        const maxFilterValue = readAccessors.getMinMaxFilterValue(state.data);
        expect(maxFilterValue).toEqual([1251, 89818]);
    });

    it('DataExplorerReadAccessors finds selected tree node', async () => {
        assert(container, 'Container may not be null.');
        const hookResultAccessor = new DataExplorerHookResultAccessor();
        const initialState = defaultStateInitializer();
        await act( async () => {
            await new Promise<void>((resolve) => {
                const callback = createAsyncWaitCallback(resolve);
                render(<DataExplorerReducerProvider initialState={initialState}>
                    <DataExplorerHookResultTestContainer
                        setValue={hookResultAccessor.setValue}
                    />
                </DataExplorerReducerProvider>, container, callback);    
            });
        });
        const { actionCreators, state } = expectHookResult(hookResultAccessor.getValue());
        expect(state.valueFilter).toBeUndefined();
        const newNodeId = '65';
        act(() => {
            actionCreators.updateTreeNodeSelection(newNodeId);
        });
        const { readAccessors, state: newState } = expectHookResult(hookResultAccessor.getValue());
        expect(newState.treeNodeSelection).toEqual(newNodeId);
        const selectedTreeNode = readAccessors.findDataTreeNode(newState.data, newState.treeNodeSelection);
        expect(selectedTreeNode).toBeDefined();
        expect(selectedTreeNode?.nodeId).toEqual(newNodeId);
    });

    it('DataExplorerReadAccessors returns selected tree node unfiltered leaves', async () => {
        assert(container, 'Container may not be null.');
        const hookResultAccessor = new DataExplorerHookResultAccessor();
        const initialState = defaultStateInitializer();
        await act( async () => {
            await new Promise<void>((resolve) => {
                const callback = createAsyncWaitCallback(resolve);
                render(<DataExplorerReducerProvider initialState={initialState}>
                    <DataExplorerHookResultTestContainer
                        setValue={hookResultAccessor.setValue}
                    />
                </DataExplorerReducerProvider>, container, callback);    
            });
        });
        const { actionCreators, state } = expectHookResult(hookResultAccessor.getValue());
        expect(state.valueFilter).toBeUndefined();
        const newNodeId = '65';
        act(() => {
            actionCreators.updateTreeNodeSelection(newNodeId);
        });
        const { readAccessors, state: newState } = expectHookResult(hookResultAccessor.getValue());
        expect(newState.treeNodeSelection).toEqual(newNodeId);
        expect(newState.valueFilter).toBeUndefined();
        const filteredLeaves = readAccessors.filterDataTreeLeaves(newState.data, newState.treeNodeSelection, newState.valueFilter);
        expect(filteredLeaves).toBeDefined();
        if (filteredLeaves === undefined) {
            return;
        }
        const expectedAppIds = [
            'app-21',
            'app-24',
            'app-27',
            'app-36',
            'app-68',
            'app-7',
            'app-70'
        ];
        const filteredAppIds = filteredLeaves.map(leave => leave.id);
        expect(expectedAppIds.sort()).toEqual(filteredAppIds.sort());
    });

    it('DataExplorerReadAccessors returns selected tree node filtered leaves', async () => {
        assert(container, 'Container may not be null.');
        const hookResultAccessor = new DataExplorerHookResultAccessor();
        const initialState = defaultStateInitializer();
        await act( async () => {
            await new Promise<void>((resolve) => {
                const callback = createAsyncWaitCallback(resolve);
                render(<DataExplorerReducerProvider initialState={initialState}>
                    <DataExplorerHookResultTestContainer
                        setValue={hookResultAccessor.setValue}
                    />
                </DataExplorerReducerProvider>, container, callback);    
            });
        });
        const { actionCreators, state } = expectHookResult(hookResultAccessor.getValue());
        expect(state.valueFilter).toBeUndefined();
        const newNodeId = '65';
        const newFilterValue: [number, number] = [39946, 82017];
        act(() => {
            actionCreators.updateTreeNodeSelection(newNodeId);
            actionCreators.updateValueFilter(newFilterValue);
        });
        const { readAccessors, state: newState } = expectHookResult(hookResultAccessor.getValue());
        expect(newState.treeNodeSelection).toEqual(newNodeId);
        expect(newState.valueFilter).toEqual(newFilterValue);
        const filteredLeaves = readAccessors.filterDataTreeLeaves(newState.data, newState.treeNodeSelection, newState.valueFilter);
        expect(filteredLeaves).toBeDefined();
        if (filteredLeaves === undefined) {
            return;
        }
        const expectedAppIds = [
            'app-24',
            'app-27',
            'app-68',
            'app-7'
        ];
        const filteredAppIds = filteredLeaves.map(leave => leave.id);
        expect(expectedAppIds.sort()).toEqual(filteredAppIds.sort());
    });
});

export default DataExplorerHookResultTestContainer;

export {
    expectHookResult,
    DataExplorerHookResultAccessor
}
 
export type {
    SetHookValueResult
}