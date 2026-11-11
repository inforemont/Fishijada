import { IME_APLIKACIJE } from '../constants'
import { Container, Card, Carousel } from 'react-bootstrap'
import pozadinaKartice from '../assets/baranja.jpg'

import slika1 from '../assets/fishijada.jpg'
import slika2 from '../assets/pozadina_ribe.jpg'
import slika3 from '../assets/baranja.jpg'

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
                    backgroundColor: 'rgba(0, 0, 0, 0.4)',
                    zIndex: 1
                }}></div>

                <div style={{ position: 'relative', zIndex: 2 }}>
                    

                    <div className="my-3 d-flex justify-content-center">
                        <Carousel 
                            fade 
                            interval={3000} 
                            style={{ width: "100%", maxWidth: "900px" }}
                        >
                            <Carousel.Item>
                                <img
                                    className="d-block w-100 rounded shadow"
                                    src={slika1}
                                    alt="Okusi Baranju!"
                                    style={{ height: "450px", objectFit: "cover" }}
                                />
                                <Carousel.Caption>
                                    <h5 className="bg-dark bg-opacity-75 p-2 rounded">Okusi Baranju!</h5>
                                </Carousel.Caption>
                            </Carousel.Item>

                            <Carousel.Item>
                                <img
                                    className="d-block w-100 rounded shadow"
                                    src={slika2}
                                    alt="Uzbudi osjetila"
                                    style={{ height: "450px", objectFit: "cover" }}
                                />
                                <Carousel.Caption>
                                    <h5 className="bg-dark bg-opacity-75 p-2 rounded">Uzbudi osjetila!</h5>
                                </Carousel.Caption>
                            </Carousel.Item>

                            <Carousel.Item>
                                <img
                                    className="d-block w-100 rounded shadow"
                                    src={slika3}
                                    alt="Spoj prirode i okusa"
                                    style={{ height: "450px", objectFit: "cover" }}
                                />
                                <Carousel.Caption>
                                    <h5 className="bg-dark bg-opacity-75 p-2 rounded">Spoj prirode i okusa!</h5>
                                </Carousel.Caption>
                            </Carousel.Item>
                        </Carousel>
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