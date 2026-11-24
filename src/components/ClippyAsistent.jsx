import { useState, useEffect } from 'react'
import './ClippyAsistent.css'

export default function ClippyAsistent() {
    const [prikaziPoruku, setPrikaziPoruku] = useState(true)

    useEffect(() => {
        const timer = setTimeout(() => {
            setPrikaziPoruku(false)
        }, 4000)

        return () => clearTimeout(timer)
    }, [])

    return (
        <div className="clippy-kontejner">
            {prikaziPoruku && (
                <div className="clippy-balon shadow">
                    <div className="fw-bold mb-1">📎 Hej, trebaš li pomoć?</div>
                    <div className="small mb-2">
                        <strong>Admin:</strong> <code>admin@fishijada.hr</code> / <code>Fishijada123!</code>
                    </div>
                    <div className="small">
                        <strong>Korisnik:</strong> <code>korisnik@fishijada.hr</code> / <code>Fishijada123!</code>
                    </div>
                    <button 
                        type="button" 
                        className="btn-close btn-close-white position-absolute top-0 end-0 m-2" 
                        style={{ fontSize: '0.6rem' }}
                        onClick={() => setPrikaziPoruku(false)}
                        aria-label="Zatvori"
                    />
                </div>
            )}
            
            <div 
                className="clippy-ikona"
                onClick={() => setPrikaziPoruku(!prikaziPoruku)}
                title="Klikni me!"
            >
                📎
            </div>
        </div>
    )
}