import { X, Share2, Heart } from 'lucide-react';
import { Button, Image, Chip } from '@nextui-org/react';
import type { Event } from '../../types';
import { shareEvent } from '../../utils/share';

interface EventHeroSectionProps {
  event: Event;
  isSaved: boolean;
  onSaveToggle: () => void;
  onClose: () => void;
}

export default function EventHeroSection({
  event,
  isSaved,
  onSaveToggle,
  onClose,
}: EventHeroSectionProps) {
  return (
    <div className="relative h-[280px] overflow-hidden group">
      <Image
        src={event.imageUrl}
        alt={event.title}
        removeWrapper
        classNames={{
          img: "absolute inset-0 w-full h-full object-cover brightness-90 group-hover:scale-105 transition-transform duration-700 ease-out"
        }}
      />
      
      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
      
      {/* Top Actions */}
      <div className="absolute top-4 right-4 flex gap-2 z-10">
        <Button
          isIconOnly
          radius="full"
          variant="flat"
          className="bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all"
          onClick={onSaveToggle}
        >
          <Heart 
            className={`${isSaved ? "fill-red-500 text-red-500" : "text-white"} 
              transition-colors duration-300`} 
            size={18} 
          />
        </Button>
        <Button
          isIconOnly
          radius="full"
          variant="flat"
          className="bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all"
          onClick={() => shareEvent(event)}
        >
          <Share2 className="text-white" size={18} />
        </Button>
        <Button
          isIconOnly
          radius="full"
          variant="flat"
          className="bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all"
          onClick={onClose}
        >
          <X className="text-white" size={18} />
        </Button>
      </div>

      {/* Event Title Overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-6 text-white z-10">
        <div className="flex items-center gap-2 mb-2">
          <Chip 
            color="primary" 
            variant="shadow"
            size="sm"
            classNames={{
              base: "bg-primary/90 backdrop-blur-md",
              content: "font-medium tracking-wide"
            }}
          >
            {event.category}
          </Chip>
          <Chip
            variant="flat"
            size="sm"
            classNames={{
              base: "bg-white/10 backdrop-blur-md",
              content: "text-white font-medium"
            }}
          >
            ${event.price}
          </Chip>
        </div>
        <h2 className="text-2xl font-bold mb-2 drop-shadow-lg line-clamp-2">
          {event.title}
        </h2>
        <p className="text-white/90 text-sm leading-relaxed drop-shadow-md line-clamp-2">
          {event.description}
        </p>
      </div>
    </div>
  );
}