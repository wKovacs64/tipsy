import React from 'react';
import { css } from '@emotion/core';

const Main: React.FunctionComponent = ({ children }) => (
  <main
    css={css`
      flex: 1;
      display: flex;
    `}
  >
    {children}
  </main>
);

export default Main;
