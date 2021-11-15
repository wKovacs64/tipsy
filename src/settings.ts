import useLocalStorageState from 'use-local-storage-state';

export const appDefaultDarkMode = false;
export const appDefaultPartySize = 1;
export const appDefaultTipPercent = 20;

export function useDefaultPartySize(defaultValue: number) {
  return useLocalStorageState('defaultPartySize', defaultValue);
}

export function useDefaultTipPercent(defaultValue: number) {
  return useLocalStorageState('defaultTipPercent', defaultValue);
}
