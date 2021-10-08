import { light, dark } from '../theme';

const hydrateThemeCss = `
  body.light-mode {
    color: ${light.text};
    background-color: ${light.background};
  }
  body.dark-mode {
    color: ${dark.text};
    background-color: ${dark.background};
  }
`.replace(/\s+/g, '');

function ThemeHydrationStyleTag(): JSX.Element {
  return (
    // eslint-disable-next-line react/no-danger
    <style dangerouslySetInnerHTML={{ __html: hydrateThemeCss }} />
  );
}

export default ThemeHydrationStyleTag;
