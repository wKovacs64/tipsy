import * as React from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/react';
import Layout from '../components/layout';
import NumericInput from '../components/numeric-input';
import Content from '../elements/content';
import BrandButton from '../elements/brand-button';
import { rhythm, scale } from '../theme';
import { mq, toCurrency } from '../utils';

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
  font-weight: 200;
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
  const [billInputDisabled, setBillInputDisabled] = React.useState(false);
  const [nextButtonDisabled, setNextButtonDisabled] = React.useState(true);

  function navigateToCalc(): void {
    setBillInputDisabled(true);
    setNextButtonDisabled(true);
    if (navigate) {
      navigate('calc', { state: { bill }, replace: true });
    }
  }

  const handleBillChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const { value } = e.target;
    const valueAsCurrency = toCurrency(value);
    setBill(valueAsCurrency);
    setNextButtonDisabled(!valueAsCurrency || valueAsCurrency === '0.00');
  };

  return (
    <Layout>
      <Content
        css={css`
          justify-content: space-around;
        `}
      >
        <Label htmlFor="bill">Bill amount:</Label>
        <BillInput
          id="bill"
          name="bill"
          placeholder="0.00"
          onChange={handleBillChange}
          onKeyDown={(e) => {
            if (e.keyCode === 13) {
              navigateToCalc();
            }
          }}
          value={bill}
          disabled={billInputDisabled}
        />
        <BrandButton
          type="button"
          onClick={navigateToCalc}
          disabled={nextButtonDisabled}
        >
          Next
        </BrandButton>
      </Content>
    </Layout>
  );
};

export default IndexPage;
