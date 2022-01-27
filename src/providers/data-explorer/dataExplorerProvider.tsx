import React, { PropsWithChildren, useMemo, useReducer } from 'react';
import Context from '../../contexts/data-explorer/dataExplorerContext';
import DataExplorerUtilitiesImpl from '../../contexts/data-explorer/dataExplorerUtilitiesImpl';
import dataExplorerReducer, { createDataExplorerInitState } from '../../reducers/data-explorer/dataExplorerReducer';

const DataExplorerProvider: React.FC<PropsWithChildren<Record<string, any>>> = (props): React.ReactElement => {
    const { children } = props;
    const [state, dispatch] = useReducer(dataExplorerReducer, undefined, createDataExplorerInitState);
    const utils = useMemo(() => {
        return new DataExplorerUtilitiesImpl(dispatch);
    }, [dispatch]);
    const value =  {
        state,
        utils
    }
    return <Context.Provider value={value}>{children}</Context.Provider>;
};

export default DataExplorerProvider;