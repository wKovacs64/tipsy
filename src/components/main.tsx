import { css } from '@emotion/react';
import { rhythm } from '../theme';

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
