import React, { useState } from 'react';
import styled from '@emotion/styled';
import mq from '../utils/mq';
import { scale } from '../utils/typography';
import Layout from '../components/layout';
import toCurrency from '../utils/to-currency';
import Content from '../styles/content';
import Input from '../styles/input';
import LinkButton from '../styles/link-button';

const Label = styled.label`
  font-weight: 200;
  font-size: ${scale(1.25).fontSize};
  ${mq.sm} {
    font-size: ${scale(0.75).fontSize};
  }
`;

const IndexPage: React.FunctionComponent = () => {
  const [bill, setBill] = useState('');

  return (
    <Layout>
      <Content>
        <Label htmlFor="bill">Bill amount:</Label>
        <Input
          autoFocus
          id="bill"
          name="bill"
          placeholder="0.00"
          type="number"
          pattern="[0-9]"
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
