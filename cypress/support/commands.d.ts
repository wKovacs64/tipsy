declare namespace Cypress {
  interface Chainable<Subject = any> {
    toggleDarkMode(): void;
    clearLocalStorageForReal(): void;
  }
}
