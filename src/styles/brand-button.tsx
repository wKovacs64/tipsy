import styled from '@emotion/styled';
import colors from '../utils/colors';
import mq from '../utils/mq';
import { rhythm, scale } from '../utils/typography';

const BrandButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  color: white;
  background-color: ${colors.main};
  border: none;
  box-shadow: 4px 4px 8px 0px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  padding: ${rhythm(0.2)};
  font-weight: 200;
  font-size: ${scale(0.5).fontSize};
  line-height: ${scale(0.5).lineHeight};
  width: 100%;
  ${mq.sm} {
    padding: ${rhythm(0.25)};
  }
  &:disabled {
    cursor: not-allowed;
    opacity: 0.65;
  }
`;

export default BrandButton;
