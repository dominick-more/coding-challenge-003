import React from 'react';
import { CssBaseline } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import DataExplorer from './components/data-explorer/dataExplorer';

const theme = createTheme({
  palette: {
    background: {
      paper: '#fff',
      default: 'lightgrey'
    },
    text: {
      primary: '#173A5E',
      secondary: '#46505A',
    },
    action: {
      active: '#001E3C',
    },
    success: {
      main: '#fff',
      dark: '#009688',
    },
  },
});

function App() {
  return (
      <div style={{
        boxSizing: 'border-box',
        height: '100vh',
        minHeight: '480px',
        width: '100%'
      }}>
        <CssBaseline />
        <ThemeProvider theme={theme}>
          <DataExplorer/>
        </ThemeProvider>
      </div>
  );
}

export default App;
