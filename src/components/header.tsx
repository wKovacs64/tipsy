import React from 'react';
import styled from '@emotion/styled';
import { MdSettings } from 'react-icons/md';
import { rhythm, scale } from '../utils/typography';
import Link from './internal-link';

const HeaderContainer = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${rhythm(1)};
`;

const H1 = styled.h1`
  font-size: ${scale(1).fontSize};
  margin: 0;
`;

const Header: React.FunctionComponent = () => (
  <HeaderContainer>
    <H1>
      <Link to="/">Tipsy</Link>
    </H1>
    <Link to="/settings">
      <MdSettings aria-label="Settings" size={scale(1).fontSize} />
    </Link>
  </HeaderContainer>
);

export default Header;
