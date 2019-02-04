import { Link } from 'gatsby';
import styled from '@emotion/styled';

const InternalLink = styled(Link)`
  color: currentColor;
  &:hover,
  &:focus {
    color: currentColor;
    text-decoration: none;
  }
`;

export default InternalLink;
