import React, { useState } from 'react';
import styled from '@emotion/styled';
import { Link } from 'gatsby';
import colors from '../utils/colors';
import mq from '../utils/mq';
import { rhythm, scale } from '../utils/typography';
import SEO from '../components/seo';
import Layout from '../components/layout';
import toCurrency from '../utils/to-currency';

const Content = styled.section`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
`;

const Label = styled.label`
  font-weight: 200;
  font-size: ${scale(1.25).fontSize};
  ${mq.sm} {
    font-size: ${scale(0.75).fontSize};
  }
`;

const Input = styled.input`
  border-style: solid;
  border-width: 0 0 4px 0;
  text-align: center;
  font-weight: 200;
  font-size: ${scale(1.5).fontSize};
  width: 100%;
  max-width: ${rhythm(20)};
  outline: none;
  &:focus {
    border-bottom-color: ${colors.accent};
  }
  ${mq.sm} {
    font-size: ${scale(0.75).fontSize};
  }
  transition: 0.15s ease-in;
  transition-property: border-bottom-color;
`;

const LinkButton = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  color: white;
  background-color: ${colors.main};
  border: none;
  box-shadow: 4px 4px 8px 0px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  padding: ${rhythm(1.25)};
  font-weight: 200;
  font-size: ${scale(1.25).fontSize};
  width: 100%;
  max-width: ${rhythm(20)};
  &:hover {
    text-decoration: none;
  }
  ${mq.sm} {
    font-size: ${scale(0.5).fontSize};
    padding: ${rhythm(0.25)};
  }
`;

const IndexPage: React.FunctionComponent = () => {
  const [bill, setBill] = useState('');

  return (
    <Layout>
      <SEO />
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
