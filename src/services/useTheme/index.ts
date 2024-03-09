export const theme = {
  primary: {
    main: '#4EC9B0',
  },
  link: {
    main: '#3081F7',
  },
  highlight: {
    active: {
      main: '#181818',
      background: '#CCCCCC',
    },
    main: {
      main: '#181818',
      background: '#8C8C8C',
    },
  },
  card: {
    border: {
      default: '#2B2B2B',
      active: '#666666',
    },
    heading: {
      default: '#9D9D9D',
      active: '#FFFFFF',
    },
  },
  text: {
    default: '#CCCCCC',
    secondary: '#8C8C8C',
  },
  input: {
    border: {
      default: '#2B2B2B',
      active: '#FFFFFF',
    },
    placeholder: '#8C8C8C',
    main: '#FFFFFF',
  },
  // TODO: implement this
  cursor: '#0000FF',
  department: {
    se: {
      main: '#FF4473',
    },
    pm: {
      main: '#4059AD',
    },
    id: {
      main: '#35DAAD',
    },
    sts: {
      main: '#F0A202',
    },
    is: {
      main: '#F0A202',
    },
    unknown: {
      main: '#00000',
    },
  },
  info: {
    retired: '#FFE58F',
  },
};

export function useTheme() {
  return { theme };
}
