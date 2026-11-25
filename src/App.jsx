import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import { Container, Spinner } from 'react-bootstrap'
import Izbornik from './components/Izbornik'
import { IME_APLIKACIJE, RouteNames } from './constants'
import { Route, Routes, Navigate } from 'react-router-dom'
import React, { lazy, Suspense } from 'react'

const Home = lazy(() => import('./pages/Home'))
const O_Aplikaciji = lazy(() => import('./pages/O_Aplikaciji'))
const FishijadePregled = lazy(() => import('./pages/fishijade/FishijadePregled'))
const FishijadaNovi = lazy(() => import('./pages/fishijade/FishijadaNovi'))
const FishijadaPromjena = lazy(() => import('./pages/fishijade/FishijadaPromjena'))
const FishijadaDetalji = lazy(() => import('./pages/fishijade/FishijadaDetalji'))
const PrijavaPregled = lazy(() => import('./pages/prijave/PrijavaPregled'))
const PrijavaNovi = lazy(() => import('./pages/prijave/PrijavaNovi'))
const PrijavaPrvenstvoBaranje = lazy(() => import('./pages/prijave/PrijavaPrvenstvoBaranje'))
const PrijavaPromjena = lazy(() => import('./pages/prijave/PrijavaPromjena'))
const LokacijaPregled = lazy(() => import('./pages/lokacije/LokacijaPregled'))
const LokacijaNovi = lazy(() => import('./pages/lokacije/LokacijaNovi'))
const LokacijaPromjena = lazy(() => import('./pages/lokacije/LokacijaPromjena'))
const PrijavaDetalji = lazy(() => import('./pages/prijave/PrijavaDetalji'))
const LokacijaDetalji = lazy(() => import('./pages/lokacije/LokacijaDetalji'))
const GeneriranjePodataka = lazy(() => import('./pages/GeneriranjePodataka'))
const Login = lazy(() => import('./pages/login/Login'))
const Registracija = lazy(() => import('./pages/login/Registracija'))
const KorisniciPregled = lazy(() => import('./pages/login/KorisniciPregled'))
const ZaboravljenaLozinka = lazy(() => import('./pages/login/ZaboravljenaLozinka'))
const ProfilUredivanje = lazy(() => import('./pages/login/ProfilUredjivanje'))

function App() {
  return (
    <>
      <Container className='body'>
        <Izbornik />
        <Container className='app'>

          <Suspense fallback={
            <div className="text-center py-5">
              <Spinner animation="border" variant="success" />
              <p className="mt-2 text-muted">Učitavanje sadržaja...</p>
            </div>
          }>
            <Routes>
              <Route path="/" element={<Navigate to={RouteNames.HOME} replace />} />

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
              <Route path={RouteNames.REGISTRACIJA} element={<Registracija />} />
              <Route path={RouteNames.KORISNICI} element={<KorisniciPregled />} />
              <Route path={RouteNames.ZABORAVLJENA_LOZINKA} element={<ZaboravljenaLozinka />} />
              <Route path={RouteNames.PROFIL} element={<ProfilUredivanje />} />

            </Routes>
          </Suspense>

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