import { Dispatch } from 'redux';

export enum STAGE {
  PROVIDE_TOKEN,
  CHOOSE_TEMPLATES_AND_FILES,
  CREATE_MAPPING,
  TRANSMIT
}

export interface TEMPLATE {
  id: number[],
  data: {
    name: string,
    partyCount: number
  }[],
  selected: number[],
  biggestPartySize: number,
  permissions: any[][],
  fields: string[]
}

export interface SPREADSHEET {
  rows: string[],
  cols: string[]
}

export interface FIELD_MAPPING {
  column: string[],
  field: string[]
}

export const PARTY_MAPPING_KEYS = ["fname", "lname", "dialingCode", "phone", "email"];
export interface PARTY_MAPPING {
  fname: string | null,
  lname: string | null,
  dialingCode?: string | null,
  phone?: string | null,
  email: string | null
}

export interface DETECTED_VALIDATION {
  // When null, the field is not validated
  type: "date" | "text" | "dropdown" | null,
  // Can be date format (date), regex (text), or an array (dropdown)
  value: string | string[]
}

export enum MAPPING_TYPES {
  fname,
  lname,
  email,
  dialingCode,
  phone,
  field
}

export interface COLUMN_ESIGN_MAPPING {
  type: MAPPING_TYPES,
  party: number,
  label: string
}

export interface COLUMN_TYPE {
  name: string
  key: number
}

export interface AppState {
  // Last action executed by redux
  action?: Action['type'];
  // What view is being displayed to the user? Where are they in the process of issuing an eSign Genie bulk send?
  stage: STAGE;
  // Is the application running in localhost? Expose this just in case it might be useful
  dev: boolean;
  // eSign Genie access token
  token: string;
  // Complete list of user's templates from eSign Genie
  templates: TEMPLATE;
  spreadsheet: SPREADSHEET;
  // Column/field string pairs associating column keys to eSign Genie fields
  mappedFields: FIELD_MAPPING;
  // Array of party objects containing first names, last names, and emails
  mappedParties: PARTY_MAPPING[];
  // Percentage of transmit completion
  sendProgress: number;
  // When true, cancel further evaluation of data and folder creation, evaluated before each fetch request
  interruptTransmit: boolean;
  // When true, display a loading interstitial
  loading: boolean;
  /*
    Name of folder, with templating syntax: ${Column Name}

    Used to allow folders to generate unique row-based names
   */
  folderName: string;
  // Simple counter of the number of errors vs successes in transmission
  result: {
    error: number,
    success: number
  },
  // Detected validation mapped to the fields array.
  detectedValidation: DETECTED_VALIDATION[],
  mappings: COLUMN_ESIGN_MAPPING[],
  // Allows columns to be easily matched with a mapping. If null, a mapping has not been made. If a column is provided
  // the mapping of the same index is associated with the column.
  mappingToColumn: (string | null)[]
}

export const SAVE = 'SAVE';
export interface SaveAction {
  type: typeof SAVE;
}

export const SET_STATE = 'SET_STATE';
export interface SetStateAction {
  type: typeof SET_STATE;
  payload: Partial<AppState>;
}

export type Action = SaveAction | SetStateAction;

export type DispatchAction = Dispatch<Action>;
