import { SyntheticEvent } from 'react';
import DataExplorerActionCreators from '../../types/data-explorer/dataExplorerActionCreators';
import DataExplorerEventHandlers, { CreateUpdateFilterValueParam, SliderChangeHandler, TreeSelectHandler } from '../../types/data-explorer/dataExplorerEventHandlers';

class DataExplorerEventHandlersDefault implements DataExplorerEventHandlers {
    
    createUpdateTreeNodeSelectHandler(actionCreators?: DataExplorerActionCreators): TreeSelectHandler {
        return (event: SyntheticEvent, nodeId: string): void => {
            if (actionCreators === undefined) {
                return;
            }
            event.preventDefault();
            actionCreators.updateTreeNodeSelection(nodeId);
        };
    }

    createUpdateFilterValue(params: CreateUpdateFilterValueParam): SliderChangeHandler {
        const {normalizeFilterValue, actionCreators, readAccessors } = params || {};
        return (_event: Event, value: number | number[]): void => {
            if ((readAccessors === undefined) || (actionCreators === undefined)) {
                return;
            }
            const newValue = normalizeFilterValue(value);
            actionCreators.updateValueFilter(newValue);
        };
    }
}

export default DataExplorerEventHandlersDefault;