import styled from '@emotion/styled';

const Anchor = styled.a`
  color: currentColor;
  &:hover,
  &:focus {
    color: currentColor;
    text-decoration: none;
  }
`;

function ExternalLink(
  props: React.AnchorHTMLAttributes<HTMLAnchorElement>,
): JSX.Element {
  return <Anchor target="_blank" rel="noopener noreferrer" {...props} />;
}

export default ExternalLink;
