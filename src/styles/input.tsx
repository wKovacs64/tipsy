import styled from '@emotion/styled';
import colors from '../utils/colors';

const Input = styled.input`
  border-color: rgba(0, 0, 0, 0.7);
  border-style: solid;
  border-width: 0 0 4px 0;
  text-align: center;
  font-weight: 200;
  outline: none;
  &:focus {
    border-bottom-color: ${colors.accent};
  }
  transition: 0.15s ease-in;
  transition-property: border-bottom-color;
`;

export default Input;
