import styled from '@emotion/styled';

const Anchor = styled.a`
  color: currentColor;
  &:hover,
  &:focus {
    color: currentColor;
    text-decoration: none;
  }
`;

const ExternalLink: React.FunctionComponent<
  React.AnchorHTMLAttributes<HTMLAnchorElement>
> = (props) => <Anchor target="_blank" rel="noopener noreferrer" {...props} />;

export default ExternalLink;
