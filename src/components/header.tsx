import React from 'react';
import styled from '@emotion/styled';
import { MdSettings } from 'react-icons/md';
import { rhythm, scale } from '../utils/typography';
import Link from './internal-link';

const HeaderContainer = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: white;
  background-color: #8d6c9f;
`;

const HeaderLink = styled(Link)`
  padding: ${rhythm(1)};
`;

const H1 = styled.h1`
  color: currentColor;
  font-size: ${scale(1).fontSize};
  margin: 0;
`;

const Header: React.FunctionComponent = () => (
  <HeaderContainer>
    <HeaderLink to="/">
      <H1>Tipsy</H1>
    </HeaderLink>
    <HeaderLink to="/settings">
      <MdSettings aria-label="Settings" size={scale(1).fontSize} />
    </HeaderLink>
  </HeaderContainer>
);

export default Header;
