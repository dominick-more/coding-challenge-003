import { Card, Grid, Typography, Theme, SxProps } from '@mui/material';
import { useContext, useMemo, FC, ReactNode } from 'react';
import DataExplorerContext from '../../contexts/data-explorer/dataExplorerContext';
import DataTreeNode from '../../types/data-explorer/dataTreeNode';

const createTreeNodeKey = (treeNode: DataTreeNode): string => `app-card-item-${treeNode.nodeId}`;

const formatDisplayValue = (value: number): string => `Total spend: $${value}`;

const DataAppCard: FC<{treeNode: DataTreeNode}> = ({treeNode}) => {
    const { value, name } = treeNode;
    const commonTextStyle: SxProps<Theme> = {
        lineHeight: '3',
        verticalAlign: 'middle',
        fontSize: '0.8em',
        fontWeight: 'bold',
        display: 'inline-block',
        width: '100%',
        margin: '0px'
    };

    return (
        <Card
            sx={{
                height: '96px',
                width: '142px',
                margin: 'auto',
                padding: '6px',
                textAlign: 'center'
            }}
        >
            <Typography sx={commonTextStyle} color="text.secondary" gutterBottom>
                {name}
            </Typography>
            <Typography sx={commonTextStyle} color="text.secondary" gutterBottom>
                {formatDisplayValue(value !== undefined ? value : 0)}
            </Typography>
        </Card>
    );
};

const DataAppCardView: FC = () => {
    const context = useContext(DataExplorerContext);
    const { state, utils } = context || {};
    const { data, treeNodeSelection, valueFilter } = state || {};
    const appTreeNodes = useMemo(() => {
        if ((utils === undefined) || (data === undefined) || (treeNodeSelection === undefined)) {
            return undefined;
        }
        const dataTreeLeaves = utils.filterDataTreeLeaves(data, treeNodeSelection, valueFilter);
        return dataTreeLeaves;
    }, [data, treeNodeSelection, utils, valueFilter]);
    const childNodes: ReactNode[] = [];
    if (appTreeNodes === undefined) {
        childNodes.push(<span key='select-branch'>Select a navigation item.</span>);
    } else if (!appTreeNodes.length) {
        childNodes.push(<span key='no-match'>No matching capabilities found.</span>);
    } else {
        childNodes.push(appTreeNodes.map((childNode) => {
            return (<Grid
                item
                xs
                sm={12}
                md={4}
                key={createTreeNodeKey(childNode)}
                sx={{
                    margin: '8px 0',
                    padding: '0px !important',

                }}
            >
                <DataAppCard treeNode={childNode}/>
            </Grid>);
        }));
    } 
    return (
        <Grid
            container
            item
            direction='row'
            justifyContent='space-around'
            alignItems='flex-start'
            spacing={2}
            columns={{ xs: 4, sm: 8, md: 12, lg: 16 }}
            sx={{
                height: '100%',
                width: '100%',
                margin: '0px',
                padding: '0px !important',
                overflowY: 'auto'
                
                
          }}
        >
            {childNodes}
        </Grid>
    );
};

export default DataAppCardView;
