import { FC } from 'react';
import { Box, Divider, Grid, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import DataValueFilter from './dataValueFilter';
import DataAppCardView from './dataAppCardView';
import DataTreeView from './dataTreeView';
  
const DataExplorerPanelId = 'data-explorer-panel';

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

type DataExplorerPanelProps = {
    maxHeight?: number | string;
    maxWidth?: number | string;
}

const DataExplorerPanel: FC<DataExplorerPanelProps> = ({maxHeight, maxWidth}) => {
    const theme = useTheme();
    return (
        <Grid
            id={DataExplorerPanelId}
            data-testid={DataExplorerPanelId}
            container
            direction='row'
            spacing={1}
            sx={{
                height: '100%',
                width: '100%',
                margin: '0px',
                maxHeight: maxHeight !== undefined ? maxHeight: 'unset',
                maxWidth: maxWidth !== undefined ? maxWidth: 'unset',
                minHeight: '480px',
                minWidth: '640px',
                backgroundColor: theme.custom?.panel?.outer?.backroundColor
            }}>
            <DataExplorerLeftPanel/>
            <DataExplorerRightPanel/>
        </Grid>
    );
};

export default DataExplorerPanel;

export {
    DataExplorerPanelId
}

export type {
    DataExplorerPanelProps
}