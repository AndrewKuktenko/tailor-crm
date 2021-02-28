import get from 'lodash/get';
import { createSelector } from 'reselect';

export const baseImportSelector = (state) => get(state, 'import', {});
export const importPreprocessSelector = createSelector(
  baseImportSelector,
  (data) => data.preprocess,
);
