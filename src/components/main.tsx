import * as React from 'react';
import { css } from '@emotion/react';
import { rhythm } from '../theme';

function Main({ children }: MainProps): JSX.Element {
  return (
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
}

interface MainProps {
  children: React.ReactNode;
}

export default Main;
