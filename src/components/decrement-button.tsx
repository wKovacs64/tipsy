import { FiChevronDown } from 'react-icons/fi';
import ThemedIconButton from '../elements/themed-icon-button';

function DecrementButton(
  props: React.HTMLAttributes<HTMLButtonElement>,
): JSX.Element {
  return (
    <ThemedIconButton type="button" {...props}>
      <FiChevronDown size={26} />
    </ThemedIconButton>
  );
}

export default DecrementButton;
