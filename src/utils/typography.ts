import Typography from 'typography';
import moraga from 'typography-theme-moraga';

moraga.overrideThemeStyles = () => ({
  html: {
    overflowY: 'unset',
  },
});

const typography = new Typography(moraga);

export const { rhythm, scale } = typography;
export default typography;
