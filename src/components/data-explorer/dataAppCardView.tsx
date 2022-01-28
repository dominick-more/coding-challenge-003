import { Card, Grid, Typography, Theme, SxProps, useTheme, Box } from '@mui/material';
import { useContext, useMemo, FC, ReactNode } from 'react';
import DataExplorerContext from '../../contexts/data-explorer/dataExplorerContext';
import DataTreeNode from '../../types/data-explorer/dataTreeNode';

const DataExplorerAppCardViewId = 'data-explorer-app-card-view';

const commonDataAppCardTextStyle: SxProps<Theme> = Object.freeze({
    lineHeight: '2',
    verticalAlign: 'middle',
    display: 'inline-block',
    width: '100%',
    margin: '0px'
});

const dataAppViewMessageTextStyle: SxProps<Theme> = Object.freeze({
    margin: 0,
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    textAlign: 'center',
    fontSize: '0.75em',
    fontWeight: 'bold',
    fontStyle: 'italic'
});

const createTreeNodeKey = (treeNode: DataTreeNode): string => `app-card-item-${treeNode.nodeId}`;

const formatDisplayValue = (value: number): string => `Total spend: $${value}`;

const DataAppCard: FC<{treeNode: DataTreeNode}> = ({treeNode}) => {
    const { value, name } = treeNode;
    return (
        <Card
            sx={{
                height: '96px',
                width: '146px',
                padding: '18px 12px',
                textAlign: 'center'
            }}>
            <Typography
                sx={{
                    ...commonDataAppCardTextStyle,
                    fontSize: '0.75rem',
                    fontWeight: 'bold'
                }}>
                {name}
            </Typography>
            <Typography
                sx={{
                    ...commonDataAppCardTextStyle,
                    fontSize: '0.725rem',
                    fontWeight: 'normal'
                }}
                color='text.secondary'>
                {formatDisplayValue(value !== undefined ? value : 0)}
            </Typography>
        </Card>
    );
};

const DataAppCardView: FC = () => {
    const context = useContext(DataExplorerContext);
    const theme = useTheme();
    const { state, utils } = context || {};
    const { data, treeNodeSelection, valueFilter } = state || {};

    // Memoize app tree nodes based on current node branch selection and value filter.
    const appTreeNodes = useMemo(() => {
        if ((utils === undefined) || (data === undefined) || (treeNodeSelection === undefined)) {
            return undefined;
        }
        const dataTreeLeaves = utils.filterDataTreeLeaves(data, treeNodeSelection, valueFilter);
        return dataTreeLeaves;
    }, [data, treeNodeSelection, utils, valueFilter]);

    // Conditionally create child nodes based on appTreeNodes value
    let displayMessage: boolean = true;
    const isNotSelected = (appTreeNodes === undefined);
    const childNodes: ReactNode[] = [];
    if ((appTreeNodes === undefined) || !appTreeNodes.length) {
        // If key not specified React renderer issues a warning.
        const messageKey = isNotSelected ? 'select-branch' : 'no-match';
        const message = isNotSelected ? 'Select a navigation item.' :
            'No matching capabilities found.';   
        childNodes.push(<Typography
            key={messageKey}
            sx={{...dataAppViewMessageTextStyle}}
            color='text.secondary'>
            {message}
        </Typography>);
    } else {
        displayMessage = false;
        childNodes.push(appTreeNodes.map((childNode) => {
            return (<Grid
                item
                xs
                sm={12}
                md={4}
                key={createTreeNodeKey(childNode)}
                justifyContent='center'
                sx={{
                    display: 'flex',
                    margin: '16px 0 1px',
                    padding: '0px !important'
                }}>
                <DataAppCard treeNode={childNode}/>
            </Grid>);
        }));
    }
    return (
        <Box
            sx={{
                position: 'relative',
                height: '100%',
                width: '100%',
                backgroundColor: `${theme.custom?.panel?.inner?.backroundColor}`,
                borderRadius: `${theme.custom?.panel?.inner?.borderRadius}`,
            }}>
            {
                displayMessage ? childNodes :
                <Grid
                    id={DataExplorerAppCardViewId}
                    container
                    item
                    direction='row'
                    rowSpacing={1}
                    justifyContent='space-between'
                    alignItems='flex-start'
                    spacing={2}
                    columns={{ xs: 4, sm: 8, md: 12, lg: 16 }}
                    wrap='wrap'
                    sx={{
                        height: 'fit-content',
                        maxHeight: '100%',
                        width: '100%',
                        margin: '0px',
                        overflowY: 'auto',
                        scrollbarWidth: 'thin'
                }}>
                    {childNodes}
                </Grid>
            }
        </Box>
    );
};

export default DataAppCardView;

export {
    DataExplorerAppCardViewId
}