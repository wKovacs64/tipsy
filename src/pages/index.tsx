import React from 'react';
import styled from '@emotion/styled';
import mq from '../utils/mq';
import { rhythm, scale } from '../utils/typography';
import Layout from '../components/layout';
import CurrencyInput from '../components/currency-input';
import toCurrency from '../utils/to-currency';
import Content from '../styles/content';
import LinkButton from '../styles/link-button';

const Label = styled.label`
  font-weight: 200;
  font-size: ${scale(1.25).fontSize};
  line-height: ${scale(1.25).lineHeight};
  ${mq.sm} {
    font-size: ${scale(0.75).fontSize};
    line-height: ${scale(0.75).lineHeight};
  }
`;

const BillInput = styled(CurrencyInput)`
  width: 100%;
  max-width: ${rhythm(20)};
  font-size: ${scale(1.5).fontSize};
  line-height: ${scale(1.5).lineHeight};
  ${mq.sm} {
    font-size: ${scale(0.75).fontSize};
    line-height: ${scale(0.75).lineHeight};
    margin: ${rhythm(1)} 0;
  }
`;

const IndexPage: React.FunctionComponent = () => {
  const [bill, setBill] = React.useState('');

  return (
    <Layout>
      <Content>
        <Label htmlFor="bill">Bill amount:</Label>
        <BillInput
          autoFocus
          id="bill"
          name="bill"
          onChange={e => setBill(toCurrency(e.target.value))}
          value={bill}
        />
        <LinkButton to="/calc" state={{ bill }}>
          Next
        </LinkButton>
      </Content>
    </Layout>
  );
};

export default IndexPage;
