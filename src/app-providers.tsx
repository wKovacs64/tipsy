import { BrowserRouter } from 'react-router';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return <BrowserRouter>{children}</BrowserRouter>;
}
