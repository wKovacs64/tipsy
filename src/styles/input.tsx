import styled from '@emotion/styled';
import colors from '../utils/colors';
import mq from '../utils/mq';
import { rhythm, scale } from '../utils/typography';

const Input = styled.input`
  border-style: solid;
  border-width: 0 0 4px 0;
  text-align: center;
  font-weight: 200;
  font-size: ${scale(1.5).fontSize};
  width: 100%;
  max-width: ${rhythm(20)};
  outline: none;
  &:focus {
    border-bottom-color: ${colors.accent};
  }
  ${mq.sm} {
    font-size: ${scale(0.75).fontSize};
  }
  transition: 0.15s ease-in;
  transition-property: border-bottom-color;
`;

export default Input;
