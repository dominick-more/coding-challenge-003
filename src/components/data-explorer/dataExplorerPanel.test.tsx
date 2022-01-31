import { act, getByTestId } from '@testing-library/react';
import assert from 'assert';
import { render } from 'react-dom';
import { createAsyncWaitCallback, setupMockFetchSuccess } from '../../test-utils/testUtils';
import DataExplorerContainer from './dataExplorerContainer';
import DataExplorerPanel, { DataExplorerPanelId } from './dataExplorerPanel';

describe('DataExplorerPanel Tests', () => {
    let container: HTMLDivElement | null;

    beforeEach(() => {
        container = document.createElement('div');
        document.body.appendChild(container);
        setupMockFetchSuccess();
    });
  
    afterEach(() => {
        if (container !== null) {
            document.body.removeChild(container);
            container = null;
        }
    });

    it('DataExplorerPanel is rendered', async () => {
        assert(container, 'Container may not be null.');
        render(<DataExplorerPanel/>, container);
        expect(getByTestId(container, DataExplorerPanelId)).toBeInTheDocument();
    });

    it('DataExplorerPanel is rendered with maxHeight-maxWidth', async () => {
        assert(container, 'Container may not be null.');
        const maxHeight = '100px';
        const maxWidth = '200px';
        await act( async () => {
            await new Promise<void>((resolve) => {
                const callback = createAsyncWaitCallback(resolve);
                render(<DataExplorerContainer>
                    <DataExplorerPanel maxHeight={maxHeight} maxWidth={maxWidth}/>
                </DataExplorerContainer>, container, callback);
            });
        });
        const dataExplorerPanel = getByTestId(container, DataExplorerPanelId);
        expect(dataExplorerPanel).toHaveStyle(`max-height: ${maxHeight}`);
        expect(dataExplorerPanel).toHaveStyle(`max-width: ${maxWidth}`);
    });
});