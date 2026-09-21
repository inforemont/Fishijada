import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import { Container } from 'react-bootstrap'
import Izbornik from './components/Izbornik'
import { IME_APLIKACIJE, RouteNames } from './constants'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import SmjerPregled from './pages/smjerovi/SmjerPregled'

function App() {

  return (
    <>
      <Container className='body'>
        <Izbornik />
        <Container className='app'>

          <Routes>
            <Route path={RouteNames.HOME} element={<Home />} />
            <Route path={RouteNames.SMJEROVI} element={<SmjerPregled />} />
           
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