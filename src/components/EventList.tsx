import { useEvents } from '../context/EventContext';
import { Card, CardBody, Button, ScrollShadow, Chip, Input, Divider } from '@nextui-org/react';
import { X, Search, SlidersHorizontal, Calendar, MapPin } from 'lucide-react';
import { useState, useMemo } from 'react';

export default function EventList() {
  const { events, setSelectedEvent, clearEvents } = useEvents();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(events.map(event => event.category))];
    return ['All', ...uniqueCategories];
  }, [events]);

  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          event.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !selectedCategory || selectedCategory === 'All' || 
                            event.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [events, searchTerm, selectedCategory]);

  if (events.length === 0) return null;

  return (
    <div className="absolute top-20 right-4 bottom-24 z-10 w-full max-w-md pointer-events-none">
      <Card className="h-full bg-white/90 dark:bg-black/90 backdrop-blur-xl shadow-2xl pointer-events-auto">
        <CardBody className="p-0">
          {/* Header */}
          <div className="p-4 border-b border-default-200/50">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold">
                  Found {events.length} Events
                </h2>
                <p className="text-small text-default-500">
                  Click an event to view details
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  isIconOnly
                  variant="light"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className="text-default-600"
                >
                  <SlidersHorizontal size={18} />
                </Button>
                <Button
                  isIconOnly
                  variant="light"
                  size="sm"
                  onClick={clearEvents}
                  className="text-default-600"
                >
                  <X size={18} />
                </Button>
              </div>
            </div>

            {/* Filters */}
            {showFilters && (
              <div className="space-y-3">
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search events..."
                  startContent={<Search size={18} className="text-default-400" />}
                  size="sm"
                  variant="bordered"
                  classNames={{
                    input: "text-small",
                    inputWrapper: "h-9"
                  }}
                />
                
                <div className="flex flex-wrap gap-1">
                  {categories.map((category) => (
                    <Chip
                      key={category}
                      variant={selectedCategory === category ? "solid" : "bordered"}
                      color="primary"
                      className="cursor-pointer transition-all"
                      onClick={() => setSelectedCategory(category === selectedCategory ? null : category)}
                      size="sm"
                      classNames={{
                        base: "h-7",
                        content: "text-xs font-medium px-2"
                      }}
                    >
                      {category}
                    </Chip>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Event List */}
          <ScrollShadow className="h-[calc(100%-80px)]">
            <div className="divide-y divide-default-200/50">
              {filteredEvents.map((event) => (
                <div
                  key={event.id}
                  className="p-4 hover:bg-default-100 transition-colors cursor-pointer"
                  onClick={() => setSelectedEvent(event)}
                >
                  <div className="flex gap-4">
                    <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
                      <img
                        src={event.imageUrl}
                        alt={event.title}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="font-medium text-sm truncate">
                          {event.title}
                        </h3>
                        <Chip 
                          size="sm" 
                          variant="flat" 
                          color="primary"
                          classNames={{
                            base: "h-6",
                            content: "text-xs px-2"
                          }}
                        >
                          {event.category}
                        </Chip>
                      </div>
                      <p className="text-default-500 text-xs mb-2 line-clamp-2">
                        {event.description}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-default-600">
                            <Calendar size={14} />
                            <p className="text-xs">{event.date}</p>
                          </div>
                          <div className="flex items-center gap-1 text-default-600">
                            <MapPin size={14} />
                            <p className="text-xs truncate max-w-[150px]">
                              {event.location.name}
                            </p>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="flat"
                          color="primary"
                          className="text-xs h-7 px-3"
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {filteredEvents.length === 0 && (
                <div className="p-8 text-center text-default-500">
                  <p className="text-sm">No events match your search criteria</p>
                </div>
              )}
            </div>
          </ScrollShadow>
        </CardBody>
      </Card>
    </div>
  );
}