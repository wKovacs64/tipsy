import styled from '@emotion/styled';
import { scale } from '../utils/typography';

const H2 = styled.h2`
  color: currentColor;
  font-size: ${scale(0.5).fontSize};
  line-height: ${scale(0.5).lineHeight};
  margin: 0;
`;

export default H2;
