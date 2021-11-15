import { FaGithub } from 'react-icons/fa';
import { useMatch } from 'react-router-dom';

function Footer() {
  const onHomePage = useMatch({ path: '/', end: true });

  if (onHomePage) {
    return (
      <footer className="p-6 flex items-center justify-center">
        <a
          href="https://github.com/wKovacs64/tipsy"
          target="_blank"
          rel="noopener noreferrer"
          className="text-current no-underline"
        >
          <FaGithub role="img" title="View source on GitHub" size={32} />
        </a>
      </footer>
    );
  }

  return <footer />;
}

export default Footer;
