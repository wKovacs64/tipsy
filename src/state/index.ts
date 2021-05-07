import createPersistedState from 'use-persisted-state';

export const useDefaultPartySize = createPersistedState('defaultPartySize');
export const useDefaultTipPercent = createPersistedState('defaultTipPercent');

export const appDefaultDarkMode = false;
export const appDefaultPartySize = 1;
export const appDefaultTipPercent = 20;
