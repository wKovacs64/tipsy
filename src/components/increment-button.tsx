import React from 'react';
import { FiChevronUp } from 'react-icons/fi';
import ThemedIconButton from '../elements/themed-icon-button';

const IncrementButton: React.FunctionComponent<React.HTMLAttributes<
  HTMLButtonElement
>> = (props) => (
  <ThemedIconButton type="button" {...props}>
    <FiChevronUp size={26} />
  </ThemedIconButton>
);

export default IncrementButton;
