import React from 'react';
import styled from '@emotion/styled';
import mq from '../utils/mq';
import { rhythm, scale } from '../utils/typography';
import Layout from '../components/layout';
import NumericInput from '../components/numeric-input';
import toCurrency from '../utils/to-currency';
import Content from '../styles/content';
import BrandButton from '../styles/brand-button';

const Label = styled.label`
  font-weight: 200;
  font-size: ${scale(1.25).fontSize};
  line-height: ${scale(1.25).lineHeight};
  ${mq.sm} {
    font-size: ${scale(0.75).fontSize};
    line-height: ${scale(0.75).lineHeight};
  }
`;

const BillInput = styled(NumericInput)`
  width: 100%;
  max-width: ${rhythm(20)};
  font-size: ${scale(1.5).fontSize};
  line-height: ${scale(1.5).lineHeight};
  ${mq.sm} {
    font-size: ${scale(0.75).fontSize};
    line-height: ${scale(0.75).lineHeight};
    margin: ${rhythm(1)} 0;
  }
  &:focus::placeholder {
    color: transparent;
  }
`;

const IndexPage: React.FunctionComponent<
  import('reach__router').RouteComponentProps
> = ({ navigate }) => {
  const [bill, setBill] = React.useState('');

  function navigateToCalc() {
    if (navigate) {
      navigate('calc', { state: { bill } });
    }
  }

  return (
    <Layout>
      <Content>
        <Label htmlFor="bill">Bill amount:</Label>
        <BillInput
          id="bill"
          name="bill"
          placeholder="0.00"
          onChange={e => setBill(toCurrency(e.target.value))}
          onKeyDown={e => {
            if (e.keyCode === 13) {
              navigateToCalc();
            }
          }}
          value={bill}
        />
        <BrandButton
          onClick={navigateToCalc}
          disabled={!bill || bill === '0.00'}
        >
          Next
        </BrandButton>
      </Content>
    </Layout>
  );
};

export default IndexPage;
