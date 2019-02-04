import React, { useState } from 'react';
import styled from '@emotion/styled';
import colors from '../utils/colors';
import mq from '../utils/mq';
import { rhythm, scale } from '../utils/typography';
import SEO from '../components/seo';
import Layout from '../components/layout';

const Section = styled.section`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
`;

const Label = styled.label`
  font-size: ${scale(1.25).fontSize};
  ${mq.sm} {
    font-size: ${scale(0.75).fontSize};
  }
`;

const Input = styled.input`
  border-style: solid;
  border-width: 0 0 4px 0;
  text-align: center;
  font-size: ${scale(1.5).fontSize};
  width: 75vw;
  outline: none;
  &:focus {
    border-bottom-color: ${colors.accent};
  }
  ${mq.sm} {
    font-size: ${scale(0.75).fontSize};
    width: 30vw;
  }
  transition: 0.15s ease-in;
  transition-property: border-bottom-color;
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  background-color: transparent;
  border: none;
  box-shadow: 2px 2px 4px 2px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  height: ${scale(1.5).lineHeight};
  font-size: ${scale(1.25).fontSize};
  width: 60vw;
  max-width: ${rhythm(18)};
  ${mq.sm} {
    font-size: ${scale(0.75).fontSize};
  }
`;

const IndexPage: React.FunctionComponent = () => {
  const [bill, setBill] = useState<number | undefined>(undefined);

  return (
    <Layout>
      <SEO />
      <Section>
        <Label htmlFor="bill">Bill amount:</Label>
        <Input
          autoFocus
          type="number"
          step="any"
          min="1"
          name="bill"
          id="bill"
          onChange={e => setBill(parseFloat(e.target.value))}
          value={bill}
        />
        <Button>Next</Button>
      </Section>
    </Layout>
  );
};

export default IndexPage;
