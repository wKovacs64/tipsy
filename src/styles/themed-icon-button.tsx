import styled from '@emotion/styled';
import { rhythm } from '../utils/typography';
import { palette, light } from '../theme';
import IconButton from './icon-button';

const ThemedIconButton = styled(IconButton)`
  padding: ${rhythm(0.25)};
  body.light-mode & {
    color: ${light.text};
  }
  body.dark-mode & {
    color: ${palette.accent};
  }
`;

export default ThemedIconButton;
