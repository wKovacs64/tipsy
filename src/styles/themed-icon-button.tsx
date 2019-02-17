import styled from '@emotion/styled';
import { palette, light } from '../theme';
import IconButton from './icon-button';

const ThemedIconButton = styled(IconButton)`
  body.light-mode & {
    color: ${light.text};
  }
  body.dark-mode & {
    color: ${palette.accent};
  }
`;

export default ThemedIconButton;
