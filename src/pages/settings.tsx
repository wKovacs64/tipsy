import React from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/core';
import { rhythm, scale } from '../utils/typography';
import mq from '../utils/mq';
import useLocalStorageState from '../utils/use-local-storage-state';
import Layout from '../components/layout';
import NumberInput from '../components/number-input';
import Content from '../styles/content';
import LinkButton from '../styles/link-button';

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
  margin-bottom: ${rhythm(1)};
`;

const SettingInput = styled(NumberInput)`
  width: 100%;
  max-width: ${rhythm(20)};
  font-size: ${scale(1).fontSize};
  line-height: ${scale(1).lineHeight};
  ${mq.sm} {
    font-size: ${scale(0.75).fontSize};
    line-height: ${scale(0.75).lineHeight};
  }
`;

const initialDefaultPartySize = 1;
const initialDefaultTipPercentage = 20;

const SettingsPage: React.FunctionComponent = () => {
  const [defaultTipPercentage, setDefaultTipPercentage] = useLocalStorageState(
    'defaultTipPercentage',
    initialDefaultTipPercentage,
  );
  const [defaultPartySize, setDefaultPartySize] = useLocalStorageState(
    'defaultPartySize',
    initialDefaultPartySize,
  );

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
            placeholder="1"
            type="number"
            pattern="[0-9]"
            onChange={e => setDefaultPartySize(parseInt(e.target.value, 10))}
            onBlur={() => {
              if (!defaultPartySize) {
                setDefaultPartySize(initialDefaultPartySize);
              }
            }}
            value={defaultPartySize}
          />
        </Setting>
        <Setting>
          <SettingLabel htmlFor="default-tip-percentage">
            Default tip percentage:
          </SettingLabel>
          <SettingInput
            id="default-tip-percentage"
            name="default-tip-percentage"
            placeholder="20"
            type="number"
            pattern="[0-9]"
            onChange={e =>
              setDefaultTipPercentage(parseInt(e.target.value, 10))
            }
            onBlur={() => {
              if (!defaultTipPercentage) {
                setDefaultTipPercentage(initialDefaultTipPercentage);
              }
            }}
            value={defaultTipPercentage}
          />
        </Setting>
        <LinkButton to="/">Done</LinkButton>
      </Content>
    </Layout>
  );
};

export default SettingsPage;
