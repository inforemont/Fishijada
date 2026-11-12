import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import { useEffect } from 'react'


function LeafletScrollHandler() {
    const map = useMap()

    useEffect(() => {
        if (!map) return


        const handleMapClick = () => {
            map.scrollWheelZoom.enable();
        }

        const handleDocumentClick = (e) => {
            if (!map.getContainer().contains(e.target)) {
                map.scrollWheelZoom.disable()
            }
        }

        const container = map.getContainer();
        container.addEventListener('click', handleMapClick)
        document.addEventListener('click', handleDocumentClick)

        return () => {
            container.removeEventListener('click', handleMapClick)
            document.removeEventListener('click', handleDocumentClick)
        }
    }, [map])

    return null
}

export default function MiniKarta({ lat, lng, nazivMjesta }) {
    return (
        <MapContainer
            center={[lat, lng]}
            zoom={12}
            scrollWheelZoom={false}
            style={{ height: "350px", width: "100%", borderRadius: "8px" }}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; OpenStreetMap contributors'
            />
            <Marker position={[lat, lng]}>
                <Popup>{nazivMjesta}</Popup>
            </Marker>
            <LeafletScrollHandler />
        </MapContainer>
    )
}