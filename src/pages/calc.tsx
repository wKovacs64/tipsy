import React from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/core';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { rhythm, scale } from '../utils/typography';
import mq from '../utils/mq';
import Layout from '../components/layout';
import Input from '../styles/input';
import LinkButton from '../styles/link-button';

const CalcGrid = styled.section`
  flex: 1;
  width: 100%;
  max-width: ${rhythm(20)};
  font-weight: 200;
  font-size: ${scale(0.5).fontSize};
  line-height: ${scale(0.5).lineHeight};
  display: grid;
  grid-row-gap: ${rhythm(2)};
  grid-template-columns: 1fr auto;
  grid-template-areas:
    'tip-percent-label tip-percent-input'
    'tip-amount-label tip-amount-input'
    'total-amount-label total-amount-input'
    'number-of-people-label number-of-people-input'
    'each-person-pays-label each-person-pays-input'
    'done-button done-button';
`;

const HeroCell = styled.div`
  border-style: solid;
  border-left: 0;
  border-right: 0;
  border-top-width: ${rhythm(0.05)};
  border-bottom-width: ${rhythm(0.05)};
  font-weight: 400;
  padding: ${rhythm(1.5)} 0;
`;

const CalcInput = styled(Input)`
  border-color: rgba(0, 0, 0, 0.5);
  border-bottom-width: ${rhythm(0.1)};
  max-width: ${rhythm(3.25)};
  font-size: ${scale(0.5).fontSize};
  line-height: ${scale(0.5).lineHeight};
  ${mq.sm} {
    font-size: ${scale(0.25).fontSize};
    line-height: ${scale(0.25).lineHeight};
  }
`;

const NumberInput: React.FunctionComponent<{ placeholder?: string }> = ({
  placeholder = '0',
}) => <CalcInput placeholder={placeholder} type="number" pattern="[0-9]" />;

const CurrencyInput: React.FunctionComponent = () => (
  <NumberInput placeholder="0.00" />
);

const CalcPage: React.FunctionComponent = () => (
  <Layout>
    <CalcGrid>
      <div
        css={css`
          grid-area: tip-percent-label;
        `}
      >
        Tip Percent (%)
      </div>
      <div
        css={css`
          grid-area: tip-percent-input;
        `}
      >
        <FiChevronDown size={32} /> <NumberInput /> <FiChevronUp size={32} />
      </div>
      <div
        css={css`
          grid-area: tip-amount-label;
        `}
      >
        Tip Amount
      </div>
      <div
        css={css`
          grid-area: tip-amount-input;
        `}
      >
        <FiChevronDown size={32} /> <CurrencyInput /> <FiChevronUp size={32} />
      </div>
      <HeroCell
        css={css`
          grid-area: total-amount-label;
        `}
      >
        Total Amount
      </HeroCell>
      <HeroCell
        css={css`
          grid-area: total-amount-input;
        `}
      >
        <FiChevronDown size={32} /> <CurrencyInput /> <FiChevronUp size={32} />
      </HeroCell>
      <div
        css={css`
          grid-area: number-of-people-label;
        `}
      >
        Number of People
      </div>
      <div
        css={css`
          grid-area: number-of-people-input;
        `}
      >
        <FiChevronDown size={32} /> <NumberInput /> <FiChevronUp size={32} />
      </div>
      <div
        css={css`
          grid-area: each-person-pays-label;
        `}
      >
        Each Person Pays
      </div>
      <div
        css={css`
          grid-area: each-person-pays-input;
        `}
      >
        <FiChevronDown size={32} /> <CurrencyInput /> <FiChevronUp size={32} />
      </div>
      <LinkButton
        to="/"
        replace
        css={css`
          grid-area: done-button;
        `}
      >
        Done
      </LinkButton>
    </CalcGrid>
  </Layout>
);

export default CalcPage;
