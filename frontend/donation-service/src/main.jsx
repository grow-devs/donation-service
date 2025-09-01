import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ThemeProvider } from '@mui/material/styles'
import { theme } from './defaultTheme.js'
import { CssBaseline, Container,Grid, Card } from '@mui/material';
// ✅ dayjs 본체 import
import dayjs from "dayjs"
// ✅ 플러그인 import
import utc from "dayjs/plugin/utc"
import timezone from "dayjs/plugin/timezone"

// ✅ 초기화 (렌더링 전에 딱 한 번 실행)
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.tz.setDefault("Asia/Seoul")
createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* //시작점 */}

    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />

    </ThemeProvider>


  </StrictMode>,
)
