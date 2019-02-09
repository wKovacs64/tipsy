import styled from '@emotion/styled';
import { Link } from 'gatsby';
import colors from '../utils/colors';
import mq from '../utils/mq';
import { rhythm, scale } from '../utils/typography';

const LinkButton = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  color: white;
  background-color: ${colors.main};
  border: none;
  box-shadow: 4px 4px 8px 0px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  padding: ${rhythm(1.25)};
  font-weight: 200;
  font-size: ${scale(1.25).fontSize};
  width: 100%;
  max-width: ${rhythm(20)};
  &:hover {
    text-decoration: none;
  }
  ${mq.sm} {
    font-size: ${scale(0.5).fontSize};
    padding: ${rhythm(0.25)};
  }
`;

export default LinkButton;
