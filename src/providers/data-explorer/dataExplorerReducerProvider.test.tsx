import { act } from '@testing-library/react'
import assert from 'assert';
import { FC, Fragment, useContext } from 'react';
import { render } from 'react-dom';
import ReducerContext, { DataExplorerReducerContextValue } from '../../contexts/data-explorer/dataExplorerReducerContext';
import { createRootTreeNode, DataExplorerActionType, defaultStateInitializer } from '../../reducers/data-explorer/dataExplorerReducer';
import DataExplorerState, { FetchStatus } from '../../types/data-explorer/dataExplorerState';
import DataExplorerReducerProvider from './dataExplorerReducerProvider';

const expectContextValue = (value: DataExplorerReducerContextValue | undefined):
    Required<DataExplorerReducerContextValue> | never => {
    expect(value).toBeDefined();
    if (value === undefined) {
        throw new Error('context value is undefined.');
    }
    const { dispatch, state } = value;
    expect(dispatch).toBeDefined();
    if (dispatch === undefined) {
        throw new Error('dispatch is undefined.');
    }
    expect(state).toBeDefined();
    if (state === undefined) {
        throw new Error('state is undefined.');
    }
    return value;
};

type SetReducerContextValue = (value: DataExplorerReducerContextValue | undefined) => void;

const DataExplorerReducerTestContainer: FC<{setValue: SetReducerContextValue}> = ({setValue, children}) => {
    const value = useContext(ReducerContext);
    setValue(value);
    return (<Fragment key='data-explorer-reducer-test-container'>{children})</Fragment>);
};

class DataExplorerReducerContextAccessor {
    private value: DataExplorerReducerContextValue | undefined = undefined;

    constructor() {
        this.getValue = this.getValue.bind(this);
        this.setValue = this.setValue.bind(this);
    }

    getValue(): DataExplorerReducerContextValue | undefined {
        return this.value;
    }

    setValue(value: DataExplorerReducerContextValue | undefined): void {
        this.value = value;
    }
}

