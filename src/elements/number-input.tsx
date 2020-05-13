import styled from '@emotion/styled';
import { rhythm, scale } from '../theme';
import { mq } from '../utils';
import Input from './input';

const NumberInput = styled(Input)`
  border-color: rgba(0, 0, 0, 0.5);
  border-bottom-width: ${rhythm(0.1)};
  max-width: ${rhythm(3.25)};
  font-size: ${scale(0.5).fontSize};
  line-height: ${scale(0.5).lineHeight};
  ${mq.sm} {
    font-size: ${scale(0.25).fontSize};
    line-height: ${scale(0.25).lineHeight};
  }
`;

export default NumberInput;
