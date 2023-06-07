export default {
  palette: {
    type: 'light',
    primary: {
      main: '#0a72cc'
    },
    secondary: {
      main: '#0a72cc'
    },
    shades: {
      dark: '#000000',
      main: 'rgba(255 255 255 / 90%)',
      light: '#ffffff'
    },
    error: {
      main: '#e02020'
    },
    notification: { // Color used in MUI Badge dots
      main: '#0a72cc'
    },
    action: {
      hover: '#ffffff',
      hoverOpacity: 0,
      selected: 'transparent',
      focus: 'transparent'
    }
  },
  typography: {
    fontFamily: ['Open Sans', 'Arial', 'sans-serif'],
    body1: {
      fontSize: '1rem',
      letterSpacing: '0',
      lineHeight: '1.5',
      borderBottom: '0 !important' // no border on view and thumbnail buttons
    },
    body2: {
      fontSize: '1rem',
      letterSpacing: '0',
      lineHeight: '1.5'
    },
    h2: { // item title
      textAlign: 'center',
      fontSize: '1.25rem !important',
      ['@media (min-width:576px)']: {
        fontSize: '1.5rem !important'
      }
    },
    subtitle1: { // sidebar annotation and search title
      fontSize: '1.125rem'
    }
  },
  overrides: {
    Mui: {
      root: {
        '&$disabled': { // example: disabled pagination buttons
          color: '#d8d8d8'
        },
        '&$selected': { // example: selected view button
          color: '#0a72cc'
        }
      }
    },
    MuiAutocomplete: {
      input: {
        minWidth: '130px !important'
      }
    },
    MuiButtonBase: {
      root: {
        color: '#000000',
        backgroundColor: 'transparent',
        '&:hover, &:hover svg': {
          color: '#0a72cc'
        },
        '&:focus-visible': {
          outline: '2px solid #0a72cc',
          outlineOffset: '-2px'
        }
      }
    },
    MuiButton: {
      contained: { // example: button on modal when no search results
        color: '#0a72cc',
        boxShadow: 'none',
        backgroundColor: 'transparent',
        fontSize: '0.875rem',
        textTransform: 'uppercase',
        fontWeight: '600',
        padding: '0 1rem',
        border: '1px solid #0a72cc',
        borderRadius: '0.25rem',
        '&:hover': {
          color: '#ffffff',
          boxShadow: 'none',
          backgroundColor: '#0a72cc'
        }
      }
    },
    MuiChip: { // example: clear search input
      outlinedSecondary: {
        border: '0',
        color: '#4d4d4d'
      },
      deleteIconOutlinedColorSecondary: {
        color: '#4d4d4d'
      }
    },
    MuiIconButton: {
      root: {
        color: '#000000',
        backgroundColor: 'transparent',
        '&:hover': {
          color: '#0a72cc'
        }
      }
    },
    MuiInput: { // example: search input
      formControl: {
        border: '1px solid #d8d8d8 !important',
        borderRadius: '6px',
        padding: '0.25rem 2rem 0.25rem 0.75rem !important',
        '&.Mui-focused': {
          borderColor: '#0a72cc !important'
        }
      },
      underline: {
        '&:before, &:after': {
          border: '0'
        },
        '&:hover:not(.Mui-disabled):before': {
          border: '0'
        }
      }
    },
    MuiInputLabel: { // example: search input label/placeholder
      formControl: {
        margin: '0.25rem 2rem 0.25rem 0.75rem',
        '&.MuiInputLabel-shrink': {
          transform: 'translate(0, 0) scale(0.75)'
        }
      }
    },
    MuiTab: {
      textColorPrimary: {
        color: '#000000'
      }
    },
    MuiToolbar: {
      root: {
        borderTop: '0 !important'
      }
    },
    MuiTooltip: {
      tooltip: {
        backgroundColor: '#000000',
        border: '1px solid #ededed',
        borderRadius: '0.25rem',
        color: '#fff',
        fontSize: '0.875rem',
        maxWidth: '200px',
        padding: '0.5rem',
        textAlign: 'center'
      }
    },
    MuiTouchRipple: { // hide grey circle on focus
      root: {
        display: 'none'
      }
    }
  }
};
