import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { SocketProvider } from './contexts/SocketContext.tsx'
import { ThemeContextProvider } from './contexts/ThemeContext.tsx'
import { Toaster } from 'sonner'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SocketProvider>
      <ThemeContextProvider>
<Toaster richColors position='top-right'/>
    <App />
      </ThemeContextProvider>
    </SocketProvider>
  </StrictMode>,
)
