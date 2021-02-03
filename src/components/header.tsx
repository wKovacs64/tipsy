import { useStaticQuery, graphql } from 'gatsby';
import styled from '@emotion/styled';
import { MdSettings } from 'react-icons/md';
// eslint-disable-next-line import/no-extraneous-dependencies
import { useLocation } from '@reach/router'; // comes with Gatsby
import currency from 'currency.js';
import * as pkg from '../../package.json';
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
  // TODO: remove this nonsense and just get `location` typed correctly
  const location = useLocation() as import('reach__router').WindowLocation<{
    bill?: string;
  }>;

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
            <MdSettings aria-label="Settings" size={32} />
          </Link>
        ) : /^\/settings\/?/.test(location.pathname) ? (
          <H2>v{pkg.version}</H2>
        ) : location.state?.bill ? (
          <H2>{currency(location.state.bill).format()}</H2>
        ) : null}
      </HeaderContent>
    </HeaderContainer>
  );
};

export default Header;
