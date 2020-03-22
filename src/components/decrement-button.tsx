import React from 'react';
import { FiChevronDown } from 'react-icons/fi';
import ThemedIconButton from '../styles/themed-icon-button';

const DecrementButton: React.FunctionComponent<React.HTMLAttributes<
  HTMLButtonElement
>> = (props) => (
  <ThemedIconButton type="button" {...props}>
    <FiChevronDown size={26} />
  </ThemedIconButton>
);

export default DecrementButton;
