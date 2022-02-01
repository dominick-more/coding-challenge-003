import { asyncWaitTimeout } from '../action-creators/data-explorer/dataExplorerActionCreatorsDefault';
import AppBusinessData from '../types/data-explorer/appBusinessData';

const copyRemoteTestData = (): AppBusinessData[] | never => {
    const remoteData = require('../../data.json');
    if(!Array.isArray(remoteData)) {
        throw new Error('remote test data is not an array.');
    }
    return JSON.parse(JSON.stringify(remoteData));
};

const createAsyncWaitCallback = (resolve: (value: void | PromiseLike<void>) => void, wait: boolean = true):
    (() => void) => {
    return () => setTimeout(() => resolve(), wait ? asyncWaitTimeout + 10 : 0);
}

const setupMockFetchSuccess = () => {
    fetchMock.mockIf('http://localhost:8080/data', (_req) => {
        return Promise.resolve({
            body: JSON.stringify(require('../../data.json')),
            status: 200
        });
    });
};

const setupMockFetchInvalidJSON = () => {
    fetchMock.mockIf('http://localhost:8080/data', (_req) => {
        return Promise.resolve({
            body: '[{foo}]',
            status: 200
        });
    });
};

const setupMockFetchFail = () => {
    fetchMock.mockIf('http://localhost:8080/data', (_req) => {
        return Promise.resolve({
            body: 'Mock fetch error occured',
            status: 403
        });
    });
};

export {
    copyRemoteTestData,
    createAsyncWaitCallback,
    setupMockFetchSuccess,
    setupMockFetchInvalidJSON,
    setupMockFetchFail
}
