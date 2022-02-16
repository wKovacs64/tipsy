import createLocalStorageHook from 'use-local-storage-state';

export const appDefaultDarkMode = false;
export const appDefaultPartySize = 1;
export const appDefaultTipPercent = 20;

export const useDefaultPartySize = createLocalStorageHook('defaultPartySize', {
  defaultValue: appDefaultPartySize,
});

export const useDefaultTipPercent = createLocalStorageHook(
  'defaultTipPercent',
  { defaultValue: appDefaultTipPercent },
);
