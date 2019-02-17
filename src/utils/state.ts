import createPersistedState from 'use-persisted-state';

export { default as useDarkMode } from 'use-dark-mode';

export const useDefaultPartySize = createPersistedState('defaultPartySize');

export const useDefaultTipPercent = createPersistedState('defaultTipPercent');
