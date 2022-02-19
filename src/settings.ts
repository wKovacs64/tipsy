import useLocalStorageState from 'use-local-storage-state';

export const appDefaultDarkMode = false;
export const appDefaultPartySize = 1;
export const appDefaultTipPercent = 20;

export function useDefaultPartySize() {
  return useLocalStorageState('defaultPartySize', {
    defaultValue: appDefaultPartySize,
  });
}

export function useDefaultTipPercent() {
  return useLocalStorageState('defaultTipPercent', {
    defaultValue: appDefaultTipPercent,
  });
}
