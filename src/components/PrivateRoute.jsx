import { Navigate } from "react-router-dom"
import AuthService from "../services/logiranje/AuthService"
import { RouteNames } from "../constants"

export default function PrivateRoute({ children, adminOnly = false }) {
    const korisnik = AuthService.dohvatiPrijavljenogKorisnika()

    if (!korisnik) {
        return <Navigate to={RouteNames.LOGIN} replace />
    }

    if (adminOnly && korisnik.uloga !== 'Admin') {
        return <Navigate to={RouteNames.HOME} replace />
    }

    return children
}