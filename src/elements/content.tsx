import styled from '@emotion/styled';
import { rhythm } from '../utils/typography';

const Content = styled.section`
  flex: 1;
  width: 100%;
  max-width: ${rhythm(20)};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
`;

export default Content;
