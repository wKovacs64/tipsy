import styled from '@emotion/styled';
import { scale } from '../utils/typography';

const H1 = styled.h1`
  color: currentColor;
  font-size: ${scale(1).fontSize};
  line-height: ${scale(1).lineHeight};
  margin: 0;
`;

export default H1;
