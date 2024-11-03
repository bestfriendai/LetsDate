import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import { Event } from '../../types';

interface MapBoundsHandlerProps {
  events: Event[];
}

export default function MapBoundsHandler({ events }: MapBoundsHandlerProps) {
  const map = useMap();

  useEffect(() => {
    if (events.length > 0) {
      const bounds = new L.LatLngBounds([]);
      events.forEach(event => {
        bounds.extend(new L.LatLng(
          event.location.coordinates[0],
          event.location.coordinates[1]
        ));
      });
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [events, map]);

  return null;
}