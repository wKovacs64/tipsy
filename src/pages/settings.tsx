import React from 'react';
import Switch from 'react-switch';
import styled from '@emotion/styled';
import { rhythm, scale } from '../utils/typography';
import mq from '../utils/mq';
import {
  useDarkMode,
  useDefaultPartySize,
  useDefaultTipPercent,
} from '../utils/state';
import Layout from '../components/layout';
import NumericInput from '../components/numeric-input';
import Content from '../elements/content';
import BrandButton from '../elements/brand-button';
import {
  appDefaultDarkMode,
  appDefaultPartySize,
  appDefaultTipPercent,
} from '../utils/app-defaults';
import { palette } from '../theme';

const SettingsGrid = styled.section`
  width: 100%;
  display: grid;
  grid-row-gap: ${rhythm(2)};
  margin-bottom: ${rhythm(2)};
`;

const Setting = styled.div`
  width: 100%;
`;

const SingleRowSetting = styled(Setting)`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const SettingLabel = styled.label`
  display: inline-block;
  font-weight: 200;
  font-size: ${scale(0.75).fontSize};
  line-height: ${scale(0.75).lineHeight};
  ${mq.sm} {
    font-size: ${scale(0.5).fontSize};
    line-height: ${scale(0.5).lineHeight};
  }
`;

const SettingInput = styled(NumericInput)`
  width: 100%;
  max-width: ${rhythm(20)};
  font-weight: 200;
  font-size: ${scale(1).fontSize};
  line-height: ${scale(1).lineHeight};
  margin: ${rhythm(1)} 0;
  ${mq.sm} {
    font-size: ${scale(0.75).fontSize};
    line-height: ${scale(0.75).lineHeight};
  }
  &:focus::placeholder {
    color: transparent;
  }
`;

const SettingsPage: React.FunctionComponent<import('reach__router').RouteComponentProps> = ({
  navigate,
}) => {
  const darkMode = useDarkMode(appDefaultDarkMode);
  const [defaultPartySize, setDefaultPartySize] = useDefaultPartySize(
    appDefaultPartySize,
  );
  const [defaultTipPercent, setDefaultTipPercent] = useDefaultTipPercent(
    appDefaultTipPercent,
  );
  const [partySize, setPartySize] = React.useState(String(defaultPartySize));
  const [tipPercent, setTipPercent] = React.useState(String(defaultTipPercent));

  function saveSettings(): void {
    const partySizeNumber = parseInt(partySize, 10);
    const tipPercentNumber = parseInt(tipPercent, 10);

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

    if (navigate) {
      navigate('/', { replace: true });
    }
  }

  return (
    <Layout>
      <Content>
        <SettingsGrid>
          <SingleRowSetting>
            <SettingLabel htmlFor="dark-mode">Dark mode:</SettingLabel>
            <Switch
              id="dark-mode"
              aria-checked={darkMode.value}
              checked={darkMode.value}
              onChange={darkMode.toggle}
              onColor={palette.primary}
            />
          </SingleRowSetting>
          <Setting>
            <SettingLabel htmlFor="default-party-size">
              Default party size:
            </SettingLabel>
            <SettingInput
              id="default-party-size"
              name="default-party-size"
              placeholder={String(appDefaultPartySize)}
              onChange={(e) => setPartySize(e.target.value)}
              value={partySize}
            />
          </Setting>
          <Setting>
            <SettingLabel htmlFor="default-tip-percentage">
              Default tip percentage:
            </SettingLabel>
            <SettingInput
              id="default-tip-percentage"
              name="default-tip-percentage"
              placeholder={String(appDefaultTipPercent)}
              onChange={(e) => setTipPercent(e.target.value)}
              value={tipPercent}
            />
          </Setting>
        </SettingsGrid>
        <BrandButton type="button" onClick={saveSettings}>
          Save
        </BrandButton>
      </Content>
    </Layout>
  );
};

export default SettingsPage;
