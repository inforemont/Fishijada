import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import { Container } from 'react-bootstrap'
import Izbornik from './components/Izbornik'
import { IME_APLIKACIJE, RouteNames } from './constants'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import O_Aplikaciji from './pages/O_Aplikaciji'
import FishijadePregled from './pages/fishijade/FishijadePregled'

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