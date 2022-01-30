import { FC, PropsWithChildren } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import dataExplorerTheme from '../../themes/data-explorer/dataExplorerTheme';
import DataExplorerReducerProvider from '../../providers/data-explorer/dataExplorerReducerProvider';
import DataExplorerState from '../../types/data-explorer/dataExplorerState';

type DataExplorerContainerProps = PropsWithChildren<{
    initialState?: DataExplorerState;
}>

const DataExplorerContainer: FC<DataExplorerContainerProps> = ({initialState, children}) => {
    return (
        <ThemeProvider theme={dataExplorerTheme}>
            <DataExplorerReducerProvider initialState={initialState}>
                {children}
            </DataExplorerReducerProvider>
        </ThemeProvider>    
    );
};

export default DataExplorerContainer;