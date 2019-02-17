import React from 'react';
import { FiChevronDown } from 'react-icons/fi';
import ClearButton from '../styles/clear-button';

const DecrementButton: React.FunctionComponent<
  React.HTMLAttributes<HTMLButtonElement>
> = props => (
  <ClearButton type="button" {...props}>
    <FiChevronDown size={26} />
  </ClearButton>
);

export default DecrementButton;
