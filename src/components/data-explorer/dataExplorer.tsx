import { FC, useContext, useEffect } from 'react';
import { Container, Divider, Grid } from '@mui/material';
import DataExplorerProvider from '../../providers/data-explorer/dataExplorerProvider';
import DataExplorerContext from '../../contexts/data-explorer/dataExplorerContext';
import DataTreeView from './dataTreeView';
import DataValueFilter from './dataValueFilter';
import DataAppCardView from './dataAppCardView';

const DataExplorerContainer: FC = () => {
    const context = useContext(DataExplorerContext);
    const { state, utils } = context || {};
    const { fetchStatus } = state || {};
    useEffect(() => {
        if (utils === undefined) {
            return;
        }
        // If fetch is already initialized return
        if (fetchStatus !== undefined) {
            return;
        }
        (async () => {
            await utils.fetchData();
        })();
        
    }, [fetchStatus, utils]);
    return (
        <Container maxWidth='lg' sx={{
            height: '100%',
            minWidth: '640px',
            padding: '20px 0'
        }}>
            <Grid
                container
                direction="row"
                spacing={2}
                sx={{
                    height:'100%',
                    width:'100%',
                    margin:'0'
                }}
            >
                <Grid
                    container
                    item
                    xs={4}
                    direction="column"
                    justifyContent="center"
                    alignItems="stretch"
                    sx={{
                        bgcolor: 'lightgrey',
                        height: '100%',
                        minWidth: '326px',
                        padding: '16px',
                        paddingLeft: '16px !important',
                        paddingTop: '16px !important'
                    }}
                >
                    <Grid item xs sx={{overflowY: 'auto'}}>
                        <h4 style={{margin: '0 0 8px 0'}}>Navigation</h4>
                        <DataTreeView/>
                    </Grid>
                    <Grid item xs={0}>
                        <Divider sx={{margin: '8px 0'}}/>
                    </Grid>
                    <Grid item xs={1}>
                        <h4 style={{margin: '0 0 8px 0'}}>Filters</h4>
                        <DataValueFilter/>
                    </Grid>
                </Grid>
                <Grid item xs={0}>
                    <Divider orientation="vertical" variant="middle" flexItem />
                </Grid>
                <Grid container item xs sx={{
                    bgcolor: 'lightgrey',
                    height: '100%',
                    flex: '2',
                    paddingBottom: '16px !important',
                    paddingLeft: '16px !important',
                    paddingRight: '16px !important',
                    paddingTop: '16px !important'
                }}>
                    <DataAppCardView/>
                </Grid>
            </Grid>
        </Container>
    );
};

const DataExplorer: FC = () => {
    return (
         <DataExplorerProvider>
            <DataExplorerContainer/>
         </DataExplorerProvider>    
    );
}

export default DataExplorer;