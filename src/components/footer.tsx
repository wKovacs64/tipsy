import { css } from '@emotion/react';
import { FaGithub } from 'react-icons/fa';
// eslint-disable-next-line import/no-extraneous-dependencies
import { useLocation } from '@gatsbyjs/reach-router'; // comes with Gatsby
import { rhythm } from '../theme';
import A from './external-link';

const Footer: React.FunctionComponent = () => {
  const location = useLocation();

  if (location.pathname === '/') {
    return (
      <footer
        css={css`
          display: flex;
          align-items: center;
          justify-content: center;
          padding: ${rhythm(1)};
        `}
      >
        <A href="https://github.com/wKovacs64/tipsy">
          <FaGithub aria-label="View source on GitHub" size={32} />
        </A>
      </footer>
    );
  }

  return <footer />;
};

export default Footer;
