import React from 'react';
import styled from '@emotion/styled';
import { MdSettings } from 'react-icons/md';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Location } from '@reach/router'; // comes with Gatsby
import colors from '../utils/colors';
import { rhythm, scale } from '../utils/typography';
import Link from './internal-link';

const HeaderContainer = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: white;
  background-color: ${colors.main};
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
    <Location>
      {({ location }) =>
        location.pathname === '/' ? (
          <HeaderLink to="/settings">
            <MdSettings aria-label="Settings" size={40} />
          </HeaderLink>
        ) : null
      }
    </Location>
  </HeaderContainer>
);

export default Header;
