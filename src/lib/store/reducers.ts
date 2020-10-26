import { initialState } from './initial-state';
import { createStore } from 'redux';
import * as types from './types';

function reducer(
  state: types.AppState = initialState(),
  action: types.Action,
): types.AppState {
  state.action = action.type;

  switch (action.type) {
    case types.SET_STATE:
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

export const store = createStore(reducer);

store.subscribe(() => console.log(store.getState()));
