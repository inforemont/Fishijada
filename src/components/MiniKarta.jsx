import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

let DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

export default function MiniKarta({ lat = 45.7602, lng = 18.6042, nazivMjesta = "Prvenstvo Baranje" }) {
    return (
        <div style={{ height: "350px", width: "100%", borderRadius: "10px", overflow: "hidden", marginTop: "20px" }}>
            <MapContainer 
                center={[lat, lng]} 
                zoom={13} 
                scrollWheelZoom={false} 
                style={{ height: "100%", width: "100%" }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[lat, lng]}>
                    <Popup>
                        {nazivMjesta}
                    </Popup>
                </Marker>
            </MapContainer>
        </div>
    );
}