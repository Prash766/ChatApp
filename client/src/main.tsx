import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ThemeContextProvider } from './contexts/ThemeContext.tsx'
import { Toaster } from 'sonner'

createRoot(document.getElementById('root')!).render(
      <ThemeContextProvider>
<Toaster richColors position='top-right'/>
    <App />
      </ThemeContextProvider>
)
