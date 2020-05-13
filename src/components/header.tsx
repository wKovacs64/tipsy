import React from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import styled from '@emotion/styled';
import { MdSettings } from 'react-icons/md';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Location } from '@reach/router'; // comes with Gatsby
import get from 'lodash/get';
import currency from 'currency.js';
import * as pkg from '../../package.json';
import { rhythm } from '../utils/typography';
import Content from '../elements/content';
import H1 from '../elements/h1';
import H2 from '../elements/h2';
import { palette } from '../theme';
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
  background-color: ${palette.primary};
  padding: ${rhythm(1)};
`;

const HeaderTitle: React.FunctionComponent = () => {
  const {
    site: {
      siteMetadata: { pwaShortName },
    },
  } = useStaticQuery(graphql`
    {
      site {
        siteMetadata {
          pwaShortName
        }
      }
    }
  `);

  return <H1>{pwaShortName}</H1>;
};

const Header: React.FunctionComponent = () => {
  return (
    <HeaderContainer>
      <HeaderContent>
        {/* left */}
        <Location>
          {({ location }) => {
            if (location.pathname === '/') {
              return <HeaderTitle />;
            }

            return (
              <Link to="/" replace>
                <HeaderTitle />
              </Link>
            );
          }}
        </Location>
        {/* right */}
        <Location>
          {({ location }) => {
            if (location.pathname === '/') {
              return (
                <Link to="/settings">
                  <MdSettings aria-label="Settings" size={32} />
                </Link>
              );
            }

            if (/^\/settings\/?/.test(location.pathname)) {
              return <H2>v{pkg.version}</H2>;
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
};

export default Header;