describe('DataExplorerReducerProvider Tests', () => {

    let container: HTMLDivElement | null;

    beforeEach(() => {
        container = document.createElement('div');
        document.body.appendChild(container);
      });

    afterEach(() => {
        if (container !== null) {
            document.body.removeChild(container);
            container = null;
        }
    });

    it('DataExplorerReducerProvider sets context value', () => {
        assert(container, 'Container may not be null.');
        const contextAccessor = new DataExplorerReducerContextAccessor();
        act(() => {
            render(<DataExplorerReducerProvider>
                <DataExplorerReducerTestContainer
                    setValue={contextAccessor.setValue}
                />
            </DataExplorerReducerProvider>, container);
        });
        expectContextValue(contextAccessor.getValue());
    });

    it('DataExplorerReducerProvider uses default initial state', () => {
        assert(container, 'Container may not be null.');
        const contextAccessor = new DataExplorerReducerContextAccessor();
        act(() => {
            render(<DataExplorerReducerProvider>
                <DataExplorerReducerTestContainer
                    setValue={contextAccessor.setValue}
                />
            </DataExplorerReducerProvider>, container);
        });
        const { state } = expectContextValue(contextAccessor.getValue());
        expect(state).toEqual(defaultStateInitializer());
    });

    it('DataExplorerReducerProvider uses provided initial state', () => {
        assert(container, 'Container may not be null.');
        const contextAccessor = new DataExplorerReducerContextAccessor();
        const initialState: DataExplorerState = {
            data: createRootTreeNode(),
            fetchStatus: FetchStatus.Done
        };
        act(() => {
            render(<DataExplorerReducerProvider initialState={initialState}>
                <DataExplorerReducerTestContainer
                    setValue={contextAccessor.setValue}
                />
            </DataExplorerReducerProvider>, container);
        });
        const { state } = expectContextValue(contextAccessor.getValue());
        expect(state).toEqual(initialState);
    });

    it('DataExplorerReducer dispatch updates data and fetch status to done', () => {
        assert(container, 'Container may not be null.');
        const contextAccessor = new DataExplorerReducerContextAccessor();
        act(() => {
            render(<DataExplorerReducerProvider>
                <DataExplorerReducerTestContainer
                    setValue={contextAccessor.setValue}
                />
            </DataExplorerReducerProvider>, container);
        });
        const { dispatch } = expectContextValue(contextAccessor.getValue());
        const payload = createRootTreeNode();
        payload.nodeId = '<test_id>';
        act(() => {
            const type = DataExplorerActionType.UpdateData;
            dispatch({type, payload});
        });
        const { state: newState } = expectContextValue(contextAccessor.getValue());
        expect(newState.data).toEqual(payload);
        expect(newState.error).toBeUndefined();
        expect(newState.fetchStatus).toEqual(FetchStatus.Done);
    });

    it('DataExplorerReducer dispatch updates error and fetch status to done', () => {
        assert(container, 'Container may not be null.');
        const contextAccessor = new DataExplorerReducerContextAccessor();
        act(() => {
            render(<DataExplorerReducerProvider>
                <DataExplorerReducerTestContainer
                    setValue={contextAccessor.setValue}
                />
            </DataExplorerReducerProvider>, container);
        });
        const { dispatch, state } = expectContextValue(contextAccessor.getValue());
        const payload = new Error('Test Error.');
        act(() => {
            const type = DataExplorerActionType.UpdateData;
            dispatch({type, payload});
        });
        const { state: newState } = expectContextValue(contextAccessor.getValue());
        expect(newState.data).toEqual(state?.data);
        expect(newState.error).toEqual(payload);
        expect(newState.fetchStatus).toEqual(FetchStatus.Done);
    });

    it('DataExplorerReducer dispatch updates fetch status', () => {
        assert(container, 'Container may not be null.');
        const contextAccessor = new DataExplorerReducerContextAccessor();
        act(() => {
            render(<DataExplorerReducerProvider>
                <DataExplorerReducerTestContainer
                    setValue={contextAccessor.setValue}
                />
            </DataExplorerReducerProvider>, container);
        });
        const { dispatch } = expectContextValue(contextAccessor.getValue());
        const payload = FetchStatus.InProgress;
        act(() => {
            const type = DataExplorerActionType.UpdateFetchStatus;
            dispatch({type, payload});
        });
        const { state: newState } = expectContextValue(contextAccessor.getValue());
        expect(newState.fetchStatus).toEqual(payload);
    });

    it('DataExplorerReducer dispatch updates tree node selection', () => {
        assert(container, 'Container may not be null.');
        const contextAccessor = new DataExplorerReducerContextAccessor();
        act(() => {
            render(<DataExplorerReducerProvider>
                <DataExplorerReducerTestContainer
                    setValue={contextAccessor.setValue}
                />
            </DataExplorerReducerProvider>, container);
        });
        const { dispatch } = expectContextValue(contextAccessor.getValue());
        const payload = '-1';
        act(() => {
            const type = DataExplorerActionType.UpdateTreeNodeSelection;
            dispatch({type, payload});
        });
        const { state: newState } = expectContextValue(contextAccessor.getValue());
        expect(newState.treeNodeSelection).toEqual(payload);
    });

    it('DataExplorerReducer dispatch updates value filter', () => {
        assert(container, 'Container may not be null.');
        const contextAccessor = new DataExplorerReducerContextAccessor();
        act(() => {
            render(<DataExplorerReducerProvider>
                <DataExplorerReducerTestContainer
                    setValue={contextAccessor.setValue}
                />
            </DataExplorerReducerProvider>, container);
        });
        const { dispatch } = expectContextValue(contextAccessor.getValue());
        const payload: [number, number] = [10, 100];
        act(() => {
            const type = DataExplorerActionType.UpdateValueFilter;
            dispatch({type, payload});
        });
        const { state: newState } = expectContextValue(contextAccessor.getValue());
        expect(newState.valueFilter).toEqual(payload);
    });

    it.skip('DataExplorerReducer dispatch throws invalid action type error', () => {
        assert(container, 'Container may not be null.');
        const contextAccessor = new DataExplorerReducerContextAccessor();
        act(() => {
            render(<DataExplorerReducerProvider>
                <DataExplorerReducerTestContainer
                    setValue={contextAccessor.setValue}
                />
            </DataExplorerReducerProvider>, container);
        });
        const { dispatch } = expectContextValue(contextAccessor.getValue());
        act(() => {
            expect(() => {
                // @ts-ignore: Unreachable code error
                dispatch({type: 'foo', payload: 'bar'});
            }).toThrow();
        });
    });
});

export {
    expectContextValue,
    DataExplorerReducerTestContainer,
    DataExplorerReducerContextAccessor
}

export type {
    SetReducerContextValue
}