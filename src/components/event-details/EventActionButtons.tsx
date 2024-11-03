import { ExternalLink, Navigation2 } from 'lucide-react';
import { Button, Divider } from '@nextui-org/react';
import type { Event } from '../../types';

interface EventActionButtonsProps {
  event: Event;
}

export default function EventActionButtons({ event }: EventActionButtonsProps) {
  const handleGetDirections = () => {
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location.address)}`,
      '_blank'
    );
  };

  const handleBookNow = () => {
    if (event.ticketUrl) {
      window.open(event.ticketUrl, '_blank');
    }
  };

  return (
    <>
      <Divider />
      <div className="p-4">
        <div className="flex gap-3">
          <Button
            color="primary"
            size="lg"
            className="flex-1 h-11 font-medium"
            endContent={<ExternalLink size={16} />}
            onClick={handleBookNow}
          >
            Book Now
          </Button>
          <Button
            variant="bordered"
            size="lg"
            className="h-11 font-medium px-4"
            startContent={<Navigation2 size={16} />}
            onClick={handleGetDirections}
          >
            Directions
          </Button>
        </div>
      </div>
    </>
  );
}