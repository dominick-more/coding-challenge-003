import { FC, useCallback, useContext, useMemo } from 'react';
import { Box, Slider, sliderClasses, SliderProps, styled, Typography } from '@mui/material';
import DataExplorerContext from '../../contexts/data-explorer/dataExplorerContext';
import { ValueFilter } from '../../types/data-explorer/dataExplorerState';

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
    const context = useContext(DataExplorerContext);
    const { state, utils } = context || {};
    const { data, valueFilter } = state || {};

    // Memoize tree leaf item values when remote data changes as these
    // are slider mandatory values (i.e. before fetch, after fetch) 
    const minMaxValues = useMemo((): Readonly<ValueFilter> => {
        if ((utils === undefined) || (data === undefined)) {
            return initMinMax;
        }
        return utils.getMinMaxFilterValue(data);
    }, [data, utils]);

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
    const normalizeFilterValue = useCallback(
        (value: number | number[]): Readonly<ValueFilter> | undefined => {
        const [min, max] = minMaxValues;
        const arrayValue = Array.isArray(value) ? [...value] : [value];
        const length = arrayValue.length;
        if (!length) {
            return undefined;
        }
        if (length === 1) {
            const newValue = arrayValue[0];
            if (newValue >= min) {
                return (newValue <= max) ? [min, newValue] : undefined;
            }
            return undefined;
        }
        arrayValue.sort((a, b) => a - b);
        const [newMinValue, newMaxValue] = [...arrayValue.slice(0, 2)];
        if (newMinValue >= min) {
            if (newMaxValue <= max) {
                return [newMinValue, newMaxValue];
            }
        }
        return undefined;
    }, [minMaxValues]);
    
    // Memoize Slider handle change callback when normalizeFilterValue
    // or utils change.
    const handleChange = useCallback((_event: Event, value: number | number[]): void => {
        if (utils === undefined) {
            return;
        }
        const newValue = normalizeFilterValue(value);
        utils.updateValueFilter(newValue);
    }, [normalizeFilterValue, utils]);

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