import React from 'react';
import { css } from '@emotion/core';
import { FaGithub } from 'react-icons/fa';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Location } from '@reach/router'; // comes with Gatsby
import { rhythm } from '../utils/typography';
import A from './external-link';

const Footer: React.FunctionComponent = () => (
  <Location>
    {({ location }) => {
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
    }}
  </Location>
);

export default Footer;
