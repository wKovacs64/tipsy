import { Link, useMatch } from 'react-router-dom';
import { MdSettings } from 'react-icons/md';
import currency from 'currency.js';
import { billFromUrlParam } from '../utils';

function Header() {
  const settingsMatch = useMatch('settings');
  const calcMatch = useMatch('calc/:bill');
  const homeMatch = useMatch({ path: '/', end: true });

  const bill = billFromUrlParam(calcMatch?.params.bill);

  return (
    <header className="p-6 flex items-center justify-center text-gray-100 bg-tipsy">
      <div className="flex flex-row items-center justify-between w-full max-w-xl">
        <Link to="/" replace>
          <h1 className="text-3xl md:text-4xl">Tipsy</h1>
        </Link>
        {settingsMatch ? (
          // @ts-ignore as __VERSION__ will be statically replaced by Vite
          <h2 className="text-2xl md:text-3xl">v{__VERSION__}</h2>
        ) : calcMatch ? (
          <h2 className="text-2xl md:text-3xl">{currency(bill).format()}</h2>
        ) : homeMatch ? (
          <Link to="/settings" className="text-current no-underline">
            <MdSettings role="img" title="Settings" size={32} />
          </Link>
        ) : null}
      </div>
    </header>
  );
}

export default Header;
