import { AppState } from './types';
import {
  TypedUseSelectorHook,
  useSelector as useReduxSelector,
} from 'react-redux';

export const useSelector: TypedUseSelectorHook<AppState> = useReduxSelector;
