import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import ReactSwitch from 'react-switch';
import {
  appDefaultPartySize,
  appDefaultTipPercent,
  useDefaultPartySize,
  useDefaultTipPercent,
} from '../settings';
import NumericInput from '../shared/numeric-input';
import BrandButton from '../shared/brand-button';

// TODO: remove this Vite-related hack once react-switch is available as ESM
// @ts-ignore
const Switch = ReactSwitch.default ? ReactSwitch.default : ReactSwitch;

function SettingsPage() {
  const navigate = useNavigate();
  const [defaultPartySize, setDefaultPartySize] =
    useDefaultPartySize(appDefaultPartySize);
  const [defaultTipPercent, setDefaultTipPercent] =
    useDefaultTipPercent(appDefaultTipPercent);
  const [partySize, setPartySize] = React.useState(String(defaultPartySize));
  const [tipPercent, setTipPercent] = React.useState(String(defaultTipPercent));
  const [isCurrentlyDark, setIsCurrentlyDark] = React.useState(
    document.documentElement.classList.contains('dark'),
  );

  // TODO: improve this (listen for system and storage changes, maybe)
  const handleThemeToggle = () => {
    setIsCurrentlyDark(!isCurrentlyDark);
    window.localStorage.setItem('darkMode', String(!isCurrentlyDark));
    document.documentElement.classList.toggle('dark');
  };

  const saveSettings = () => {
    const partySizeNumber = Number.parseInt(partySize, 10);
    const tipPercentNumber = Number.parseInt(tipPercent, 10);

    setDefaultPartySize(
      Number.isNaN(partySizeNumber) || partySizeNumber < 1
        ? appDefaultPartySize
        : partySizeNumber,
    );

    setDefaultTipPercent(
      Number.isNaN(tipPercentNumber) || tipPercentNumber < 0
        ? appDefaultTipPercent
        : tipPercentNumber,
    );

    navigate('/', { replace: true });
  };

  return (
    <section className="flex w-full max-w-xl grow flex-col items-center justify-between">
      <div className="mb-14 grid w-full gap-y-14 text-3xl md:text-4xl">
        <div className="flex items-center justify-between">
          <label htmlFor="dark-mode">Dark mode:</label>
          <Switch
            id="dark-mode"
            aria-checked={isCurrentlyDark}
            checked={isCurrentlyDark}
            onChange={handleThemeToggle}
            onColor="#8d6c9f"
          />
        </div>
        <div>
          <label htmlFor="default-party-size">Default party size:</label>
          <NumericInput
            id="default-party-size"
            name="default-party-size"
            placeholder={String(appDefaultPartySize)}
            className="mg:text-5xl my-6 text-4xl font-extralight"
            onChange={(e) => setPartySize(e.target.value)}
            value={partySize}
          />
        </div>
        <div>
          <label htmlFor="default-tip-percentage">
            Default tip percentage:
          </label>
          <NumericInput
            id="default-tip-percentage"
            name="default-tip-percentage"
            placeholder={String(appDefaultTipPercent)}
            className="mg:text-5xl my-6 text-4xl font-extralight"
            onChange={(e) => setTipPercent(e.target.value)}
            value={tipPercent}
          />
        </div>
      </div>
      <BrandButton type="button" onClick={saveSettings}>
        Save
      </BrandButton>
    </section>
  );
}

export default SettingsPage;
