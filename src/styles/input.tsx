import styled from '@emotion/styled';
import { palette, light, dark } from '../theme';

const Input = styled.input`
  border-style: solid;
  border-width: 0 0 4px 0;
  text-align: center;
  outline: none;
  transition: 0.15s ease-in;
  transition-property: border-bottom-color;
  body.light-mode &:focus,
  body.dark-mode &:focus {
    border-bottom-color: ${palette.accent};
  }
  body.light-mode & {
    color: ${light.text};
    background-color: ${light.background};
    border-bottom-color: ${light.text};
  }
  body.dark-mode & {
    color: ${dark.text};
    background-color: ${dark.background};
    border-bottom-color: ${dark.text};
  }
`;

export default Input;
