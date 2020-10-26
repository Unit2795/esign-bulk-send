import {AppState, STAGE} from './types';

// Remember to define and comment your types in ./types

// TODO Investigate ways to improve the performance/reduce the weight of the redux store.
export function initialState(): AppState {
  return {
    stage: STAGE.PROVIDE_TOKEN,
    token: "",
    dev: 'localhost' == window.location.hostname,
    templates: {
      id: [],
      data: [],
      selected: [],
      biggestPartySize: 0,
      permissions: [],
      fields: []
    },
    spreadsheet: {
      rows: [],
      cols: []
    },
    // TODO Refactor below items
    mappings: [],
    mappedFields: {
      column: [],
      field: []
    },
    mappedParties: [],
    sendProgress: -1,
    interruptTransmit: false,
    loading: false,
    folderName: "",
    result: {
      error: 0,
      success: 0
    },
    detectedValidation: [],
    mappingToColumn: []
  };
}
