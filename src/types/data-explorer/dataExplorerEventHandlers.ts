import { SyntheticEvent } from 'react';
import DataExplorerReadAccessors, { NormalizeFilterValue } from './dataExplorerAccessors';
import DataExplorerActionCreators from './dataExplorerActionCreators';

type CreateUpdateFilterValueParam = {
    normalizeFilterValue: NormalizeFilterValue,
    actionCreators?: DataExplorerActionCreators,
    readAccessors?: DataExplorerReadAccessors
}

type SliderChangeHandler = (event: Event, value: number | number[]) => void;
type TreeSelectHandler = (event: SyntheticEvent, nodeId: string) => void;

interface DataExplorerEventHandlers {
    createUpdateFilterValue(params: CreateUpdateFilterValueParam): SliderChangeHandler;
    createUpdateTreeNodeSelectHandler(actionCreators?: DataExplorerActionCreators): TreeSelectHandler;
}

export default DataExplorerEventHandlers;

export type {
    CreateUpdateFilterValueParam,
    SliderChangeHandler,
    TreeSelectHandler
}