import { BrowserRouter } from 'react-router';
import { IconContext } from 'react-icons';

function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <BrowserRouter>
      <IconContext.Provider value={{ className: 'align-middle' }}>{children}</IconContext.Provider>
    </BrowserRouter>
  );
}

export default AppProviders;
