import { BrowserRouter, Route, Routes } from "react-router-dom"
import { AuthPage } from "./pages/AuthPage"
import ProtectedRoutes from "./ProtectedRoutes"
import LandingPage from "./pages/LandingPage"


const App = () => {
  return (
    <BrowserRouter>
    <Routes>
      <Route path ='/login' element= {<AuthPage/>}/>
      <Route path ='/signup' element= {<AuthPage/>}/>
      <Route path='/' element={<LandingPage/>}/>
      <Route element={<ProtectedRoutes/>}>
      {/* <Route path='/' element={}/>
      <Route path='/' element={}/> */}
      </Route>

    </Routes>
    </BrowserRouter>
  )
}

export default App