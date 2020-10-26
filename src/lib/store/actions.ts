import * as types from './types';

export function setState(
  partial: Partial<types.AppState>,
): types.SetStateAction {
  return { type: types.SET_STATE, payload: partial };
}
