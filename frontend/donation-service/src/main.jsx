import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Button from '@mui/material/Button'
import Category from './components/MainCategory.jsx'
import MainAppBar from './components/MainAppBar.jsx'
import { ThemeProvider } from '@mui/material/styles'
import { theme } from './defaultTheme.js'
import { CssBaseline, Container,Grid, Card } from '@mui/material';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* //시작점 */}

    <ThemeProvider theme={theme}>
      <CssBaseline />
      <MainAppBar />
      <App />

                    

    </ThemeProvider>


  </StrictMode>,
)
