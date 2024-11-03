import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

const userIcon = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

interface UserMarkerProps {
  position: [number, number];
}

export default function UserMarker({ position }: UserMarkerProps) {
  return (
    <Marker position={position} icon={userIcon}>
      <Popup>
        <div className="p-2">
          <p className="font-medium">Your Location</p>
        </div>
      </Popup>
    </Marker>
  );
}