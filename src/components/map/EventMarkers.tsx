import { Event } from '../../types';
import EventMarker from '../EventMarker';

interface EventMarkersProps {
  events: Event[];
}

export default function EventMarkers({ events }: EventMarkersProps) {
  return (
    <>
      {events.map((event) => (
        <EventMarker key={event.id} event={event} />
      ))}
    </>
  );
}