import { Container, CssBaseline, Grid } from '@mui/material';
import DataExplorerPanel from './components/data-explorer/dataExplorerPanel';
import DataExplorerContainer from './components/data-explorer/dataExplorerContainer';
     
function App() {
  return (
    <div
      style={{
        boxSizing: 'border-box',
        height: '100vh',
        width: '100%',
        padding: '20px 0'
      }}>
      <CssBaseline />
      <Container
        maxWidth='lg'
        sx={{
            height: '100%',
            width: '100%'
        }}>
        <DataExplorerContainer>
          <Grid
            id='data-explorer-container-view'
            container
            item
            direction='row'
            justifyContent='center'
            columns={{ xs: 12 }}
            wrap='wrap'
            sx={{
              height: '100%',
              margin: 'auto 0 !important', 
              width: '100%'}}>
            <Grid
              item
              xs={16}
              alignItems='center'
              justifyContent='center'
              sx={{
                  display: 'flex',
                  margin: '0 auto',
                  padding: '0px !important'
              }}>
              <DataExplorerPanel maxHeight={'768px'}/>
            </Grid>  
          </Grid>
        </DataExplorerContainer>
      </Container>
    </div>
  );
}

export default App;
