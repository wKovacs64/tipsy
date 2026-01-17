import { useMatch } from 'react-router';
import { Icon } from '#/src/icons/icon';

export function Footer() {
  const onHomePage = useMatch({ path: '/', end: true });

  if (onHomePage) {
    return (
      <footer className="flex items-center justify-center p-6">
        <a
          href="https://github.com/wKovacs64/tipsy"
          target="_blank"
          rel="noopener noreferrer"
          className="text-current no-underline"
        >
          <Icon
            name="fa-brands-github"
            role="img"
            title="View source on GitHub"
            aria-label="View source on GitHub"
            size={32}
          />
        </a>
      </footer>
    );
  }

  return <footer />;
}
