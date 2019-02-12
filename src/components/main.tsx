import React from 'react';
import { css } from '@emotion/core';
import { rhythm } from '../utils/typography';

const Main: React.FunctionComponent = ({ children }) => (
  <main
    css={css`
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: ${rhythm(1)};
    `}
  >
    {children}
  </main>
);

export default Main;
