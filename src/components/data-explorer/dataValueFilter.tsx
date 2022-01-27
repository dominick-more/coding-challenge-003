import { FC, useCallback, useContext, useMemo } from 'react';
import { Box, Slider } from '@mui/material';
import DataExplorerContext from '../../contexts/data-explorer/dataExplorerContext';
import { ValueFilter } from '../../types/data-explorer/dataExplorerState';

const initMinMax: Readonly<ValueFilter> = [0, 1];

const formatDisplayValue = (value: number): string => `$${value}`;

const DataValueFilter: FC = () => {
    const context = useContext(DataExplorerContext);
    const { state, utils } = context || {};
    const { data, valueFilter } = state || {};
    const minMaxValues = useMemo((): Readonly<ValueFilter> => {
        if ((utils === undefined) || (data === undefined)) {
            return initMinMax;
        }
        return utils.getMinMaxFilterValue(data);
    }, [data, utils]);

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
    
    const handleChange = useCallback((_event: Event, value: number | number[]): void => {
        if (utils === undefined) {
            return;
        }
        const newValue = normalizeFilterValue(value);
        utils.updateValueFilter(newValue);
    }, [normalizeFilterValue, utils]);

    return (
        <Box>
            <h6 style={{margin: '0 0 2px 0'}}>Spending</h6>
            <Slider
                min={minMaxValues[0]}
                max={minMaxValues[1]}
                disableSwap
                marks={sliderMarks}
                onChange={handleChange}
                size='small'
                value={[...(valueFilter !== undefined) ? valueFilter : minMaxValues]}
                valueLabelDisplay='auto'
                sx={{
                    marginLeft: '8px',
                    width: '90%'
                }}
            />
        </Box>
    );
};

export default DataValueFilter;