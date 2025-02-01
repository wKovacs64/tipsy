import { Link, useMatch } from 'react-router';
import { MdSettings } from 'react-icons/md';
import currency from 'currency.js';
import { billFromUrlParam } from '../utils';

function Header() {
  const settingsMatch = useMatch('settings');
  const calcMatch = useMatch('calc/:bill');
  const homeMatch = useMatch({ path: '/', end: true });

  const bill = billFromUrlParam(calcMatch?.params.bill);

  return (
    <header className="bg-tipsy flex items-center justify-center p-6 text-gray-100">
      <div className="flex w-full max-w-xl flex-row items-center justify-between">
        <Link to="/" replace>
          <h1 className="text-3xl md:text-4xl">Tipsy</h1>
        </Link>
        {settingsMatch ? (
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
