import React from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/core';
import { rhythm, scale } from '../utils/typography';
import mq from '../utils/mq';
import { useDefaultPartySize, useDefaultTipPercent } from '../utils/state';
import Layout from '../components/layout';
import NumberInput from '../components/number-input';
import Content from '../styles/content';
import LinkButton from '../styles/link-button';
import {
  initialDefaultPartySize,
  initialDefaultTipPercent,
} from '../utils/defaults';

const Setting = styled.div`
  width: 100%;
  max-width: ${rhythm(20)};
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

const SettingInput = styled(NumberInput)`
  width: 100%;
  max-width: ${rhythm(20)};
  font-size: ${scale(1).fontSize};
  line-height: ${scale(1).lineHeight};
  margin: ${rhythm(1)} 0;
  ${mq.sm} {
    font-size: ${scale(0.75).fontSize};
    line-height: ${scale(0.75).lineHeight};
  }
`;

const SettingsPage: React.FunctionComponent = () => {
  const [defaultPartySize, setDefaultPartySize] = useDefaultPartySize(
    initialDefaultPartySize,
  );
  const [defaultTipPercent, setDefaultTipPercent] = useDefaultTipPercent(
    initialDefaultTipPercent,
  );
  const [partySize, setPartySize] = React.useState(String(defaultPartySize));
  const [tipPercent, setTipPercent] = React.useState(String(defaultTipPercent));

  function persistValidValues() {
    const partySizeNumber = parseInt(partySize, 10);
    const tipPercentNumber = parseInt(tipPercent, 10);

    setDefaultPartySize(
      Number.isNaN(partySizeNumber) ? initialDefaultPartySize : partySizeNumber,
    );

    setDefaultTipPercent(
      Number.isNaN(tipPercentNumber)
        ? initialDefaultTipPercent
        : tipPercentNumber,
    );
  }

  return (
    <Layout>
      <Content
        css={css`
          justify-content: space-between;
        `}
      >
        <Setting>
          <SettingLabel htmlFor="default-party-size">
            Default party size:
          </SettingLabel>
          <SettingInput
            id="default-party-size"
            name="default-party-size"
            placeholder={String(initialDefaultPartySize)}
            type="text"
            inputMode="numeric"
            onChange={e => setPartySize(e.target.value)}
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
            placeholder={String(initialDefaultTipPercent)}
            type="text"
            inputMode="numeric"
            onChange={e => setTipPercent(e.target.value)}
            value={tipPercent}
          />
        </Setting>
        <LinkButton onClick={persistValidValues} to="/">
          Save
        </LinkButton>
      </Content>
    </Layout>
  );
};

export default SettingsPage;
