import { BrowserRouter, Route, Routes } from "react-router-dom"
import { AuthPage } from "./pages/AuthPage"
import ProtectedRoutes from "./ProtectedRoutes"
import LandingPage from "./pages/LandingPage"
import { Navbar } from "./components/NavBar"
import { ChatWindow } from "./components/ChatWindow"
import ChatPage from "./pages/ChatPage"


const App = () => {
  return (
    <>
    <BrowserRouter>
    <Navbar/>
    <Routes>
      <Route path ='/login' element= {<AuthPage/>}/>
      <Route path ='/signup' element= {<AuthPage/>}/>
      <Route path='/' element={<LandingPage/>}/>
      <Route element={<ProtectedRoutes/>}>
      <Route path='/chat' element={<ChatPage/>}/>
      {/* <Route path='/' element={}/> */}
      </Route>

    </Routes>
    </BrowserRouter>
      </>
  )
}

export default App