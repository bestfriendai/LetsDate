import { Icon } from 'leaflet';
import { Marker, Popup } from 'react-leaflet';
import type { Event } from '../types';
import { useEvents } from '../context/EventContext';
import { Card, CardBody, Button, Image } from '@nextui-org/react';

const categoryColors = {
  'Arts': 'violet',
  'Restaurants': 'red',
  'Movies': 'blue',
  'Outdoors': 'green',
  'Events': 'orange',
  'Concert': 'pink',
  'Sports': 'yellow',
  'Theater': 'purple',
  'Festival': 'gold',
  'default': 'blue'
};

const createEventIcon = (category: string) => new Icon({
  iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${
    categoryColors[category as keyof typeof categoryColors] || categoryColors.default
  }.png`,
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface EventMarkerProps {
  event: Event;
}

export default function EventMarker({ event }: EventMarkerProps) {
  const { setSelectedEvent } = useEvents();

  return (
    <Marker
      position={event.location.coordinates}
      icon={createEventIcon(event.category)}
      eventHandlers={{
        click: () => setSelectedEvent(event),
      }}
    >
      <Popup>
        <Card className="w-[300px] border-none">
          <CardBody className="p-0">
            <Image
              src={event.imageUrl}
              alt={event.title}
              className="w-full h-32 object-cover"
            />
            <div className="p-3 space-y-2">
              <h3 className="font-semibold text-base">{event.title}</h3>
              <p className="text-sm text-default-500">{event.location.name}</p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">${event.price}</p>
                  <p className="text-xs text-default-400">{event.date}</p>
                </div>
                <Button 
                  color="primary" 
                  size="sm"
                  onClick={() => setSelectedEvent(event)}
                >
                  View Details
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>
      </Popup>
    </Marker>
  );
}