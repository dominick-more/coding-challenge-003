import { createTheme } from '@mui/material/styles';

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
  
const dataExplorerTheme = createTheme({
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

export default dataExplorerTheme;