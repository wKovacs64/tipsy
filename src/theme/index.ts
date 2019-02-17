export const palette: {
  readonly white: string;
  readonly nearWhite: string;
  readonly accent: string;
  readonly primary: string;
  readonly nearBlack: string;
} = {
  white: '#ffffff',
  nearWhite: '#f4f4f4',
  accent: '#f6d397',
  primary: '#8d6c9f',
  nearBlack: '#111111',
};

export interface Theme {
  readonly background: string;
  readonly text: string;
}

export const light: Theme = {
  background: palette.white,
  text: 'hsla(0,0%,0%,0.7)',
};

export const dark: Theme = {
  background: palette.nearBlack,
  text: palette.nearWhite,
};
