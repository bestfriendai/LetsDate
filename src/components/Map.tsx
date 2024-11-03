import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, ZoomControl, useMap } from 'react-leaflet';
import { useEvents } from '../context/EventContext';
import UserMarker from './map/UserMarker';
import EventMarkers from './map/EventMarkers';
import LoadingOverlay from './map/LoadingOverlay';
import 'leaflet/dist/leaflet.css';

// Component to handle map view updates
function MapController({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, zoom);
  }, [map, center, zoom]);

  return null;
}

export default function Map() {
  const [userLocation, setUserLocation] = useState<[number, number]>([40.7128, -74.0060]);
  const { events, loading, selectedLocation } = useEvents();

  useEffect(() => {
    if (selectedLocation) {
      setUserLocation([
        parseFloat(selectedLocation.lat),
        parseFloat(selectedLocation.lon)
      ]);
    }
  }, [selectedLocation]);

  return (
    <div className="w-full h-full">
      <MapContainer
        center={userLocation}
        zoom={12}
        className="w-full h-full"
        zoomControl={false}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ZoomControl position="bottomright" />
        <UserMarker position={userLocation} />
        <EventMarkers events={events} />
        <MapController center={userLocation} zoom={12} />
      </MapContainer>
      {loading && <LoadingOverlay />}
    </div>
  );
}