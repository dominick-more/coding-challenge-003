import { CssBaseline } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import DataExplorer from './components/data-explorer/dataExplorer';

// See https://mui.com/customization/theming/
declare module '@mui/material/styles' {
  interface Theme {
    custom: {
      panel: {
        inner: {
          backroundColor: string;
          border: string;
          borderRadius: string;
          padding: string;
          paddingBottom: string;
          paddingLeft: string;
          paddingRight: string;
          paddingTop: string;
        };
        outer: {
          backroundColor: string;
          border: string;
          borderRadius: string;
          padding: string;
          paddingBottom: string;
          paddingLeft: string;
          paddingRight: string;
          paddingTop: string;
        }
      };
    };
  }
  // allow configuration using `createTheme`
  interface ThemeOptions {
    custom?: {
      panel?: {
        inner?: {
          backroundColor?: string;
          border?: string;
          borderRadius?: string;
          padding?: string;
          paddingBottom?: string;
          paddingLeft?: string;
          paddingRight?: string;
          paddingTop?: string;
        };
        outer?: {
          backroundColor?: string;
          border?: string;
          borderRadius?: string;
          padding?: string;
          paddingBottom?: string;
          paddingLeft?: string;
          paddingRight?: string;
          paddingTop?: string;
        };
      };
    };
  }
}

const theme = createTheme({
  custom: {
    panel: {
      inner: {
        backroundColor: '#FAFAFA',
        borderRadius: '4px',
        padding: '16px',
        paddingBottom: '16px',
        paddingLeft: '16px',
        paddingRight: '16px',
        paddingTop: '16px'
      },
      outer: {
        backroundColor: '#D5CEC6',
        borderRadius: '4px',
        padding: '16px',
        paddingBottom: '16px',
        paddingLeft: '16px !important',
        paddingRight: '16px',
        paddingTop: '16px !important'
      }
    }
  }
});

function App() {
  return (
    <div
      style={{
        boxSizing: 'border-box',
        height: '100vh',
        minHeight: '480px',
        width: '100%',
        backgroundColor: '#F5F5F5'
      }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <DataExplorer/>
      </ThemeProvider>
    </div>
  );
}

export default App;
