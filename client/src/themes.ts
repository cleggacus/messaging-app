export interface Theme{
  title: string;
  theme: {
    primaryBg: string;
    secondaryBg: string;
    navBg: string;
    navFg: string;
    primaryFg: string;
    secondaryFg: string;
    primaryAccent: string;
    secondaryAccent: string;
  }
}

const Themes = {
  dark: {
    title: 'dark',
    theme: {
      primaryBg: '#242439',
      secondaryBg: '#1d1d31',
      primaryFg: '#fff',
      secondaryFg: '#fff',
      navBg: '#131320',
      navFg: '#d8d8ea',
      primaryAccent: '#0e8c80',
      secondaryAccent: '#095b54'
    }
  } as Theme,
  light: {
    title: 'light',
    theme: {
      secondaryBg: '#ffffff',
      primaryBg: '#f5f8ff',
      primaryFg: '#242439',
      secondaryFg: '#fff',
      navBg: '#20284a',
      navFg: '#d8d8ea',
      primaryAccent: '#0e8c80',
      secondaryAccent: '#095b54'
    }
  } as Theme,
  black: {
    title: 'black',
    theme: {
      primaryBg: '#000',
      secondaryBg: '#060708',
      primaryFg: '#fff',
      secondaryFg: '#fff',
      navBg: '#000',
      navFg: '#fff',
      primaryAccent: '#161718',
      secondaryAccent: '#060708'
    }
  } as Theme
}

const setTheme = (t: Theme) => {
  const theme = t.theme;

  document.documentElement.style.setProperty('--primary-bg', theme.primaryBg);
  document.documentElement.style.setProperty('--secondary-bg', theme.secondaryBg);
  document.documentElement.style.setProperty('--primary-fg', theme.primaryFg);
  document.documentElement.style.setProperty('--secondary-fg', theme.secondaryFg);
  document.documentElement.style.setProperty('--nav-fg', theme.navFg);
  document.documentElement.style.setProperty('--nav-bg', theme.navBg);
  document.documentElement.style.setProperty('--primary-accent', theme.primaryAccent);
  document.documentElement.style.setProperty('--secondary-accent', theme.secondaryAccent);
}

export {Themes, setTheme};