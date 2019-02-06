import React from 'react';
import styled from '@emotion/styled';
import { scale } from '../utils/typography';
import Layout from '../components/layout';

const Centered = styled.section`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const P = styled.p`
  font-weight: 200;
  font-size: ${scale(1.25).fontSize};
`;

const NotFoundPage: React.FunctionComponent = () => (
  <Layout>
    <Centered>
      <P>Nope.</P>
    </Centered>
  </Layout>
);

export default NotFoundPage;
