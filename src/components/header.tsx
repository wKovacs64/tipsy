import React from 'react';
import styled from '@emotion/styled';
import { MdSettings } from 'react-icons/md';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Location } from '@reach/router'; // comes with Gatsby
import get from 'lodash/get';
import currency from 'currency.js';
import colors from '../utils/colors';
import { rhythm } from '../utils/typography';
import Content from '../styles/content';
import H1 from '../styles/h1';
import H2 from '../styles/h2';
import Link from './internal-link';

const HeaderContent = styled(Content)`
  flex-direction: row;
  justify-content: space-between;
`;

const HeaderContainer = styled.header`
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  background-color: ${colors.main};
  padding: ${rhythm(1)};
`;

const Header: React.FunctionComponent = () => (
  <HeaderContainer>
    <HeaderContent>
      <Link to="/" replace>
        <H1>Tipsy</H1>
      </Link>
      <Location>
        {({ location }) => {
          if (location.pathname === '/') {
            return (
              <Link to="/settings">
                <MdSettings aria-label="Settings" size={32} />
              </Link>
            );
          }

          if (get(location, 'state.bill')) {
            return <H2>{currency(location.state.bill).format(true)}</H2>;
          }
          return null;
        }}
      </Location>
    </HeaderContent>
  </HeaderContainer>
);

export default Header;
