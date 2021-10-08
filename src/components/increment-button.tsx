import { FiChevronUp } from 'react-icons/fi';
import ThemedIconButton from '../elements/themed-icon-button';

function IncrementButton(
  props: React.HTMLAttributes<HTMLButtonElement>,
): JSX.Element {
  return (
    <ThemedIconButton type="button" {...props}>
      <FiChevronUp size={26} />
    </ThemedIconButton>
  );
}

export default IncrementButton;
