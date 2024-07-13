import './assets/main.css'
import { attachLogger } from 'effector-logger';

import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import { Toaster } from './components/ui/sonner'

attachLogger()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <>
    <RouterProvider router={router} />
    <Toaster richColors />
  </>
)
