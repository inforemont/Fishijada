import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import { Container } from 'react-bootstrap'
import Izbornik from './components/Izbornik'
import { IME_APLIKACIJE, RouteNames } from './constants'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import O_Aplikaciji from './pages/O_Aplikaciji'
import FishijadePregled from './pages/fishijade/FishijadePregled'
import FishijadaNovi from './pages/fishijade/FishijadaNovi'
import FishijadaPromjena from './pages/fishijade/FishijadaPromjena'

function App() {

  return (
    <>
      <Container className='body'>
        <Izbornik />
        <Container className='app'>

          <Routes>
            <Route path={RouteNames.HOME} element={<Home />} />
            <Route path={RouteNames.FISHIJADE} element={<FishijadePregled />} />
            <Route path={RouteNames.O_APLIKACIJI} element={<O_Aplikaciji/>} />
            <Route path={RouteNames.FISHIJADE_DODAJ} element={<FishijadaNovi/>} />
            <Route path={RouteNames.FISHIJADE_PROMJENA} element={<FishijadaPromjena/>} />
           
          </Routes>


        </Container>
        <Container>
          <hr />
          &copy; {IME_APLIKACIJE}
        </Container>
      </Container>





    </>
  )
}

export default App