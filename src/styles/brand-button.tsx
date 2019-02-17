import styled from '@emotion/styled';
import hexRgb from 'hex-rgb';
import { rhythm, scale } from '../utils/typography';
import { palette } from '../theme';

const rgb = hexRgb(palette.primary);

const BrandButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  color: white;
  background-color: ${palette.primary};
  border: none;
  box-shadow: 4px 4px 8px 0px rgba(${rgb.red}, ${rgb.green}, ${rgb.blue}, 0.4);
  cursor: pointer;
  padding: ${rhythm(0.25)};
  font-weight: 200;
  font-size: ${scale(0.5).fontSize};
  line-height: ${scale(0.5).lineHeight};
  width: 100%;
  &:disabled {
    cursor: not-allowed;
    opacity: 0.65;
  }
`;

export default BrandButton;
