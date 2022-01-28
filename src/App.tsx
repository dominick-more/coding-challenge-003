import { Container, CssBaseline } from '@mui/material';
import DataExplorer from './components/data-explorer/dataExplorer';
     
function App() {
  return (
    <div
      style={{
        boxSizing: 'border-box',
        height: '100vh',
        width: '100%',
        padding: '20px 0',
        backgroundColor: '#F5F5F5'
      }}>
      <CssBaseline />
      <Container
        maxWidth='lg'
        sx={{
            height: '100%',
            width: '100%'
        }}>
        <DataExplorer/>
      </Container>
    </div>
  );
}

export default App;
