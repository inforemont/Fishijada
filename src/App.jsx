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
import FishijadaDetalji from './pages/fishijade/FishijadaDetalji'
import PrijavaPregled from './pages/prijave/PrijavaPregled'
import PrijavaNovi from './pages/prijave/PrijavaNovi'
import PrijavaPrvenstvoBaranje from './pages/prijave/PrijavaPrvenstvoBaranje'
import PrijavaPromjena from './pages/prijave/PrijavaPromjena'
import LokacijaPregled from './pages/lokacije/LokacijaPregled'
import LokacijaNovi from './pages/lokacije/LokacijaNovi'
import LokacijaPromjena from './pages/lokacije/LokacijaPromjena'
import PrijavaDetalji from './pages/prijave/PrijavaDetalji'
import LokacijaDetalji from './pages/lokacije/LokacijaDetalji'
import GeneriranjePodataka from './pages/GeneriranjePodataka'
import Login from './pages/login/Login'
import ZaboravljenaLozinka from './pages/login/ZaboravljenaLozinka'
import ProfilUredivanje from './pages/login/ProfilUredjivanje'



function App() {

  return (
    <>
      <Container className='body'>
        <Izbornik />
        <Container className='app'>

          <Routes>
            <Route path={RouteNames.HOME} element={<Home />} />
            <Route path={RouteNames.FISHIJADE} element={<FishijadePregled />} />
            <Route path={RouteNames.O_APLIKACIJI} element={<O_Aplikaciji />} />
            <Route path={RouteNames.FISHIJADE_DODAJ} element={<FishijadaNovi />} />
            <Route path={RouteNames.FISHIJADE_PROMJENA} element={<FishijadaPromjena />} />
            <Route path={RouteNames.FISHIJADE_DETALJI} element={<FishijadaDetalji />} />

            <Route path={RouteNames.PRIJAVE} element={<PrijavaPregled />} />
            <Route path={RouteNames.PRIJAVE_DODAJ} element={<PrijavaNovi />} />
            <Route path={RouteNames.PRIJAVE_PROMJENA} element={<PrijavaPromjena />} />
            <Route path={RouteNames.PRIJAVE_PRVENSTVO_BARANJE} element={<PrijavaPrvenstvoBaranje />} />
            <Route path={RouteNames.PRIJAVE_DETALJI} element={<PrijavaDetalji />} />

            <Route path={RouteNames.LOKACIJE} element={<LokacijaPregled />} />
            <Route path={RouteNames.LOKACIJE_DODAJ} element={<LokacijaNovi />} />
            <Route path={RouteNames.LOKACIJE_PROMJENA} element={<LokacijaPromjena />} />
            <Route path={RouteNames.LOKACIJE_DETALJI} element={<LokacijaDetalji />} />

            <Route path={RouteNames.GENERIRANJE} element={<GeneriranjePodataka />} />
            <Route path={RouteNames.LOGIN} element={<Login />} />

            <Route path={RouteNames.ZABORAVLJENA_LOZINKA} element={<ZaboravljenaLozinka />} />
            <Route path={RouteNames.PROFIL} element={<ProfilUredivanje />} />





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