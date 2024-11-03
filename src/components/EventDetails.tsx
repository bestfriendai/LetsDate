import { useEvents } from '../context/EventContext';
import { useState } from 'react';
import { Modal, ModalContent } from '@nextui-org/react';
import EventHeroSection from './event-details/EventHeroSection';
import EventDetailsSection from './event-details/EventDetailsSection';
import EventActionButtons from './event-details/EventActionButtons';

export default function EventDetails() {
  const { selectedEvent, setSelectedEvent } = useEvents();
  const [isSaved, setIsSaved] = useState(false);

  if (!selectedEvent) return null;

  return (
    <Modal
      isOpen={!!selectedEvent}
      onClose={() => setSelectedEvent(null)}
      size="2xl"
      backdrop="blur"
      classNames={{
        base: "bg-background/80 dark:bg-background/80 backdrop-blur-xl",
        wrapper: "max-h-[90vh] p-4",
        body: "p-0",
      }}
      motionProps={{
        variants: {
          enter: {
            y: 0,
            opacity: 1,
            transition: {
              duration: 0.3,
              ease: "easeOut"
            }
          },
          exit: {
            y: 20,
            opacity: 0,
            transition: {
              duration: 0.2,
              ease: "easeIn"
            }
          }
        }
      }}
    >
      <ModalContent>
        {() => (
          <div className="overflow-hidden rounded-large">
            <EventHeroSection
              event={selectedEvent}
              isSaved={isSaved}
              onSaveToggle={() => setIsSaved(!isSaved)}
              onClose={() => setSelectedEvent(null)}
            />
            <EventDetailsSection event={selectedEvent} />
            <EventActionButtons event={selectedEvent} />
          </div>
        )}
      </ModalContent>
    </Modal>
  );
}