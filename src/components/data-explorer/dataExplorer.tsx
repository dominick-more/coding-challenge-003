import { FC, useContext, useEffect } from 'react';
import { Box, Divider, Grid, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import DataExplorerProvider from '../../providers/data-explorer/dataExplorerProvider';
import DataExplorerContext from '../../contexts/data-explorer/dataExplorerContext';
import DataTreeView from './dataTreeView';
import DataValueFilter from './dataValueFilter';
import DataAppCardView from './dataAppCardView';
import { ThemeProvider } from '@mui/material/styles';
import dataExplorerTheme from '../../themes/data-explorer/dataExplorerTheme';
   
const DataExplorerId = 'data-explorer';

const DataExplorerLeftPanel: FC = () => {
    const theme = useTheme();
    return (
        <Grid
            container
            item
            xs={4}
            direction='column'
            justifyContent='center'
            alignItems='stretch'
            sx={{
                height: 'auto',
                minWidth: '274px',
                paddingBottom: `${theme.custom?.panel?.outer?.paddingBottom}`,
                paddingLeft: `${theme.custom?.panel?.outer?.paddingLeft}`,
                paddingRight: `8px !important`,
                paddingTop: `${theme.custom?.panel?.outer?.paddingTop}`,
                backgroundColor: `${theme.custom?.panel?.outer?.backroundColor}`
            }}>
            <Grid
                container
                item
                xs
                direction='column'
                justifyContent='flex-start'
                alignItems='stretch'
                sx={{
                    height: '100%'
                }}>
                <Grid
                    item
                    xs={0}>
                    <Typography
                        sx={{
                            fontSize: '0.8em',
                            fontWeight: 'bold',
                            lineHeight: 2
                        }}
                        gutterBottom>
                        Navigation
                    </Typography>
                </Grid>
                <Grid
                    item
                    xs
                    sx={{
                        borderRadius: `${theme.custom?.panel?.inner?.borderRadius}`,
                        backgroundColor: `${theme.custom?.panel?.inner?.backroundColor}`,
                        paddingTop: `12px`,
                        overflow: 'auto',
                        scrollbarWidth: 'thin'
                    }}>
                    <DataTreeView
                        sx={{
                            height: 'fit-content',
                            maxHeight: '100%'
                        }}/>
                </Grid>        
            </Grid>
            <Grid item xs={0}>
                <Divider sx={{margin: '12px 0'}}/>
            </Grid>
            <Grid item xs={1}>
                <Grid
                    container
                    item
                    xs
                    direction='column'
                    justifyContent='flex-start'
                    alignItems='stretch'
                    sx={{
                        height: '100%'
                    }}>
                    <Grid
                        item
                        xs={0}>
                        <Typography
                            sx={{
                                fontSize: '0.8em',
                                fontWeight: 'bold',
                                lineHeight: 2
                            }}>
                            Filters
                        </Typography>
                    </Grid>
                    <Grid item xs={1}>
                        <DataValueFilter/>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};

const DataExplorerRightPanel: FC = () => {
    const theme = useTheme();
    return (
        <Grid container
            item
            xs
            direction='column'
            justifyContent='flex-start'
            alignItems='stretch'  
            sx={{
                height: 'auto',
                flex: '2',
                paddingBottom: `${theme.custom?.panel?.outer?.paddingBottom}`,
                paddingLeft: `8px !important`,
                paddingRight: `${theme.custom?.panel?.outer?.paddingRight}`,
                paddingTop: `${theme.custom?.panel?.outer?.paddingTop}`,
                backgroundColor: `${theme.custom?.panel?.outer?.backroundColor}`
            }}>
            <Grid item xs={0}>
                <Box sx={{height: '1.85rem'}}>&nbsp;</Box>
            </Grid>
            <Grid item xs sx={{overflow: 'auto', scrollbarWidth: 'thin'}}>
                <DataAppCardView/>
            </Grid>
        </Grid>
    );
};

const DataExplorerContainer: FC = () => {
    const context = useContext(DataExplorerContext);
    const theme = useTheme();
    const { state, utils } = context || {};
    const { fetchStatus } = state || {};

    // Fetching server data in the top level data explorer render component
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
        <Grid
            id={DataExplorerId}
            container
            direction='row'
            spacing={1}
            sx={{
                height:'100%',
                width:'100%',
                minHeight: '480px',
                minWidth: '640px',
                margin:'0',
                padding: '0',
                backgroundColor: `${theme.custom?.panel?.outer?.backroundColor}`
            }}>
            <DataExplorerLeftPanel/>
            <DataExplorerRightPanel/>
        </Grid>
    );
};

const DataExplorer: FC = () => {
    return (
        <ThemeProvider theme={dataExplorerTheme}>
            <DataExplorerProvider>
                <DataExplorerContainer/>
            </DataExplorerProvider>
        </ThemeProvider>    
    );
}

export default DataExplorer;

export {
    DataExplorerId
}