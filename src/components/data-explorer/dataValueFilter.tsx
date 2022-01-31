import { FC, useMemo } from 'react';
import { Box, Slider, sliderClasses, SliderProps, styled, Typography } from '@mui/material';
import { ValueFilter } from '../../types/data-explorer/dataExplorerState';
import useDataExplorerHook from '../../hooks/data-explorer/dataExplorerHook';

const DataExplorerValueFilterId = 'data-explorer-value-filter';

const initMinMax: Readonly<ValueFilter> = [0, 1];

const formatDisplayValue = (value: number): string => `$${value}`;

const StyledSlider = styled((props: SliderProps) => (
    <Slider {...props} />
  ))(({ theme }) => ({
    [`& .${sliderClasses.markLabel}`]: {
      fontSize: '0.725rem !important'
    }
  }));

const DataValueFilter: FC = () => {
    const { actionCreators, eventHandlers, readAccessors, state } = useDataExplorerHook();
    const { data, valueFilter } = state || {};

    // Memoize tree leaf item values when remote data changes as these
    // are slider mandatory values (i.e. before fetch, after fetch) 
    const minMaxValues = useMemo((): Readonly<ValueFilter> => {
        if ((readAccessors === undefined) || (data === undefined)) {
            return initMinMax;
        }
        return readAccessors.getMinMaxFilterValue(data);
    }, [data, readAccessors]);

    // Memoize slider min/max values/labels when data changes
    const sliderMarks = useMemo(() => {
        return [
            {
                value: minMaxValues[0],
                label: formatDisplayValue(minMaxValues[0]),
            },
            {
                value: minMaxValues[1],
                label: formatDisplayValue(minMaxValues[1]),
            },
        ];
    }, [minMaxValues]);

    // Memoize normalize filter value function when minMaxValues
    // changes.
    const normalizeFilterValue = useMemo(() => {
        if (readAccessors === undefined) {
            return undefined;
        }
        return readAccessors.createNormalizeValueFilter(minMaxValues);
    }, [minMaxValues, readAccessors]);
    
    // Memoize Slider handle change callback when normalizeFilterValue
    // or utils change.
    const handleChange = useMemo(() => {
        if ((normalizeFilterValue === undefined) || (eventHandlers === undefined)) {
            return undefined;
        }
        return eventHandlers.createUpdateFilterValue({
            normalizeFilterValue, actionCreators, readAccessors
        });
    }, [normalizeFilterValue, actionCreators, eventHandlers, readAccessors]);

    return (
        <Box sx={{paddingRight: '8px'}}>
            <Typography
                sx={{
                    fontSize: '0.75em',
                    fontWeight: 'bold'
                }}
                color='text.secondary'>
                Spending
            </Typography>
            <StyledSlider
                id={DataExplorerValueFilterId}
                min={minMaxValues[0]}
                max={minMaxValues[1]}
                disableSwap
                marks={sliderMarks}
                onChange={handleChange}
                size='small'
                value={[
                    ...(valueFilter !== undefined) ?
                    valueFilter : minMaxValues]}
                valueLabelDisplay='auto'
                sx={{
                    marginLeft: '20px',
                    width: '90%'
                }}
            />
        </Box>
    );
};

export default DataValueFilter;

export {
    DataExplorerValueFilterId
}