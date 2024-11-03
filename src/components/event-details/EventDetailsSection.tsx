import { Calendar, Clock, MapPin, DollarSign, Tag } from 'lucide-react';
import { ModalBody, Divider, Card } from '@nextui-org/react';
import type { Event } from '../../types';
import EventDetailItem from './EventDetailItem';

interface EventDetailsSectionProps {
  event: Event;
}

export default function EventDetailsSection({ event }: EventDetailsSectionProps) {
  return (
    <ModalBody className="px-6 py-4">
      <Card className="bg-primary-50/50 dark:bg-primary-900/10 border-none">
        <div className="grid grid-cols-2 divide-x divide-primary-200/30">
          <EventDetailItem
            icon={Calendar}
            label="Date"
            value={event.date}
            className="p-4"
          />
          <EventDetailItem
            icon={Clock}
            label="Time"
            value={event.time}
            className="p-4"
          />
        </div>
      </Card>

      <Divider className="my-4" />

      <div className="space-y-4">
        <Card className="border-none bg-default-50/50 dark:bg-default-100/10">
          <EventDetailItem
            icon={MapPin}
            label="Location"
            value={event.location.name}
            subValue={event.location.address}
            className="p-4"
          />
        </Card>

        <div className="grid grid-cols-2 gap-4">
          <Card className="border-none bg-default-50/50 dark:bg-default-100/10">
            <EventDetailItem
              icon={DollarSign}
              label="Price"
              value={`$${event.price}`}
              subValue="per person"
              className="p-4"
            />
          </Card>
          <Card className="border-none bg-default-50/50 dark:bg-default-100/10">
            <EventDetailItem
              icon={Tag}
              label="Category"
              value={event.category}
              className="p-4"
            />
          </Card>
        </div>
      </div>

      <Divider className="my-4" />

      <div className="space-y-3">
        <h3 className="text-lg font-semibold">About this event</h3>
        <p className="text-default-600 leading-relaxed text-sm">
          {event.description}
        </p>
      </div>
    </ModalBody>
  );
}