import { IME_APLIKACIJE } from '../constants'
import { Container, Card } from 'react-bootstrap'
import kotlic_loop from '../assets/kotlic_loop.webm'
import pozadinaKartice from '../assets/baranja.jpg'

export default function Home() {
    return (
        <Container className="text-center my-4">
            <Card 
                className="p-4 shadow-lg border-0 text-white" 
                style={{ 
                    backgroundImage: `url(${pozadinaKartice})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    borderRadius: '12px',
                    position: 'relative',
                    overflow: 'hidden'
                }}
            >
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0, 0, 0, 0.35)',
                    zIndex: 1
                }}></div>

        
                <div style={{ position: 'relative', zIndex: 2 }}>
                    <div className="text-center my-2">
                        <video 
                            autoPlay 
                            loop 
                            muted 
                            playsInline 
                            style={{ 
                                width: "100%",       
                                maxWidth: "1100px",  
                                height: "auto",     
                                borderRadius: "8px",
                                boxShadow: "0 6px 20px rgba(0,0,0,0.5)"
                            }}
                        >
                            <source src={kotlic_loop} type="video/webm" />
                            Vaš preglednik ne podržava video.
                        </video>
                    </div>
                    
                    <h2 className="mt-4 font-weight-bold" style={{ textShadow: '2px 2px 6px rgba(0,0,0,0.9)', color: '#fff' }}>
                        Dobrodošli na {IME_APLIKACIJE}
                    </h2>
                    <p className="lead" style={{ textShadow: '1px 1px 4px rgba(0,0,0,0.9)', color: '#f8f9fa' }}>
                        Središnje mjesto za praćenje i prijave na baranjske fišijade
                    </p>
                </div>
            </Card>
        </Container>
    )
}