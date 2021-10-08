import { useStaticQuery, graphql } from 'gatsby';
import styled from '@emotion/styled';
import { MdSettings } from 'react-icons/md';
// eslint-disable-next-line import/no-extraneous-dependencies
import { useLocation } from '@gatsbyjs/reach-router';
import currency from 'currency.js';
import pkg from '../../package.json';
import Content from '../elements/content';
import H1 from '../elements/h1';
import H2 from '../elements/h2';
import { rhythm, palette } from '../theme';
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

function HeaderTitle() {
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
}

function Header(): JSX.Element {
  const location = useLocation();

  return (
    <HeaderContainer>
      <HeaderContent>
        {/* left */}
        <Link to="/" replace>
          <HeaderTitle />
        </Link>

        {/* right */}
        {location.pathname === '/' ? (
          <Link to="/settings">
            <MdSettings role="img" title="Settings" size={32} />
          </Link>
        ) : /^\/settings\/?/.test(location.pathname) ? (
          <H2>v{pkg.version}</H2>
        ) : location.state?.bill ? (
          <H2>{currency(location.state.bill).format()}</H2>
        ) : null}
      </HeaderContent>
    </HeaderContainer>
  );
}

export default Header;
