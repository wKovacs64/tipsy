import React from 'react';
import { FiChevronUp } from 'react-icons/fi';
import ClearButton from '../styles/clear-button';

const IncrementButton: React.FunctionComponent<
  React.HTMLAttributes<HTMLButtonElement>
> = props => (
  <ClearButton type="button" {...props}>
    <FiChevronUp size={26} />
  </ClearButton>
);

export default IncrementButton;
