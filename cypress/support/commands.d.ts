declare namespace Cypress {
  interface Chainable {
    toggleDarkMode(): void;
    clearLocalStorageForReal(): void;
  }
}
